"use client";

import * as React from "react";
import { Plus, MessageSquare, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// We keep this empty for now so the sidebar matches a fresh ChatGPT session context.
const history: any[] = []; 

export function ChatSidebar() {
  return (
    <Sidebar className="border-r border-foreground/5 bg-sidebar font-sans">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-display tracking-tight text-sidebar-foreground">DataVision</span>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-background/50 border-foreground/10 hover:bg-foreground/5 transition-all rounded-xl h-11 shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New chat</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {history.length === 0 ? (
                <div className="px-4 py-6 text-xs text-muted-foreground/60 text-center font-medium">
                  No recent conversations.
                </div>
              ) : (
                <SidebarMenu className="px-2 space-y-1">
                  {history.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton 
                        className="w-full justify-start gap-3 py-6 px-3 rounded-xl hover:bg-foreground/5 transition-colors group"
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="text-sm truncate w-full text-foreground/80 group-hover:text-foreground">{chat.title}</span>
                          <span className="text-[10px] text-muted-foreground">{chat.date}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-foreground/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 py-6 px-3 rounded-xl hover:bg-foreground/5 transition-colors">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-sidebar-foreground">Premium User</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-3 py-6 px-3 rounded-xl hover:bg-foreground/5 transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-sidebar-foreground">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
