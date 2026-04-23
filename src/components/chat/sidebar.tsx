"use client";

import * as React from "react";
import { Plus, MessageSquare, Settings, User, Key, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from "lucide-react";
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
import { ApiKeyModal } from "@/components/settings/api-key-modal";
import { hasStoredApiKey } from "@/lib/api-key-store";

const history: any[] = [];

export function ChatSidebar() {
  const [apiKeyModalOpen, setApiKeyModalOpen] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(false);

  React.useEffect(() => {
    setHasKey(hasStoredApiKey());
  }, []);

  const handleApiKeySaved = () => {
    setHasKey(true);
    setApiKeyModalOpen(false);
  };

  return (
    <>
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
          {/* API Key Status Banner */}
          {!hasKey && (
            <div className="mx-3 mb-2">
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className="w-full flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left hover:bg-amber-100/70 transition-colors group"
              >
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">API key required</p>
                  <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
                    Add your Gemini API key to start analyzing data.
                  </p>
                  <span className="text-[11px] font-medium text-amber-700 group-hover:underline mt-1 inline-block">
                    Configure now
                  </span>
                </div>
              </button>
            </div>
          )}

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-[calc(100vh-320px)]">
                {history.length === 0 ? (
                  <div className="px-4 py-6 text-xs text-muted-foreground/60 text-center font-medium">
                    No recent conversations.
                  </div>
                ) : (
                  <SidebarMenu className="px-2 space-y-1">
                    {history.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton className="w-full justify-start gap-3 py-6 px-3 rounded-xl hover:bg-foreground/5 transition-colors group">
                          <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-sm truncate w-full text-foreground/80 group-hover:text-foreground">
                              {chat.title}
                            </span>
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
              <SidebarMenuButton
                className="w-full justify-start gap-3 py-6 px-3 rounded-xl hover:bg-foreground/5 transition-colors cursor-pointer"
                onClick={() => setApiKeyModalOpen(true)}
              >
                <div className="relative">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  {hasKey && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-sidebar-foreground">Gemini API Key</span>
                  <span className={`text-[10px] ${hasKey ? "text-green-600" : "text-amber-500"}`}>
                    {hasKey ? "Configured" : "Not configured"}
                  </span>
                </div>
                {hasKey ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 ml-auto" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
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

      <ApiKeyModal
        open={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSaved={handleApiKeySaved}
      />
    </>
  );
}
