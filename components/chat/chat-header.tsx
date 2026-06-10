"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatSidebar } from "./chat-sidebar";

interface ChatHeaderProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  activeChatId?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  sidebarRefreshKey?: number;
}

export function ChatHeader({
  currentModel,
  onModelChange,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  sidebarRefreshKey,
}: ChatHeaderProps) {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <ChatSidebar
              activeChatId={activeChatId}
              onSelectChat={(id) => {
                onSelectChat?.(id);
                setOpen(false);
              }}
              onNewChat={() => {
                onNewChat?.();
                setOpen(false);
              }}
              onDeleteChat={onDeleteChat}
              refreshKey={sidebarRefreshKey}
            />
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-2 text-lg font-semibold hover:bg-accent/50" />
            }
          >
            {currentModel}
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onModelChange("DataVision Flash")}>
              DataVision Flash
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModelChange("DataVision Pro")}>
              DataVision Pro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
