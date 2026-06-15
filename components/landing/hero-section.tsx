"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, Upload, Sparkles, Database, Terminal, 
  Lock, Play, FileSpreadsheet, KeyRound, Check, Copy 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function HeroSection() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = React.useState<"csv" | "excel" | "sql" | "api">("csv");
  const [apiLang, setApiLang] = React.useState<"curl" | "python" | "node">("curl");
  const [prompt, setPrompt] = React.useState("");
  const [user, setUser] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (user) {
        // Stage the file globally in window and navigate to chat
        (window as any).__stagedFile = file;
        router.push("/chat");
      } else {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    }
  };

  const handleActionClick = () => {
    if (user) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    curl: `curl -X POST https://datavision-ai.vercel.app/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "message=Plot monthly sales by category" \\
  -F "file=@sales.csv"`,
    python: `import requests

url = "https://datavision-ai.vercel.app/api/chat"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"file": open("sales.csv", "rb")}
data = {"message": "Plot monthly sales by category"}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`,
    node: `const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('sales.csv'));
form.append('message', 'Plot monthly sales by category');

axios.post('https://datavision-ai.vercel.app/api/chat', form, {
  headers: {
    ...form.getHeaders(),
    'Authorization': 'Bearer YOUR_API_KEY'
  }
}).then(res => console.log(res.data));`
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[130px] animate-blob-float" />
        <div 
          className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/8 blur-[130px] animate-blob-float" 
          style={{ animationDelay: "-8s", animationDuration: "25s" }}
        />
      </div>

      {/* Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] dark:[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)] pointer-events-none opacity-40 z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center w-full flex flex-col items-center">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-sm text-zinc-400 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Free Credits Reset Monthly</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up animation-delay-200 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto text-zinc-100">
          Turn spreadsheets into{" "}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
            visual insights
          </span>{" "}
          instantly.
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up animation-delay-300 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          Upload your datasets, ask questions in plain English, and get instant
          interactive visualizations — no coding or SQL required.
        </p>

        {/* Dynamic Action Card */}
        <div className="animate-fade-in-up animation-delay-400 w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.08)] overflow-hidden flex flex-col transition-all">
          {/* Card Header (Tabs) */}
          <div className="flex border-b border-white/5 bg-white/[0.01]">
            <button
              onClick={() => setActiveTab("csv")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "csv"
                  ? "border-violet-500 text-zinc-100 bg-white/[0.02]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>CSV Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab("excel")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "excel"
                  ? "border-violet-500 text-zinc-100 bg-white/[0.02]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel Sheets</span>
            </button>
            <button
              onClick={() => setActiveTab("sql")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "sql"
                  ? "border-violet-500 text-zinc-100 bg-white/[0.02]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>SQL Database 🔒</span>
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "api"
                  ? "border-violet-500 text-zinc-100 bg-white/[0.02]"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>API Integration</span>
            </button>
          </div>

          {/* Card Body */}
          <div className="p-8 relative min-h-[300px] flex flex-col justify-between">
            {/* CSV File Selection Tab */}
            {activeTab === "csv" && (
              <div className="space-y-6 animate-fade-in-up duration-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div 
                  onClick={handleFileClick}
                  className="group rounded-2xl border border-dashed border-white/10 hover:border-violet-500/40 bg-white/[0.01] hover:bg-violet-500/[0.02] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-105 group-hover:bg-violet-500/20 flex items-center justify-center mb-4 transition-all duration-300">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-zinc-200 font-medium text-sm group-hover:text-zinc-100 transition-colors">
                    Drag & drop your CSV file here, or <span className="text-violet-400 underline underline-offset-4">browse</span>
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Supports standard CSV sheets up to 50MB</p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask anything about your data... (e.g. 'Plot monthly sales by category')"
                    className="w-full h-14 pl-5 pr-14 bg-black/40 border border-white/10 focus:border-violet-500/40 rounded-2xl text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  />
                  <button
                    onClick={handleActionClick}
                    className="absolute right-2 bottom-2 h-10 w-10 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Excel File Selection Tab */}
            {activeTab === "excel" && (
              <div className="space-y-6 animate-fade-in-up duration-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xls,.xlsx"
                  className="hidden"
                />
                <div 
                  onClick={handleFileClick}
                  className="group rounded-2xl border border-dashed border-white/10 hover:border-violet-500/40 bg-white/[0.01] hover:bg-violet-500/[0.02] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 flex items-center justify-center mb-4 transition-all duration-300">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <p className="text-zinc-200 font-medium text-sm group-hover:text-zinc-100 transition-colors">
                    Drag & drop your Excel sheet here, or <span className="text-emerald-400 underline underline-offset-4">browse</span>
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Supports .xls and .xlsx sheets up to 50MB</p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask anything about your data... (e.g. 'Compare quantity sold vs region')"
                    className="w-full h-14 pl-5 pr-14 bg-black/40 border border-white/10 focus:border-violet-500/40 rounded-2xl text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  />
                  <button
                    onClick={handleActionClick}
                    className="absolute right-2 bottom-2 h-10 w-10 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SQL Database connection Tab (Enterprise Blocked) */}
            {activeTab === "sql" && (
              <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex flex-col justify-center border border-white/5 bg-black/20 animate-fade-in-up duration-200 p-6">
                {/* Form skeleton in background */}
                <div className="grid grid-cols-2 gap-4 opacity-15 pointer-events-none select-none">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Database Connection Host</span>
                    <div className="h-10 bg-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Port</span>
                    <div className="h-10 bg-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Database Name</span>
                    <div className="h-10 bg-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Username</span>
                    <div className="h-10 bg-white/10 rounded-xl" />
                  </div>
                </div>

                {/* Locked overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/60 backdrop-blur-[1.5px]">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Lock className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full mb-2">
                    Enterprise Feature
                  </span>
                  <h4 className="text-zinc-200 font-semibold text-sm">Direct SQL Database Integration</h4>
                  <p className="text-zinc-500 text-xs mt-1 max-w-sm">
                    Connect your PostgreSQL, MySQL, or SQL Server database directly to query and chart in real time.
                  </p>
                  <Link 
                    href="/contact?ref=sql"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 px-4 py-2 rounded-xl transition-all"
                  >
                    Request Enterprise Access <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Developer API Integration Tab */}
            {activeTab === "api" && (
              <div className="space-y-4 animate-fade-in-up duration-200 flex flex-col flex-1 justify-between">
                {/* Code Snippet Layout */}
                <div className="rounded-2xl border border-white/5 bg-black/40 overflow-hidden flex flex-col flex-1">
                  {/* Language switch */}
                  <div className="flex border-b border-white/5 bg-white/[0.01] px-4 py-2 justify-between items-center">
                    <div className="flex gap-2">
                      {(["curl", "python", "node"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setApiLang(lang)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            apiLang === lang
                              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                              : "text-zinc-500 hover:text-zinc-400"
                          }`}
                        >
                          {lang === "node" ? "Node.js" : lang}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopyCode(codeSnippets[apiLang])}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Code box */}
                  <pre className="p-4 overflow-x-auto text-left font-mono text-[11px] text-zinc-300 leading-relaxed bg-zinc-950/20 max-w-full">
                    <code>{codeSnippets[apiLang]}</code>
                  </pre>
                </div>

                {/* API Credits indicator */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-zinc-200">Free Tier API Access</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Use your monthly free credits via API until consumed.</p>
                    </div>
                  </div>
                  <Link 
                    href={user ? "/account" : "/login"}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors shrink-0"
                  >
                    Generate API Key →
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom action button */}
            {activeTab !== "sql" && activeTab !== "api" && (
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={handleActionClick}
                  className="w-full sm:w-auto px-8 h-12 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-0.5"
                >
                  Start Free Analysis
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
