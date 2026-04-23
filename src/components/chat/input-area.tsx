"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Globe, FileSpreadsheet, Database, X, Upload } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Attachment } from "@/lib/types";

interface ChatInputProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (disabled) return;
    if (input.trim() || attachments.length > 0) {
      onSend(input, attachments);
      setInput("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual File object for upload
      setAttachments((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: file.name,
          type: "file",
          file: file,
        },
      ]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConnectSheet = () => {
    setAttachments((prev) => [...prev, { id: Date.now().toString(), name: "Connected: Sales Data", type: "google-sheet" }]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter(a => a.id !== id));
  };

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 lg:px-0 pb-6 pt-2 bg-background">
      <div className="relative group">
        <div className="absolute -inset-px bg-foreground/5 rounded-3xl blur-xl group-focus-within:bg-foreground/10 transition-all opacity-0 group-focus-within:opacity-100" />
        
        <div className="relative bg-background border border-foreground/10 rounded-3xl p-3 focus-within:border-foreground/20 focus-within:ring-1 focus-within:ring-foreground/5 transition-all shadow-sm">
          
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 px-2 pt-1">
              {attachments.map((att) => (
                <div key={att.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-md text-xs font-medium text-foreground">
                  {att.type === 'file' ? <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" /> : <Database className="w-3.5 h-3.5 text-blue-500" />}
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  <button onClick={() => handleRemoveAttachment(att.id)} className="ml-1 text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full bg-transparent border-none outline-none resize-none px-2 text-[15px] leading-relaxed max-h-48 min-h-[44px] focus-visible:ring-0 placeholder:text-muted-foreground/50 shadow-none overflow-y-auto pt-2"
            placeholder={disabled ? "Analyzing your data..." : "Describe your data or ask for a visualization..."}
            rows={1}
          />
          
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger 
                  className={buttonVariants({ variant: "ghost", size: "icon", className: "w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5" })}
                >
                  <Paperclip className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-[200px] mb-2 p-1 border-foreground/10 shadow-lg bg-background/95 backdrop-blur-md">
                  <DropdownMenuItem onClick={handleUploadClick} className="gap-2.5 cursor-pointer py-2 focus:bg-foreground/5">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Upload CSV / Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleConnectSheet} className="gap-2.5 cursor-pointer py-2 focus:bg-foreground/5">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Connect Google Sheets</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
            
            <Button 
              size="icon" 
              onClick={handleSubmit}
              disabled={disabled || (!input.trim() && attachments.length === 0)}
              className="w-8 h-8 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all group/send disabled:opacity-50"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-[11px] text-center mt-4 text-muted-foreground/50 font-mono tracking-wider uppercase">
        DataVision AI can produce errors. Always verify metadata mappings.
      </p>
    </div>
  );
}
