"use client";

import * as React from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Message } from "@/components/chat/message-bubble";

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState("DataVision Flash");
  const [cachedSchema, setCachedSchema] = React.useState<string>("");
  const [cachedDfJson, setCachedDfJson] = React.useState<string>("");

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: file ? { name: file.name, type: file.type } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("message", content);
      if (file) {
        formData.append("file", file);
      } else if (cachedSchema) {
        // No new file — send cached data from previous upload
        formData.append("cached_schema", cachedSchema);
        formData.append("cached_df_json", cachedDfJson);
      }

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the schema and data for follow-up messages
      if (data.cached_schema) {
        setCachedSchema(data.cached_schema);
        setCachedDfJson(data.cached_df_json || "");
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text_overview || "I processed your request but couldn't generate a text response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        plotly_config: data.plotly_config || null,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the backend server is running on http://localhost:8000.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Background Grid Pattern (visible in light mode primarily) */}
      <div className="absolute inset-0 z-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] dark:[mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex z-10">
        <ChatSidebar className="border-r" />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col z-10">
        <ChatHeader 
          currentModel={currentModel} 
          onModelChange={setCurrentModel} 
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
