"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  isTyping: boolean;
}

export function ChatInput({ onSend, isTyping }: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const [stagedFile, setStagedFile] = React.useState<File | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedFile(file);
      // Clear input so the same file can be selected again if needed
      e.target.value = '';
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const removeStagedFile = () => {
    setStagedFile(null);
  };

  const handleSend = () => {
    if ((!input.trim() && !stagedFile) || isTyping) return;
    onSend(input, stagedFile || undefined);
    setInput("");
    setStagedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="relative flex w-full flex-col bg-background p-4">
      <div className="relative flex w-full max-w-3xl mx-auto flex-col rounded-2xl border border-input bg-card shadow-sm focus-within:ring-1 focus-within:ring-ring">
        {stagedFile && (
          <div className="flex items-center gap-2 border-b p-3 pt-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="truncate text-sm font-medium">{stagedFile.name}</span>
              <span className="text-xs text-muted-foreground">{(stagedFile.size / 1024).toFixed(1)} KB</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={removeStagedFile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv, .xls, .xlsx"
          onChange={handleFileChange}
        />
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message DataVision AI..."
          className="min-h-[52px] w-full resize-none border-0 bg-transparent py-3.5 pr-12 pl-12 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
          rows={1}
          style={{ maxHeight: "200px" }}
        />
        <div className="absolute left-2 bottom-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Attach file"
            onClick={handleFileClick}
          >
            <PaperclipIcon className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        </div>
        <div className="absolute right-2 bottom-2 flex items-center">
          <Button
            size="icon"
            className="h-8 w-8 rounded-full transition-all"
            onClick={handleSend}
            disabled={(!input.trim() && !stagedFile) || isTyping}
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      <div className="mt-2 text-center text-xs text-muted-foreground">
        DataVision can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
}
