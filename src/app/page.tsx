"use client";

import { useState, useCallback } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/sidebar";
import { ChatMessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/input-area";
import { saveDashboard } from "@/lib/dashboard-store";
import type { Message, Attachment, DashboardData } from "@/lib/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSendMessage = useCallback(async (content: string, attachments: Attachment[] = []) => {
    // Build user message content
    const formattedContent = attachments.length > 0
      ? content.trim() 
        ? `${content}\n\n📎 ${attachments.map(a => a.name).join(", ")}` 
        : `📎 ${attachments.map(a => a.name).join(", ")}`
      : content;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: formattedContent 
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if there's a file attachment to analyze
    const fileAttachment = attachments.find(a => a.type === "file" && a.file);

    if (fileAttachment?.file) {
      // Real AI analysis pipeline
      setIsAnalyzing(true);

      // Show loading message
      const loadingId = (Date.now() + 1).toString();
      const loadingMessage: Message = {
        id: loadingId,
        role: "assistant",
        content: "",
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        // Build FormData
        const formData = new FormData();
        formData.append("file", fileAttachment.file);
        formData.append("prompt", content.trim() || "Analyze this data and suggest the best visualizations");

        // Call API
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Analysis failed (${response.status})`);
        }

        const data = await response.json();

        // Remove loading message and add real response
        if (data.mode === "dashboard") {
          // Dashboard mode — save to localStorage and show preview
          const dashboardData: DashboardData = {
            id: data.dashboardId,
            title: data.title,
            description: data.description,
            createdAt: new Date().toISOString(),
            kpis: data.kpis || [],
            filters: data.filters || [],
            charts: (data.charts || []).map((c: any) => ({
              title: c.title,
              type: c.type,
              description: c.description,
              plotlyData: c.plotlyData || [],
              plotlyLayout: c.plotlyLayout || {},
            })),
            rawData: data.rawData || [],
          };

          saveDashboard(dashboardData);

          const dashboardMessage: Message = {
            id: loadingId,
            role: "assistant",
            content: data.insight || `I've created a comprehensive dashboard for your data.`,
            dashboardPreview: {
              dashboardId: data.dashboardId,
              title: data.title,
              description: data.description,
              chartCount: (data.charts || []).length,
              kpiCount: (data.kpis || []).length,
              filterCount: (data.filters || []).length,
            },
          };

          setMessages((prev) =>
            prev.map((m) => (m.id === loadingId ? dashboardMessage : m))
          );
        } else {
          // Chart mode — show inline chart
          const chartMessage: Message = {
            id: loadingId,
            role: "assistant",
            content: data.insight || data.description || "",
            inlineChart: {
              title: data.chart?.title || "Chart",
              type: data.chart?.type || "bar",
              description: data.chart?.description || "",
              insight: data.insight || "",
              plotlyData: data.chart?.plotlyData || [],
              plotlyLayout: data.chart?.plotlyLayout || {},
            },
          };

          setMessages((prev) =>
            prev.map((m) => (m.id === loadingId ? chartMessage : m))
          );
        }
      } catch (error: any) {
        // Show error message
        const errorMessage: Message = {
          id: loadingId,
          role: "assistant",
          content: `❌ ${error.message || "Something went wrong. Please try again."}`,
        };
        setMessages((prev) =>
          prev.map((m) => (m.id === loadingId ? errorMessage : m))
        );
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // No file — simple text response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: attachments.some(a => a.type === 'google-sheet')
            ? "Google Sheets integration is coming soon! For now, please export your sheet as CSV and upload it."
            : "Please upload a CSV or Excel file to get started with data visualization. You can use the 📎 button to attach a file.",
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 500);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex w-full h-full bg-background noise-overlay font-sans overflow-hidden">
        <ChatSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-background overflow-hidden relative w-full h-full">
          {/* Header */}
          <header className="absolute top-0 w-full z-30 flex h-14 shrink-0 items-center justify-between border-b 
            border-foreground/5 bg-background/50 backdrop-blur-md px-4 lg:px-8 transition-all">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-foreground/5" />
              <div className="h-4 w-px bg-foreground/10 mx-1" />
              <div className="flex flex-col">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest leading-none">Visualization Console</span>
                <span className="text-sm font-medium text-foreground">Active Session</span>
              </div>
            </div>
          </header>

          {/* Main App Area */}
          <main className="flex-1 flex flex-col overflow-hidden w-full h-full pt-14">
            <div className="flex-1 overflow-y-auto">
              <ChatMessageList messages={messages} onSuggestionClick={handleSendMessage} />
            </div>
            
            <div className="w-full bg-gradient-to-t from-background via-background to-transparent pt-6">
              <ChatInput onSend={handleSendMessage} disabled={isAnalyzing} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
