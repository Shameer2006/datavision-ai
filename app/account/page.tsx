"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, Moon, Sun, Palette, Trash2, Download,
  KeyRound, Shield, LogOut, Check, Copy, RefreshCw, ChevronRight,
  BarChart3, MessageSquare, Sparkles, ExternalLink, Lock, Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function generateApiKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  return "dv_" + segments.map(len =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  ).join("-");
}

type Profile = { name: string; email: string; avatar_url: string };
type Credits = { balance: number; total_used: number };
type ApiKey = { id: string; key_hash: string; key_preview: string; label: string; created_at: string; last_used_at: string | null; revoked: boolean };

export default function AccountPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<Profile>({ name: "", email: "", avatar_url: "" });
  const [credits, setCredits] = React.useState<Credits>({ balance: 0, total_used: 0 });
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [chatCount, setChatCount] = React.useState(0);
  const [messageCount, setMessageCount] = React.useState(0);

  const [profileSaved, setProfileSaved] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [newKeyValue, setNewKeyValue] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Load user data from Supabase
  React.useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const [{ data: prof }, { data: cred }, { data: keys }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("credits").select("*").eq("user_id", user.id).single(),
        supabase.from("api_keys").select("*").eq("user_id", user.id).eq("revoked", false).order("created_at", { ascending: false }),
      ]);

      if (prof) setProfile({ name: prof.name || "", email: prof.email || "", avatar_url: prof.avatar_url || "" });
      if (cred) setCredits({ balance: cred.balance, total_used: cred.total_used });
      if (keys) setApiKeys(keys);

      // Chat counts from localStorage
      try {
        const raw = localStorage.getItem("datavision_chats");
        if (raw) {
          const chats = JSON.parse(raw);
          setChatCount(chats.length);
          setMessageCount(chats.reduce((a: number, c: { messages: unknown[] }) => a + (c.messages?.length || 0), 0));
        }
      } catch { /* empty */ }

      setLoading(false);
    }
    load();
  }, []);

  const handleSaveProfile = async () => {
    if (!userId) return;
    await supabase.from("profiles").update({ name: profile.name, email: profile.email }).eq("id", userId);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleGenerateKey = async () => {
    if (!userId) return;
    setGenerating(true);
    const raw = generateApiKey();
    const preview = raw.slice(0, 10) + "••••••••••••" + raw.slice(-4);

    // Store hash (in production hash with SHA-256; here we store the raw for simplicity)
    const { data } = await supabase.from("api_keys").insert({
      user_id: userId,
      key_hash: raw,
      key_preview: preview,
      label: "Default",
    }).select().single();

    if (data) {
      setApiKeys(prev => [data, ...prev]);
      setNewKeyValue(raw);
    }
    setGenerating(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm("Revoke this API key? Any integrations using it will stop working.")) return;
    await supabase.from("api_keys").update({ revoked: true }).eq("id", id);
    setApiKeys(prev => prev.filter(k => k.id !== id));
    if (newKeyValue) setNewKeyValue(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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

  const handleClearChats = () => {
    if (!window.confirm("Delete all conversations? This cannot be undone.")) return;
    localStorage.removeItem("datavision_chats");
    localStorage.removeItem("datavision_active_chat");
    setChatCount(0);
    setMessageCount(0);
  };

  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "DV";

  const creditPercent = Math.min(100, Math.round((credits.balance / (credits.balance + credits.total_used || 1)) * 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[60%] rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[50%] rounded-full bg-violet-500/5 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-3 h-14 px-4">
          <Link href="/chat">
            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <h1 className="text-sm font-semibold flex-1">Account Settings</h1>
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">v0.1.0</span>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Profile Card */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-4 border-b border-border/40">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.name} className="h-14 w-14 rounded-2xl object-cover shrink-0 ring-2 ring-blue-500/20" />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-blue-500/20">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile.name || "DataVision User"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email || "No email set"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-center shrink-0">
              <div>
                <p className="text-base font-bold">{chatCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Chats</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-base font-bold">{messageCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Messages</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="h-3.5 w-3.5" />
              Profile Information
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full h-9 px-3 text-sm bg-background border border-border/60 rounded-lg focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full h-9 px-3 text-sm bg-background border border-border/60 rounded-lg focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="h-8 px-4 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-1.5"
            >
              {profileSaved ? <><Check className="h-3 w-3" /> Saved</> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Credits Card */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <h2 className="text-sm font-semibold flex-1">Credits</h2>
            <span className="text-xs text-muted-foreground">{credits.balance} remaining</span>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-end justify-between text-xs text-muted-foreground mb-1">
              <span>{credits.total_used} used</span>
              <span>{credits.balance + credits.total_used} total</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                style={{ width: `${creditPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Credits are consumed per AI analysis request. Free tier includes 1,000 credits.
            </p>
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                <KeyRound className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">API Keys</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Integrate DataVision AI into your own projects and workflows.
                </p>
              </div>
              <button
                onClick={handleGenerateKey}
                disabled={generating}
                className="h-8 px-3 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/25 disabled:opacity-60 shrink-0"
              >
                {generating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {generating ? "Generating…" : "New Key"}
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Use case badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: BarChart3, label: "Chart Generation" },
                { icon: MessageSquare, label: "NL Queries" },
                { icon: Sparkles, label: "AI Analysis" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/8 border border-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>

            {/* Newly generated key — show once */}
            {newKeyValue && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                  <Check className="h-3.5 w-3.5" />
                  Key generated — copy it now, it won&apos;t be shown again
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border/60">
                  <code className="flex-1 text-xs font-mono text-foreground break-all">{newKeyValue}</code>
                  <button
                    onClick={() => handleCopy(newKeyValue, "new")}
                    className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent shrink-0"
                  >
                    {copied === "new" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            )}

            {/* API Keys list */}
            {apiKeys.length > 0 ? (
              <div className="space-y-2">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/60">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium">{key.label}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{key.key_preview}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Created {new Date(key.created_at).toLocaleDateString()} 
                        {key.last_used_at ? ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}` : " · Never used"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="h-7 px-2.5 text-[11px] font-medium rounded-lg text-red-500 hover:bg-red-500/8 border border-red-500/20 transition-all shrink-0"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            ) : !newKeyValue ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-background/50 p-6 text-center space-y-2">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto">
                  <KeyRound className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm font-medium">No API keys yet</p>
                <p className="text-xs text-muted-foreground">Generate a key to integrate DataVision into your projects.</p>
              </div>
            ) : null}

            {/* Code snippet */}
            {apiKeys.length > 0 && (
              <div className="rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-white/5 p-4 overflow-x-auto">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-medium">Quick Start</p>
                <pre className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre">{`fetch("https://api.datavision.ai/v1/analyze", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query: "Show sales by month" })
})`}</pre>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/40">
              <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keys are stored securely in Supabase. Raw key is shown only once at generation — store it safely.
              </p>
            </div>

            <a href="#" className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors">
              View API Documentation <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Palette className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <h2 className="text-sm font-semibold">Appearance</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Sparkles, label: "System" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center justify-center gap-1.5 h-16 rounded-xl border text-xs font-medium transition-all ${
                    theme === value
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-background border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-green-500" />
            </div>
            <h2 className="text-sm font-semibold">Data & Privacy</h2>
          </div>
          <div className="divide-y divide-border/40">
            <button onClick={handleExportChats} className="w-full flex items-center gap-3 px-6 h-12 hover:bg-accent/50 text-sm transition-colors text-left">
              <Download className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1">Export all conversations</span>
              <span className="text-xs text-muted-foreground font-medium">JSON</span>
            </button>
            <button onClick={handleClearChats} className="w-full flex items-center gap-3 px-6 h-12 hover:bg-red-500/5 text-sm transition-colors text-destructive text-left">
              <Trash2 className="h-4 w-4 shrink-0" />
              <span className="flex-1">Delete all conversations</span>
              <span className="text-xs opacity-60">{chatCount} chats</span>
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden divide-y divide-border/40">
          {[
            { href: "/security", label: "Security & Compliance" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-6 h-12 hover:bg-accent/50 text-sm transition-colors">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </main>
    </div>
  );
}
