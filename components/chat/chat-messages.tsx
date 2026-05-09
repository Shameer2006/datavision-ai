"use client";

import * as React from "react";
import { Message, MessageBubble } from "./message-bubble";
import { WelcomeScreen } from "./welcome-screen";
import { TypingIndicator } from "./typing-indicator";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onSuggest: (text: string) => void;
}

export function ChatMessages({ messages, isTyping, onSuggest }: ChatMessagesProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return <WelcomeScreen onSuggest={onSuggest} />;
  }

  return (
    <div className="flex w-full flex-col items-center pb-8">
      <div className="flex w-full max-w-3xl flex-col gap-2">
        {messages.map((message, index) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            isLast={index === messages.length - 1} 
          />
        ))}
        {isTyping && (
          <div className="flex w-full px-4 sm:px-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chart-2 text-xs font-semibold text-primary-foreground">
              DV
            </div>
            <TypingIndicator className="ml-2" />
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
