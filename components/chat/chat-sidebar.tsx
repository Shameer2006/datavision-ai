"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

const HISTORY_MOCK: Record<string, ChatHistoryItem[]> = {
  Today: [
    { id: "1", title: "Analyze Sales Data Q3", date: "Today" },
    { id: "2", title: "Generate Python Script", date: "Today" },
  ],
  Yesterday: [
    { id: "3", title: "Fix Database Connection", date: "Yesterday" },
  ],
  "Previous 7 Days": [
    { id: "4", title: "Explain Async/Await", date: "Previous 7 Days" },
    { id: "5", title: "Write Marketing Copy", date: "Previous 7 Days" },
  ],
};

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-[260px] flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <PlusIcon className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-6 pb-4">
          {Object.entries(HISTORY_MOCK).map(([group, items]) => (
            <div key={group} className="flex flex-col gap-1">
              <div className="px-2 py-2 text-xs font-medium text-sidebar-foreground/70">
                {group}
              </div>
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <MessageSquareIcon className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{item.title}</span>
                    <div className="absolute right-1 hidden group-hover:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-sidebar-foreground hover:text-destructive"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
            U
          </div>
          <span className="text-sm font-medium">User Account</span>
        </Button>
      </div>
    </div>
  );
}
