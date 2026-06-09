"use client";

import React from "react";
import {
  Key,
  Send,
  Code,
  FileText,
  CreditCard,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Shield,
  AlertTriangle,
  ArrowRight,
  Terminal,
  BookOpen,
} from "lucide-react";

/* ──────────────────────────── TYPES ──────────────────────────── */

interface TocItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

/* ──────────────────────────── DATA ──────────────────────────── */

const tocItems: TocItem[] = [
  { id: "overview", label: "Overview", icon: <BookOpen className="w-4 h-4" /> },
  { id: "authentication", label: "Authentication", icon: <Key className="w-4 h-4" /> },
  { id: "endpoint", label: "Endpoint", icon: <Send className="w-4 h-4" /> },
  { id: "parameters", label: "Parameters", icon: <FileText className="w-4 h-4" /> },
  { id: "examples", label: "Code Examples", icon: <Code className="w-4 h-4" /> },
  { id: "responses", label: "Responses", icon: <Terminal className="w-4 h-4" /> },
  { id: "credits", label: "Credits & Limits", icon: <CreditCard className="w-4 h-4" /> },
];

const pythonCode = `import requests

url = "https://datavision-ai.vercel.app/api/chat"
api_key = "dv_live_YOUR_API_KEY_HERE"

headers = {
    "Authorization": f"Bearer {api_key}"
}

# ── Initial analysis (upload a file) ──
data = {
    "message": "Show me total sales by region as a bar chart"
}
files = {
    "file": ("sales_data.csv", open("sales_data.csv", "rb"), "text/csv")
}

response = requests.post(url, headers=headers, data=data, files=files)

if response.status_code == 200:
    result = response.json()
    print("AI Analysis:", result.get("text_overview"))
    print("Credits left:", result.get("creditsRemaining"))

    # Save context for follow-ups
    cached_schema = result.get("cached_schema")
    cached_df_json = result.get("cached_df_json")
else:
    print(f"Error {response.status_code}: {response.text}")`;

const curlCode = `# Initial file upload & analysis
curl -X POST https://datavision-ai.vercel.app/api/chat \\
  -H "Authorization: Bearer dv_live_YOUR_API_KEY_HERE" \\
  -F "message=What are the top 5 products by revenue?" \\
  -F "file=@/path/to/your/dataset.csv"

# Follow-up question (no file re-upload needed)
curl -X POST https://datavision-ai.vercel.app/api/chat \\
  -H "Authorization: Bearer dv_live_YOUR_API_KEY_HERE" \\
  -F "message=Now break it down by quarter" \\
  -F "cached_schema=<schema_from_previous_response>" \\
  -F "cached_df_json=<df_json_from_previous_response>"`;

const jsCode = `const apiKey = "dv_live_YOUR_API_KEY_HERE";
const url = "https://datavision-ai.vercel.app/api/chat";

// Build multipart form data
const formData = new FormData();
formData.append("message", "Show me monthly revenue trends");
formData.append("file", fileInput.files[0]); // File from <input>

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${apiKey}\`,
  },
  body: formData,
});

const result = await response.json();

if (response.ok) {
  console.log("Analysis:", result.text_overview);
  console.log("Chart config:", result.plotly_config);
  console.log("Credits remaining:", result.creditsRemaining);
} else {
  console.error("Error:", result.error);
}`;

const codeExamples: Record<string, { code: string; lang: string }> = {
  Python: { code: pythonCode, lang: "python" },
  cURL: { code: curlCode, lang: "bash" },
  JavaScript: { code: jsCode, lang: "javascript" },
};

/* ──────────────────────────── COMPONENTS ──────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-all duration-200 border border-white/5 hover:border-white/10"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-wider rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-mono">
      {method}
    </span>
  );
}

function StatusBadge({ code, label }: { code: number; label: string }) {
  const color =
    code < 300
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : code < 500
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${color} transition-all duration-200 hover:scale-[1.01]`}>
      <span className="font-mono font-bold text-sm">{code}</span>
      <span className="text-sm opacity-80">{label}</span>
    </div>
  );
}

function ParamRow({
  name,
  type,
  required,
  description,
}: {
  name: string;
  type: string;
  required: boolean;
  description: string;
}) {
  return (
    <tr className="border-b border-foreground/5 last:border-0 group">
      <td className="py-3.5 pr-4">
        <code className="text-sm font-mono text-foreground bg-foreground/5 px-2 py-0.5 rounded-md">
          {name}
        </code>
      </td>
      <td className="py-3.5 pr-4">
        <span className="text-xs font-mono text-muted-foreground/70">{type}</span>
      </td>
      <td className="py-3.5 pr-4">
        {required ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
            Required
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-foreground/5 px-2 py-0.5 rounded-full">
            Optional
          </span>
        )}
      </td>
      <td className="py-3.5 text-sm text-muted-foreground">{description}</td>
    </tr>
  );
}

/* ──────────────────────────── MAIN COMPONENT ──────────────────────────── */

export function ApiDocsContent() {
  const [activeTab, setActiveTab] = React.useState("Python");
  const [activeSection, setActiveSection] = React.useState("overview");

  // Intersection observer for active section tracking
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const item of tocItems) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative pt-24 lg:pt-32 pb-24">
      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/8 to-violet-500/8 blur-3xl pointer-events-none animate-blob-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/6 to-cyan-500/6 blur-3xl pointer-events-none animate-blob-float" style={{ animationDelay: "-7s" }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm text-muted-foreground mb-6 animate-fade-in-up">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-mono text-xs tracking-wider uppercase">Developer Documentation</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up animation-delay-100">
              DataVision{" "}
              <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                API Reference
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-fade-in-up animation-delay-200">
              Embed natural-language data analysis directly into your applications. Upload datasets, ask questions in plain English, and receive AI-powered insights and interactive Plotly charts.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-sm text-emerald-500">
                <Zap className="w-4 h-4" />
                REST API
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/15 text-sm text-blue-500">
                <Shield className="w-4 h-4" />
                Bearer Auth
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/15 text-sm text-violet-500">
                <FileText className="w-4 h-4" />
                multipart/form-data
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content area with sidebar ─── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex gap-12 lg:gap-16">
          {/* Sidebar TOC — desktop only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-28">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50 mb-4">
                On this page
              </p>
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-left ${
                        activeSection === item.id
                          ? "bg-foreground/5 text-foreground font-medium border-l-2 border-foreground/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Quick action */}
              <div className="mt-8 p-4 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                <p className="text-xs font-medium text-foreground mb-2">Need an API key?</p>
                <p className="text-xs text-muted-foreground mb-3">Generate one from your account settings.</p>
                <a
                  href="/account"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
                >
                  Go to Settings <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* ═══ OVERVIEW ═══ */}
            <section id="overview" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <BookOpen className="w-4 h-4" />
                </span>
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The DataVision API is a REST endpoint that accepts <code className="text-sm font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-foreground">multipart/form-data</code> requests. You can upload a CSV or Excel file along with a natural-language question, and the API returns an AI-generated analysis with text insights and an optional Plotly chart configuration.
              </p>
              <div className="p-5 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                <h3 className="text-sm font-semibold text-foreground mb-3">How it works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: "1", title: "Upload", desc: "Send your dataset + question" },
                    { step: "2", title: "Analyze", desc: "AI parses, analyzes, and visualizes" },
                    { step: "3", title: "Receive", desc: "Get insights + chart config in JSON" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-foreground/[0.03]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-xs font-bold text-foreground">
                        {s.step}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══ AUTHENTICATION ═══ */}
            <section id="authentication" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Key className="w-4 h-4" />
                </span>
                Authentication
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Authenticate every request by including your API key as a <code className="text-sm font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-foreground">Bearer</code> token in the <code className="text-sm font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-foreground">Authorization</code> header.
              </p>

              {/* Auth header display */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] mb-8">
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-zinc-500">HTTP Header</span>
                  <CopyButton text='Authorization: Bearer dv_live_YOUR_API_KEY_HERE' />
                </div>
                <div className="p-5 bg-zinc-950 font-mono text-sm text-zinc-300">
                  <span className="text-blue-400">Authorization</span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-emerald-400">Bearer</span>{" "}
                  <span className="text-amber-300">dv_live_YOUR_API_KEY_HERE</span>
                </div>
              </div>

              {/* Key generation steps */}
              <div className="p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  Generating your API key
                </h3>
                <ol className="space-y-3">
                  {[
                    "Log in to your DataVision AI account.",
                    <>Navigate to <strong className="text-foreground">Account Settings</strong>.</>,
                    <>Scroll to <strong className="text-foreground">API Keys</strong> and click <strong className="text-foreground">Generate New Key</strong>.</>,
                    'Give it a recognizable name (e.g., "Python Scripting" or "Prod Backend").',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-[11px] font-bold text-foreground">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{text}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400/90 leading-relaxed">
                    <strong>Important:</strong> Copy your key immediately after generating it. For security, the full key cannot be viewed again.
                  </p>
                </div>
              </div>
            </section>

            {/* ═══ ENDPOINT ═══ */}
            <section id="endpoint" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Send className="w-4 h-4" />
                </span>
                Endpoint
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                All API interactions go through a single endpoint. The endpoint accepts <code className="text-sm font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-foreground">multipart/form-data</code> only.
              </p>

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-zinc-500">Base URL</span>
                  <CopyButton text="https://datavision-ai.vercel.app/api/chat" />
                </div>
                <div className="p-5 bg-zinc-950 font-mono text-sm flex items-center gap-3">
                  <MethodBadge method="POST" />
                  <span className="text-zinc-300">https://datavision-ai.vercel.app<span className="text-blue-400">/api/chat</span></span>
                </div>
              </div>
            </section>

            {/* ═══ PARAMETERS ═══ */}
            <section id="parameters" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                  <FileText className="w-4 h-4" />
                </span>
                Request Parameters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                All parameters are sent as <code className="text-sm font-mono bg-foreground/5 px-1.5 py-0.5 rounded text-foreground">multipart/form-data</code> fields. There are two request flows.
              </p>

              {/* Initial analysis */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/15">
                    Flow 1
                  </span>
                  <h3 className="text-base font-semibold text-foreground">Initial Analysis — Upload a File</h3>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-foreground/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Parameter</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ParamRow name="message" type="string" required description="Your question in plain English." />
                      <ParamRow name="file" type="file" required description="Dataset to analyze (CSV, XLS, or XLSX)." />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/15">
                    Flow 2
                  </span>
                  <h3 className="text-base font-semibold text-foreground">Follow-up Questions — Cached Context</h3>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-foreground/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Parameter</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ParamRow name="message" type="string" required description="Your follow-up question." />
                      <ParamRow name="cached_schema" type="string" required description="Schema string from your previous response." />
                      <ParamRow name="cached_df_json" type="string" required description="Dataframe JSON from your previous response." />
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted-foreground/70 italic">
                  Tip: Using cached context avoids re-uploading files and reduces credit cost.
                </p>
              </div>
            </section>

            {/* ═══ CODE EXAMPLES ═══ */}
            <section id="examples" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Code className="w-4 h-4" />
                </span>
                Code Examples
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Copy-paste examples to start integrating immediately. Pick your language below.
              </p>

              <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
                {/* Language tabs */}
                <div className="flex items-center justify-between bg-zinc-900 border-b border-white/[0.06]">
                  <div className="flex">
                    {Object.keys(codeExamples).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                          activeTab === tab
                            ? "text-foreground border-blue-500 bg-white/[0.03]"
                            : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/[0.02]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="pr-3">
                    <CopyButton text={codeExamples[activeTab].code} />
                  </div>
                </div>

                {/* Code area */}
                <div className="p-6 bg-zinc-950 overflow-x-auto">
                  <pre className="font-mono text-sm text-zinc-300 leading-relaxed whitespace-pre">
                    {codeExamples[activeTab].code}
                  </pre>
                </div>
              </div>
            </section>

            {/* ═══ RESPONSES ═══ */}
            <section id="responses" className="mb-20 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
                  <Terminal className="w-4 h-4" />
                </span>
                Response Codes
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The API uses standard HTTP response codes. Here are the ones you should handle:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatusBadge code={200} label="Analysis completed successfully" />
                <StatusBadge code={401} label="Invalid or missing API key" />
                <StatusBadge code={402} label="Insufficient credits" />
                <StatusBadge code={429} label="Rate limit exceeded" />
                <StatusBadge code={500} label="Internal server error" />
                <StatusBadge code={503} label="Backend unavailable" />
              </div>

              {/* Success response shape */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-foreground mb-3">Success Response Shape</h3>
                <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/[0.06]">
                    <span className="text-xs font-mono text-zinc-500">200 OK — JSON</span>
                    <CopyButton text={`{
  "text_overview": "The dataset shows total sales of $1.2M across 4 regions...",
  "plotly_config": { ... },
  "cached_schema": "col1:string, col2:number, ...",
  "cached_df_json": "[{...}, {...}]",
  "creditsRemaining": 42
}`} />
                  </div>
                  <div className="p-5 bg-zinc-950 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <pre className="whitespace-pre leading-relaxed">{`{
  "text_overview": "The dataset shows total sales of $1.2M across 4 regions...",
  "plotly_config": { ... },
  "cached_schema": "col1:string, col2:number, ...",
  "cached_df_json": "[{...}, {...}]",
  "creditsRemaining": 42
}`}</pre>
                  </div>
                </div>
              </div>

              {/* Response field descriptions */}
              <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                      <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Field</th>
                      <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "text_overview", type: "string", desc: "AI-generated text analysis of the data." },
                      { name: "plotly_config", type: "object | null", desc: "Plotly chart JSON config, if a chart was generated." },
                      { name: "cached_schema", type: "string", desc: "Schema of the dataset — pass this in follow-up requests." },
                      { name: "cached_df_json", type: "string", desc: "Serialized dataframe — pass this in follow-up requests." },
                      { name: "creditsRemaining", type: "number", desc: "Your remaining credit balance after this request." },
                    ].map((field) => (
                      <tr key={field.name} className="border-b border-foreground/5 last:border-0">
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-foreground bg-foreground/5 px-2 py-0.5 rounded-md">{field.name}</code>
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-muted-foreground/70">{field.type}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{field.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ═══ CREDITS ═══ */}
            <section id="credits" className="mb-12 scroll-mt-28">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  <CreditCard className="w-4 h-4" />
                </span>
                Credits & Rate Limits
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Each API request consumes credits from your account balance. New accounts start with 1,000 free credits.
              </p>

              {/* Credit cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="relative p-6 rounded-2xl border border-foreground/5 bg-gradient-to-br from-blue-500/[0.03] to-violet-500/[0.03] group hover:border-foreground/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Initial File Upload</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">8</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Credits per request when uploading a new file for analysis.</p>
                </div>
                <div className="relative p-6 rounded-2xl border border-foreground/5 bg-gradient-to-br from-emerald-500/[0.03] to-cyan-500/[0.03] group hover:border-foreground/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Follow-up Question</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">4</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Credits per follow-up using cached context from a prior request.</p>
                </div>
              </div>

              {/* Rate limit info */}
              <div className="p-5 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                <h3 className="text-sm font-semibold text-foreground mb-3">Rate Limit Errors</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <StatusBadge code={402} label="Insufficient credits — upgrade your plan" />
                  </div>
                  <div className="flex items-start gap-3">
                    <StatusBadge code={429} label="Too many requests — slow down or upgrade" />
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground/70 leading-relaxed">
                  If you consistently hit rate limits, consider spacing out requests or upgrading your plan for higher throughput.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
