import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import Link from "next/link";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = genMeta({
  title: "Analyze CSV with AI — Free",
  description: "Upload a CSV, ask a question, get an AI chart in 30 seconds. Free step-by-step guide — no coding needed.",
  path: "/blog/analyze-csv-with-ai",
  keywords: [
    "analyze CSV with AI", "CSV file analysis tool", "upload CSV get charts",
    "AI CSV analyzer free", "how to analyze CSV data", "CSV to chart online free",
    "analyze spreadsheet with AI", "no code CSV analysis",
  ],
  type: "article",
  publishedTime: "2024-12-01T00:00:00.000Z",
  modifiedTime: "2025-06-01T00:00:00.000Z",
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "How to Analyze a CSV File with AI — No Coding Required",
  description: "Learn how to upload a CSV file and get instant AI-powered charts and insights in seconds. Free, no coding needed.",
  url: `${siteConfig.url}/blog/analyze-csv-with-ai`,
  datePublished: "2024-12-01",
  dateModified: "2025-06-01",
  wordCount: 500,
  mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/analyze-csv-with-ai` },
  author: { "@type": "Organization", name: "DataVision AI", url: siteConfig.url },
  publisher: { "@type": "Organization", name: "DataVision AI", url: siteConfig.url, logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` } },
  image: `${siteConfig.url}/og-image.png`,
  keywords: "analyze CSV with AI, CSV file analysis tool, upload CSV get charts, no code CSV analysis",
};

export default function AnalyzeCSVPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "How to Analyze a CSV File with AI", path: "/blog/analyze-csv-with-ai" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <article className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[800px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {["Tutorial", "CSV", "Getting Started"].map(tag => (
              <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            How to Analyze a CSV File with AI — No Coding Required
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12 pb-8 border-b border-foreground/10">
            <time dateTime="2024-12-01">December 1, 2024</time>
            <span>·</span><span>5 min read</span>
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground/80">
              Analyzing a CSV file used to require Excel formulas, Python scripts, or expensive BI tools. With AI, you can upload any spreadsheet and get instant interactive charts just by asking questions in plain English.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12">What You Need</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A CSV, XLS, or XLSX file (up to 50 MB)</li>
              <li>A free DataVision AI account — sign in with Google</li>
              <li>No coding skills, no SQL, no formulas</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12">Step 1 — Sign In for Free</h2>
            <p>Go to <Link href="/" className="text-blue-400 underline underline-offset-4">datavision-ai.vercel.app</Link> and click <strong className="text-foreground">Sign In</strong>. Use your Google account — no password needed. You get 1,000 free credits on sign-up.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12">Step 2 — Upload Your CSV File</h2>
            <p>Drag and drop your CSV or Excel file directly into the chat window. DataVision AI instantly reads your file, detects column names, data types, and structure. You&apos;ll see a confirmation like <em>&quot;Dataset loaded: 1,247 rows × 8 columns&quot;</em>.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12">Step 3 — Ask Questions in Plain English</h2>
            <p>Type what you want to know. Example questions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><em>&quot;Show me total sales by month as a line chart&quot;</em></li>
              <li><em>&quot;Which product category has the highest revenue?&quot;</em></li>
              <li><em>&quot;What is the correlation between price and quantity sold?&quot;</em></li>
              <li><em>&quot;Show me the top 10 customers by order value&quot;</em></li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12">Step 4 — Explore Your Interactive Chart</h2>
            <p>Every chart is fully interactive — zoom, hover for exact values, click legend items, or download as PNG. Then ask follow-up questions to refine the analysis without re-uploading.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12">Tips for Best Results</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Make sure your CSV has clear column headers in the first row</li>
              <li>Date columns work best in standard formats (YYYY-MM-DD)</li>
              <li>Remove merged cells from Excel files before uploading</li>
              <li>Mention column names in your questions for more accurate results</li>
            </ul>

            <div className="mt-16 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Ready to analyze your data?</h3>
              <p className="mb-6">Upload your first CSV and get instant charts — free, no credit card required.</p>
              <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all">
                Start Analyzing for Free
              </Link>
            </div>
          </div>
        </article>
        <FooterSection />
      </main>
    </>
  );
}
