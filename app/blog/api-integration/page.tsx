import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "How to Integrate DataVision API — Developer Guide",
  description: "Learn how to generate an API key, authenticate requests, and programmatically analyze datasets using the DataVision AI developer API.",
  path: "/blog/api-integration",
  keywords: ["DataVision API", "API integration guide", "developer docs", "data analysis API", "Python API example"]
});

export default function ApiIntegrationBlogPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "API Integration Guide", path: "/blog/api-integration" }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
        <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[800px] mx-auto">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Developer Docs
          </span>
          <h1 className="text-4xl lg:text-5xl font-display tracking-tight mb-8">
            How to Integrate DataVision AI into Your Own Applications
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-16">
            DataVision AI isn't just a powerful web platform—it's also a developer-first API that allows you to embed our natural language data analysis capabilities directly into your own applications, scripts, and workflows.
          </p>

          <article className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Step 1: Generate Your API Key</h2>
              <p className="text-muted-foreground">Before you can make programmatic requests, you need to generate a secure DataVision API key.</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground bg-foreground/5 p-6 rounded-2xl border border-foreground/10">
                <li>Log in to your DataVision AI account.</li>
                <li>Navigate to your <strong>Account Settings</strong>.</li>
                <li>Scroll down to the <strong>API Keys</strong> section and click <strong>Generate New Key</strong>.</li>
                <li>Give your key a recognizable name (e.g., "Python Scripting" or "Prod Backend").</li>
                <li><strong>Important:</strong> Copy the key immediately. For security reasons, you will not be able to view the full key again.</li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Step 2: The API Endpoint</h2>
              <p className="text-muted-foreground">The primary endpoint for interacting with DataVision AI is the chat endpoint. Because our AI processes files, this endpoint strictly requires requests to be formatted as <code>multipart/form-data</code>.</p>
              <div className="bg-zinc-950 text-zinc-300 p-4 rounded-xl border border-zinc-800 font-mono text-sm overflow-x-auto">
                POST https://datavision-ai.vercel.app/api/chat
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Step 3: Making Requests (Authentication)</h2>
              <p className="text-muted-foreground">To authenticate your requests, you must include your DataVision API key in the <code>Authorization</code> HTTP header as a Bearer token.</p>
              <div className="bg-zinc-950 text-zinc-300 p-4 rounded-xl border border-zinc-800 font-mono text-sm overflow-x-auto">
                Authorization: Bearer dv_live_YOUR_API_KEY_HERE
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Step 4: The Payload Structure</h2>
              <p className="text-muted-foreground">There are two primary ways to interact with the API depending on whether you are starting a new analysis or continuing a previous conversation.</p>
              
              <div className="space-y-4 bg-foreground/5 p-6 rounded-2xl border border-foreground/10">
                <h3 className="text-xl font-medium text-foreground">1. Initial Analysis (Uploading a File)</h3>
                <p className="text-muted-foreground text-sm">When starting a new analysis, you must provide the file and the initial question.</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><code>message</code> (text): The question you want to ask in plain English.</li>
                  <li><code>file</code> (file): The dataset (CSV, XLS, or XLSX format).</li>
                </ul>
                
                <div className="h-px w-full bg-foreground/10 my-4" />

                <h3 className="text-xl font-medium text-foreground">2. Follow-up Questions (Using Cached Context)</h3>
                <p className="text-muted-foreground text-sm">If you've already uploaded a file and want to ask follow-up questions, you can pass the cached context returned from your first request instead of re-uploading the file.</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><code>message</code> (text): Your follow-up question.</li>
                  <li><code>cached_schema</code> (text): The schema string returned from your previous request.</li>
                  <li><code>cached_df_json</code> (text): The data frame JSON returned from your previous request.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Step 5: Code Examples</h2>
              
              <h3 className="text-lg font-medium text-foreground mt-6">Python (using requests)</h3>
              <pre className="bg-zinc-950 text-zinc-300 p-6 rounded-2xl border border-zinc-800 font-mono text-sm overflow-x-auto">
{`import requests

url = "https://datavision-ai.vercel.app/api/chat"
api_key = "dv_live_YOUR_API_KEY_HERE"

headers = {
    "Authorization": f"Bearer {api_key}"
}

data = {
    "message": "Show me the total sales by region as a bar chart"
}

files = {
    "file": ("sales_data.csv", open("sales_data.csv", "rb"), "text/csv")
}

response = requests.post(url, headers=headers, data=data, files=files)

if response.status_code == 200:
    result = response.json()
    print("AI Analysis:", result.get("text_overview"))
    
    if result.get("plotly_config"):
        print("[Chart data generated successfully!]")
else:
    print(f"Error {response.status_code}: {response.text}")`}
              </pre>

              <h3 className="text-lg font-medium text-foreground mt-6">cURL</h3>
              <pre className="bg-zinc-950 text-zinc-300 p-6 rounded-2xl border border-zinc-800 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://datavision-ai.vercel.app/api/chat \\
  -H "Authorization: Bearer dv_live_YOUR_API_KEY_HERE" \\
  -F "message=What are the top 5 products by revenue?" \\
  -F "file=@/path/to/your/dataset.csv"`}
              </pre>
            </section>

            <section className="space-y-4 pt-8 border-t border-foreground/10">
              <h2 className="text-2xl font-semibold text-foreground">Understanding Credit Costs</h2>
              <p className="text-muted-foreground">Using the API consumes credits from your account. The costs are structured as follows:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Initial File Upload & Analysis:</strong> 8 Credits</li>
                <li><strong>Follow-up Questions:</strong> 4 Credits</li>
              </ul>
              <p className="text-muted-foreground text-sm italic mt-4">
                If your account runs out of credits, or if you hit a rate limit, the API will return a 402 Payment Required or 429 Too Many Requests HTTP status code.
              </p>
            </section>

          </article>
        </div>

        <FooterSection />
      </main>
    </>
  );
}
