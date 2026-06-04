"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  User,
  Moon,
  Sun,
  Palette,
  Trash2,
  Download,
  KeyRound,
  Shield,
  LogOut,
  CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
} from "@/lib/api-key-store";

export default function AccountPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [apiKeySaved, setApiKeySaved] = React.useState(false);
  const [chatCount, setChatCount] = React.useState(0);
  const [messageCount, setMessageCount] = React.useState(0);

  // Load saved data
  React.useEffect(() => {
    const savedName = localStorage.getItem("datavision_user_name") || "";
    const savedEmail = localStorage.getItem("datavision_user_email") || "";
    const savedKey = getStoredApiKey() || "";
    setName(savedName);
    setEmail(savedEmail);
    setApiKey(savedKey);

    // Count chats and messages
    try {
      const raw = localStorage.getItem("datavision_chats");
      if (raw) {
        const chats = JSON.parse(raw);
        setChatCount(chats.length);
        setMessageCount(
          chats.reduce(
            (acc: number, c: { messages: unknown[] }) =>
              acc + (c.messages?.length || 0),
            0
          )
        );
      }
    } catch {
      /* empty */
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("datavision_user_name", name);
    localStorage.setItem("datavision_user_email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
    } else {
      clearStoredApiKey();
    }
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleClearAllChats = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all conversations? This cannot be undone."
      )
    ) {
      localStorage.removeItem("datavision_chats");
      localStorage.removeItem("datavision_active_chat");
      setChatCount(0);
      setMessageCount(0);
    }
  };

  const handleExportChats = () => {
    const raw = localStorage.getItem("datavision_chats") || "[]";
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datavision-chats-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[60%] rounded-full bg-primary/5 blur-[130px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[50%] rounded-full bg-chart-2/5 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-3 h-14 px-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Account Settings</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        <section className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Profile</h2>
              <p className="text-xs text-muted-foreground">
                Your personal information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center shrink-0">
              <Image
                src="/icon.png"
                alt="DataVision AI"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">
                {name || "DataVision User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {email || "No email set"}
              </p>
              <div className="flex gap-3 text-xs text-muted-foreground pt-1">
                <span>
                  <strong className="text-foreground">{chatCount}</strong> chats
                </span>
                <span>
                  <strong className="text-foreground">{messageCount}</strong>{" "}
                  messages
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              className="h-9 px-4 rounded-lg text-sm gap-2"
            >
              {saved ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5" /> Saved
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </section>

        {/* API Key Section */}
        <section className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-[#221603] flex items-center justify-center text-[#f1a10d] shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold text-foreground">API Key</h2>
              <p className="text-xs text-muted-foreground">
                Your Gemini API key for AI features
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Alza..."
                  className="w-full h-11 px-3.5 pr-16 text-sm font-sans bg-transparent border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all text-foreground placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground hover:underline"
                >
                  Generate your DataVision API key
                </a>
              </p>
            </div>
            
            <div>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="bg-white hover:bg-neutral-200 text-black font-semibold h-10 px-5 rounded-lg text-sm transition-all duration-200 shadow-sm"
              >
                {apiKeySaved ? "Saved" : "Save API Key"}
              </button>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Appearance</h2>
              <p className="text-xs text-muted-foreground">
                Customize the look and feel
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-medium transition-all ${
                theme === "light"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-medium transition-all ${
                theme === "dark"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </section>

        {/* Data & Privacy Section */}
        <section className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Data & Privacy</h2>
              <p className="text-xs text-muted-foreground">
                Manage your conversation data
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExportChats}
              className="w-full flex items-center gap-3 px-4 h-11 rounded-xl border border-border bg-background hover:bg-accent text-sm transition-colors"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Export all conversations</span>
              <span className="ml-auto text-xs text-muted-foreground">
                JSON
              </span>
            </button>

            <button
              onClick={handleClearAllChats}
              className="w-full flex items-center gap-3 px-4 h-11 rounded-xl border border-destructive/30 bg-background hover:bg-destructive/5 text-sm text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete all conversations</span>
              <span className="ml-auto text-xs opacity-60">
                {chatCount} chats
              </span>
            </button>
          </div>
        </section>

        {/* Links Section */}
        <section className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 space-y-2">
          <Link
            href="/security"
            className="flex items-center gap-3 px-4 h-11 rounded-xl hover:bg-accent text-sm transition-colors"
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Security & Compliance</span>
            <ArrowLeft className="ml-auto h-4 w-4 text-muted-foreground rotate-180" />
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-3 px-4 h-11 rounded-xl hover:bg-accent text-sm transition-colors"
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Privacy Policy</span>
            <ArrowLeft className="ml-auto h-4 w-4 text-muted-foreground rotate-180" />
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-3 px-4 h-11 rounded-xl hover:bg-accent text-sm transition-colors"
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Terms of Service</span>
            <ArrowLeft className="ml-auto h-4 w-4 text-muted-foreground rotate-180" />
          </Link>
        </section>

        {/* Sign Out (placeholder) */}
        <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          DataVision AI v0.1.0
        </p>
      </main>
    </div>
  );
}
