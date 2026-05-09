"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlotlyChart } from "./plotly-chart";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachment?: { name: string; type?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotly_config?: { data: any[]; layout?: any } | null;
}

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex w-full gap-4 py-4 px-4 sm:px-0 fade-in-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-chart-2 text-primary-foreground"
        )}
      >
        {isUser ? "U" : "DV"}
      </div>

      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-5 py-3 text-sm",
            isUser
              ? "bg-secondary text-secondary-foreground"
              : "bg-transparent text-foreground"
          )}
        >
          {/* Simple text rendering. For markdown, we'd use react-markdown here */}
          {message.attachment && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-background/50 p-2 text-sm border">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium">{message.attachment.name}</span>
                <span className="text-xs text-muted-foreground opacity-70">Attached File</span>
              </div>
            </div>
          )}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Plotly Chart for AI responses */}
        {!isUser && message.plotly_config && (
          <PlotlyChart config={message.plotly_config} />
        )}
        
        <div
          className={cn(
            "flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
              title="Copy message"
            >
              {copied ? (
                <CheckIcon className="h-3 w-3 text-green-500" />
              ) : (
                <CopyIcon className="h-3 w-3 text-muted-foreground" />
              )}
              <span className="sr-only">Copy message</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
