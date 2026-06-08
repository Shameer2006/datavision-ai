"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, Moon, Sun, Palette,
  KeyRound, Shield, LogOut, Check, Copy, RefreshCw, ChevronRight,
  BarChart3, MessageSquare, Sparkles, ExternalLink, Lock, Zap,
  Activity, Settings, Terminal
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

  const initials = profile.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "DV";

  const creditPercent = Math.min(100, Math.round((credits.balance / (credits.balance + credits.total_used || 1)) * 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-foreground selection:bg-blue-500/30">
      {/* Ambient Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center gap-4 h-16 px-6">
          <Link href="/chat">
            <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-zinc-400" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Account Settings</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar (Left Column) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Summary Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden p-6 relative">
              <div className="absolute top-0 right-0 p-4">
                 <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                   Pro
                 </span>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-white/5 shadow-2xl" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/20 ring-4 ring-white/5">
                    {initials}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">{profile.name || "DataVision User"}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{profile.email || "No email set"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-white/5">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{chatCount}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">Chats</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{messageCount}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">Messages</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 space-y-1">
              {[
                { href: "/security", label: "Security & Compliance", icon: Shield },
                { href: "/privacy", label: "Privacy Policy", icon: Lock },
                { href: "/terms", label: "Terms of Service", icon: Activity },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-sm text-zinc-300 transition-colors group">
                  <Icon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  <span className="flex-1 font-medium">{label}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </Link>
              ))}
              
              <div className="my-2 border-t border-white/5" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-sm text-zinc-400 hover:text-red-400 transition-colors group"
              >
                <LogOut className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content (Right Column) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Profile Settings */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Personal Information</h3>
                  <p className="text-sm text-zinc-400">Update your account details</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-zinc-100 placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-zinc-100 placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="h-11 px-6 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold transition-all flex items-center gap-2"
                >
                  {profileSaved ? <><Check className="h-4 w-4" /> Saved</> : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credits */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">API Credits</h3>
                  </div>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-zinc-100">{credits.balance}</p>
                      <p className="text-sm text-zinc-400 mt-1">credits remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-zinc-300">{credits.total_used}</p>
                      <p className="text-xs text-zinc-500">used this billing cycle</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 relative"
                        style={{ width: `${creditPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">Usage resets in 12 days</p>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Palette className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Appearance</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: "light", icon: Sun, label: "Light Mode", desc: "For bright environments" },
                    { value: "dark", icon: Moon, label: "Dark Mode", desc: "Easy on the eyes" },
                    { value: "system", icon: Sparkles, label: "System", desc: "Matches your device" },
                  ].map(({ value, icon: Icon, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        theme === value
                          ? "bg-purple-500/10 border-purple-500/30"
                          : "bg-black/20 border-white/5 hover:bg-black/40 hover:border-white/10"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${theme === value ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-zinc-400'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${theme === value ? 'text-purple-300' : 'text-zinc-200'}`}>{label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Terminal className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Developer API</h3>
                    <p className="text-sm text-zinc-400">Manage your access keys</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateKey}
                  disabled={generating}
                  className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60"
                >
                  {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  {generating ? "Generating…" : "Create Key"}
                </button>
              </div>

              {newKeyValue && (
                <div className="mb-6 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3">
                    <Check className="h-4 w-4" />
                    New API key generated
                  </div>
                  <p className="text-sm text-emerald-200/70 mb-4">
                    Please copy this key immediately. For security reasons, it will never be shown again.
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 h-12 px-4 rounded-xl bg-black/60 border border-emerald-500/20 text-emerald-300 font-mono text-sm flex items-center overflow-x-auto">
                      {newKeyValue}
                    </code>
                    <button
                      onClick={() => handleCopy(newKeyValue, "new")}
                      className="h-12 px-6 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold transition-all"
                    >
                      {copied === "new" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {apiKeys.length > 0 ? (
                  apiKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                          <KeyRound className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-zinc-200">{key.label}</p>
                            <code className="text-xs text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded-md">
                              {key.key_preview}
                            </code>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            Created {new Date(key.created_at).toLocaleDateString()} 
                            {key.last_used_at ? ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}` : " · Never used"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevoke(key.id)}
                        className="h-9 px-4 text-xs font-medium rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Revoke Key
                      </button>
                    </div>
                  ))
                ) : !newKeyValue ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                    <Terminal className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-300 font-medium mb-1">No API keys found</p>
                    <p className="text-sm text-zinc-500">Generate a key to start building with DataVision AI.</p>
                  </div>
                ) : null}
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
