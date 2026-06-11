"use client";

import * as React from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message-bubble";
import { BackendWaker } from "@/components/chat/backend-waker";
import { createConversation,
  getConversation,
  saveConversation,
  deleteConversation,
  getActiveChatId,
  setActiveChatId,
  getAllConversations,
  type Conversation,
} from "@/lib/chat-store";

export default function ChatPage() {
  // -- active conversation state --
  const [activeChat, setActiveChat] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState("DataVision Flash");
  const [cachedSchema, setCachedSchema] = React.useState<string>("");
  const [cachedDfJson, setCachedDfJson] = React.useState<string>("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [userPlan, setUserPlan] = React.useState<string>("free");

  // Load active plan from API
  React.useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((data) => {
        if (data?.plan?.plan_id) {
          setUserPlan(data.plan.plan_id);
        }
      })
      .catch((err) => console.error("Error loading user plan:", err));
  }, []);

  // bumped whenever sidebar needs re-reading
  const [sidebarRefresh, setSidebarRefresh] = React.useState(0);
  const refreshSidebar = () => setSidebarRefresh((n) => n + 1);

  // -------------------------------------------------------------------
  // Load or create an active conversation on mount
  // -------------------------------------------------------------------
  React.useEffect(() => {
    const savedId = getActiveChatId();
    const all = getAllConversations();

    let conv: Conversation | undefined;
    if (savedId) conv = getConversation(savedId);
    if (!conv && all.length > 0) conv = all[0];
    if (!conv) conv = createConversation();

    setActiveChatId(conv.id);
    setActiveChat(conv);
    setMessages(conv.messages);
    setCachedSchema(conv.cachedSchema);
    setCachedDfJson(conv.cachedDfJson);
    refreshSidebar();
  }, []);

  // -------------------------------------------------------------------
  // Switch to an existing conversation
  // -------------------------------------------------------------------
  const handleSelectChat = (id: string) => {
    // save current chat first
    if (activeChat) {
      activeChat.messages = messages;
      activeChat.cachedSchema = cachedSchema;
      activeChat.cachedDfJson = cachedDfJson;
      saveConversation(activeChat);
    }

    const conv = getConversation(id);
    if (!conv) return;

    setActiveChatId(conv.id);
    setActiveChat(conv);
    setMessages(conv.messages);
    setCachedSchema(conv.cachedSchema);
    setCachedDfJson(conv.cachedDfJson);
    setIsTyping(false);
    refreshSidebar();
  };

  // -------------------------------------------------------------------
  // Create a new conversation
  // -------------------------------------------------------------------
  const handleNewChat = () => {
    // save current chat first
    if (activeChat) {
      activeChat.messages = messages;
      activeChat.cachedSchema = cachedSchema;
      activeChat.cachedDfJson = cachedDfJson;
      saveConversation(activeChat);
    }

    const conv = createConversation();
    setActiveChatId(conv.id);
    setActiveChat(conv);
    setMessages([]);
    setCachedSchema("");
    setCachedDfJson("");
    refreshSidebar();
  };

  // -------------------------------------------------------------------
  // Delete a conversation
  // -------------------------------------------------------------------
  const handleDeleteChat = (id: string) => {
    deleteConversation(id);

    // if we deleted the active chat, switch to another or create new
    if (activeChat?.id === id) {
      const all = getAllConversations();
      if (all.length > 0) {
        const next = all[0];
        setActiveChatId(next.id);
        setActiveChat(next);
        setMessages(next.messages);
        setCachedSchema(next.cachedSchema);
        setCachedDfJson(next.cachedDfJson);
      } else {
        const conv = createConversation();
        setActiveChatId(conv.id);
        setActiveChat(conv);
        setMessages([]);
        setCachedSchema("");
        setCachedDfJson("");
      }
    }
    refreshSidebar();
  };

  // Ref that always holds the current active chat id — used by async
  // callbacks to check whether the user is still viewing the same chat.
  const activeChatRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    activeChatRef.current = activeChat?.id ?? null;
  }, [activeChat]);

  // -------------------------------------------------------------------
  // Send a message
  // -------------------------------------------------------------------
  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;
    if (!activeChat) return;

    // Pin the conversation this message belongs to
    const originChatId = activeChat.id;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim() || `Analyze dataset: ${file?.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: file ? { name: file.name, type: file.type } : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    // persist immediately so the sidebar title updates
    activeChat.messages = newMessages;
    activeChat.cachedSchema = cachedSchema;
    activeChat.cachedDfJson = cachedDfJson;
    saveConversation(activeChat);
    refreshSidebar();

    try {
      const formData = new FormData();
      formData.append("message", content);
      formData.append("model", currentModel);
      if (file) {
        formData.append("file", file);
      } else if (cachedSchema) {
        formData.append("cached_schema", cachedSchema);
        formData.append("cached_df_json", cachedDfJson);
      }

      // Call Next.js API route — handles credits + rate limits server-side
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text_overview || "I processed your request but couldn't generate a text response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        plotly_config: data.plotly_config || null,
      };

      const originConv = getConversation(originChatId);
      if (originConv) {
        originConv.messages = [...originConv.messages, aiResponse];
        if (data.cached_schema) {
          originConv.cachedSchema = data.cached_schema;
          originConv.cachedDfJson = data.cached_df_json || "";
        }
        saveConversation(originConv);
        refreshSidebar();
      }

      if (activeChatRef.current === originChatId) {
        if (data.cached_schema) {
          setCachedSchema(data.cached_schema);
          setCachedDfJson(data.cached_df_json || "");
        }
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Save error to originating conversation
      const originConv = getConversation(originChatId);
      if (originConv) {
        originConv.messages = [...originConv.messages, errorMessage];
        saveConversation(originConv);
        refreshSidebar();
      }

      // Only update UI if still viewing the same chat
      if (activeChatRef.current === originChatId) {
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      // Only clear typing indicator if still on the same chat
      if (activeChatRef.current === originChatId) {
        setIsTyping(false);
      }
    }
  };

  // -------------------------------------------------------------------
  // Drag & drop
  // -------------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === "csv" || ext === "xls" || ext === "xlsx") {
        await handleSendMessage("", file);
      }
    }
  };

  return (
    <div
      className="relative flex h-dvh w-full overflow-hidden bg-background"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Ambient Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[70%] rounded-full bg-primary/10 blur-[130px] animate-blob-spin opacity-80" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[60%] rounded-full bg-chart-2/10 blur-[140px] animate-blob-spin opacity-80" style={{ animationDirection: 'reverse', animationDuration: '35s' }} />
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)] dark:[mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_85%)] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex z-10">
        <ChatSidebar
          className="border-r border-border/60"
          activeChatId={activeChat?.id}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          refreshKey={sidebarRefresh}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col z-10 bg-background/20 backdrop-blur-[1px]">
        <ChatHeader
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          userPlan={userPlan}
          activeChatId={activeChat?.id}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          sidebarRefreshKey={sidebarRefresh}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="h-full w-full py-4">
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              onSuggest={handleSendMessage}
            />
          </div>
        </main>

        <div className="w-full">
          <ChatInput onSend={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>

      <BackendWaker />

      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto rounded-3xl border-2 border-dashed border-primary bg-card/90 shadow-2xl text-center scale-95 animate-in zoom-in-95 duration-200">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Drop your dataset here</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Upload your CSV, XLS, or XLSX sheet directly and let DataVision analyze it instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
