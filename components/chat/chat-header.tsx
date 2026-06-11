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
import { ChevronDownIcon, MenuIcon, MoonIcon, SunIcon, Lock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatSidebar } from "./chat-sidebar";
import Link from "next/link";

interface ChatHeaderProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  userPlan?: string;
  activeChatId?: string;
  onSelectChat?: (id: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  sidebarRefreshKey?: number;
}

export function ChatHeader({
  currentModel,
  onModelChange,
  userPlan = "free",
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  sidebarRefreshKey,
}: ChatHeaderProps) {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showUpgradeToast, setShowUpgradeToast] = React.useState(false);

  React.useEffect(() => {
    if (showUpgradeToast) {
      const timer = setTimeout(() => setShowUpgradeToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showUpgradeToast]);

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
          <DropdownMenuContent align="start" className="w-48 bg-zinc-950 border border-white/10 text-zinc-200">
            <DropdownMenuItem onClick={() => onModelChange("DataVision Flash")} className="focus:bg-white/5 cursor-pointer">
              DataVision Flash
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                if (userPlan === "pro" || userPlan === "enterprise") {
                  onModelChange("DataVision Pro");
                } else {
                  setShowUpgradeToast(true);
                }
              }}
              className="flex items-center justify-between focus:bg-white/5 cursor-pointer"
            >
              <span>DataVision Pro</span>
              {(userPlan !== "pro" && userPlan !== "enterprise") && (
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
              )}
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

      {showUpgradeToast && (
        <div className="fixed top-4 right-4 z-50 flex w-96 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-xl">
            {/* Gradient border indicator */}
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
            
            <div className="flex-1 pl-2">
              <h4 className="text-sm font-semibold text-zinc-100">Upgrade to Pro</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                DataVision Pro features our most advanced visual analytical models. Upgrade to unlock this model and get 1,000 daily credits.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/account" className="inline-flex h-8 items-center justify-center rounded-lg bg-amber-500 text-amber-950 px-3 text-xs font-semibold hover:bg-amber-400 transition-colors">
                  Upgrade Now
                </Link>
                <button 
                  onClick={() => setShowUpgradeToast(false)}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-white/5 px-3 text-xs font-semibold text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
