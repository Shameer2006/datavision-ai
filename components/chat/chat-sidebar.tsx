"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  groupConversationsByDate,
  type Conversation,
} from "@/lib/chat-store";

interface ChatSidebarProps {
  className?: string;
  activeChatId?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  /** Bump this number to force the sidebar to re-read localStorage. */
  refreshKey?: number;
}

export function ChatSidebar({
  className,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  refreshKey,
}: ChatSidebarProps) {
  const [groups, setGroups] = React.useState<
    { label: string; items: Conversation[] }[]
  >([]);
  const [userName, setUserName] = React.useState("User Account");

  // Re-read conversations whenever refreshKey changes (or on mount)
  React.useEffect(() => {
    setGroups(groupConversationsByDate());
    const stored = localStorage.getItem("datavision_user_name");
    if (stored) setUserName(stored);
  }, [refreshKey]);

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
          onClick={onNewChat}
        >
          <PlusIcon className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-6 pb-4">
          {groups.length === 0 && (
            <div className="px-2 py-8 text-center text-xs text-sidebar-foreground/50">
              No conversations yet
            </div>
          )}
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <div className="px-2 py-2 text-xs font-medium text-sidebar-foreground/70">
                {group.label}
              </div>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectChat?.(item.id)}
                    className={cn(
                      "group relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                      activeChatId === item.id &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <MessageSquareIcon className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate">{item.title}</span>
                    <div className="absolute right-1 hidden group-hover:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-sidebar-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat?.(item.id);
                        }}
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
        <Link href="/account">
          <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <div className="h-6 w-6 rounded-full overflow-hidden bg-muted shrink-0">
              <Image src="/icon.png" alt="User" width={24} height={24} className="object-cover" />
            </div>
            <span className="text-sm font-medium truncate">
              {userName}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
