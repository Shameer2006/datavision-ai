import * as React from "react";
import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 p-2", className)}>
      <span className="typing-dot h-2 w-2 rounded-full bg-foreground" />
      <span className="typing-dot h-2 w-2 rounded-full bg-foreground" />
      <span className="typing-dot h-2 w-2 rounded-full bg-foreground" />
    </div>
  );
}
