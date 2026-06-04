"use client";

import * as React from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message-bubble";
import {
  createConversation,
  getConversation,
  saveConversation,
  deleteConversation,
  getActiveChatId,
  setActiveChatId,
  getAllConversations,
  type Conversation,
} from "@/lib/chat-store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function Home() {
  const [activeChat, setActiveChat] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState("DataVision Flash");
  const [cachedSchema, setCachedSchema] = React.useState<string>("");
  const [cachedDfJson, setCachedDfJson] = React.useState<string>("");
  const [sidebarRefresh, setSidebarRefresh] = React.useState(0);
  const refreshSidebar = () => setSidebarRefresh((n) => n + 1);

  // Load or create active conversation on mount
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

  const handleSelectChat = (id: string) => {
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

  const handleNewChat = () => {
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

  const handleDeleteChat = (id: string) => {
    deleteConversation(id);
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

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;
    if (!activeChat) return;

    // Pin the conversation this message belongs to
    const originChatId = activeChat.id;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: file ? { name: file.name, type: file.type } : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);

    activeChat.messages = newMessages;
    activeChat.cachedSchema = cachedSchema;
    activeChat.cachedDfJson = cachedDfJson;
    saveConversation(activeChat);
    refreshSidebar();

    try {
      const formData = new FormData();
      formData.append("message", content);
      if (file) {
        formData.append("file", file);
      } else if (cachedSchema) {
        formData.append("cached_schema", cachedSchema);
        formData.append("cached_df_json", cachedDfJson);
      }

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text_overview || "I processed your request but couldn't generate a text response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        plotly_config: data.plotly_config || null,
      };

      // Always save to the ORIGINATING conversation in storage
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

      // Only update UI if still viewing the same chat
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
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the backend server is running on ${BACKEND_URL}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const originConv = getConversation(originChatId);
      if (originConv) {
        originConv.messages = [...originConv.messages, errorMessage];
        saveConversation(originConv);
        refreshSidebar();
      }

      if (activeChatRef.current === originChatId) {
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      if (activeChatRef.current === originChatId) {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] dark:[mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex z-10">
        <ChatSidebar
          className="border-r"
          activeChatId={activeChat?.id}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          refreshKey={sidebarRefresh}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col z-10">
        <ChatHeader 
          currentModel={currentModel} 
          onModelChange={setCurrentModel}
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
    </div>
  );
}
