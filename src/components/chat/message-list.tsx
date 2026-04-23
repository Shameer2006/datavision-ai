"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Message } from "@/lib/types";
import { BarChart3, LineChart, PieChart, Map } from "lucide-react";
import { InlineChart } from "./inline-chart";
import { DashboardPreview } from "./dashboard-preview";
import { AnalysisLoading } from "./analysis-loading";

interface ChatMessageListProps {
  messages: Message[];
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  { icon: <BarChart3 className="w-4 h-4" />, text: "Compare Q3 vs Q4 regional sales" },
  { icon: <LineChart className="w-4 h-4" />, text: "Show MRR growth over the last 12 months" },
  { icon: <PieChart className="w-4 h-4" />, text: "Breakdown user demographics by age" },
  { icon: <Map className="w-4 h-4" />, text: "Plot customer density across North America" },
];

export function ChatMessageList({ messages, onSuggestionClick }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4 lg:p-8 max-w-3xl mx-auto w-full pt-[20vh] pb-[10vh]">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center text-background shadow-sm">
            <span className="text-3xl font-display font-medium">V</span>
          </div>
          <h1 className="text-3xl font-display tracking-tight text-center">How can I help you visualize today?</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
          {suggestions.map((s, i) => (
            <Card 
              key={i}
              className="p-4 cursor-pointer hover:bg-foreground/5 border-foreground/10 transition-colors bg-background/50 shadow-none flex flex-col gap-3"
              onClick={() => onSuggestionClick(s.text)}
            >
              <div className="text-muted-foreground">{s.icon}</div>
              <p className="text-sm text-foreground/80 font-medium">{s.text}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 w-full">
      <div className="max-w-3xl mx-auto space-y-8 pb-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex gap-4 lg:gap-6 ${message.role === "assistant" ? "items-start" : "items-start flex-row-reverse"}`}
          >
            <Avatar className="w-8 h-8 rounded-lg shrink-0 border border-foreground/5 shadow-sm">
              {message.role === "assistant" ? (
                <div className="bg-foreground text-background flex items-center justify-center w-full h-full font-display text-xs">V</div>
              ) : (
                <div className="bg-muted text-muted-foreground flex items-center justify-center w-full h-full font-sans font-medium text-[10px]">U</div>
              )}
            </Avatar>
            
            <div className={`flex flex-col gap-2 max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              {/* Loading state */}
              {message.isLoading && (
                <AnalysisLoading />
              )}

              {/* Inline chart (Mode 1) */}
              {message.inlineChart && (
                <>
                  {message.content && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground pt-1">
                      {message.content}
                    </div>
                  )}
                  <InlineChart chart={message.inlineChart} />
                </>
              )}

              {/* Dashboard preview (Mode 2) */}
              {message.dashboardPreview && (
                <>
                  {message.content && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground pt-1">
                      {message.content}
                    </div>
                  )}
                  <DashboardPreview
                    dashboardId={message.dashboardPreview.dashboardId}
                    title={message.dashboardPreview.title}
                    description={message.dashboardPreview.description}
                    chartCount={message.dashboardPreview.chartCount}
                    kpiCount={message.dashboardPreview.kpiCount}
                    filterCount={message.dashboardPreview.filterCount}
                  />
                </>
              )}

              {/* Plain text (default) */}
              {!message.isLoading && !message.inlineChart && !message.dashboardPreview && (
                <div 
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "assistant" 
                      ? "text-foreground pt-1" 
                      : "bg-foreground/5 py-3 px-4 rounded-2xl rounded-tr-sm text-foreground/80"
                  }`}
                >
                  {message.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
