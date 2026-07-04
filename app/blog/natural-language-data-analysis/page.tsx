import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import Link from "next/link";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = genMeta({
  title: "Natural Language Data Analysis",
  description: "Query your data using plain English instead of SQL. Get instant AI-generated charts — no coding required.",
  path: "/blog/natural-language-data-analysis",
  keywords: [
    "natural language data analysis", "ask questions about data",
    "NLP data analytics", "query data with plain english",
    "AI data query tool", "natural language to SQL free",
    "ChatGPT for data analysis", "talk to your data AI",
    "conversational analytics", "no SQL data analysis",
  ],
  type: "article",
  publishedTime: "2024-12-20T00:00:00.000Z",
  modifiedTime: "2025-06-01T00:00:00.000Z",
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Natural Language Data Analysis — Ask Questions, Get Charts Instantly",
  description: "How natural language data analysis lets you query data using plain English instead of SQL. No coding required.",
  url: `${siteConfig.url}/blog/natural-language-data-analysis`,
  datePublished: "2024-12-20",
  dateModified: "2025-06-01",
  wordCount: 600,
  mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/natural-language-data-analysis` },
  author: { "@type": "Organization", name: "DataVision AI", url: siteConfig.url },
  publisher: { "@type": "Organization", name: "DataVision AI", url: siteConfig.url, logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` } },
  image: `${siteConfig.url}/og-image.png`,
  keywords: "natural language data analysis, NLP data analytics, query data with plain english, conversational analytics",
};

export default function NLPAnalysisPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Natural Language Data Analysis", path: "/blog/natural-language-data-analysis" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={articleSchema} />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <article className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[800px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {["AI", "NLP", "Analytics"].map(tag => (
              <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Natural Language Data Analysis — Ask Questions, Get Charts Instantly
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-12 pb-8 border-b border-foreground/10">
            <time dateTime="2024-12-20">December 20, 2024</time>
            <span>·</span><span>6 min read</span>
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground/80">
              What if you could query your data the same way you text a colleague? Instead of writing <code className="text-blue-400 bg-foreground/5 px-1.5 py-0.5 rounded text-sm">SELECT SUM(revenue) GROUP BY month</code>, you just type <em>&quot;Show me revenue by month&quot;</em> and get an instant chart.
            </p>
            <p>That&apos;s exactly what natural language data analysis does — and in 2025, it&apos;s no longer a research project. It&apos;s available for free.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12">What Is Natural Language Data Analysis?</h2>
            <p>Natural language data analysis (also called conversational analytics or NL2SQL) is the ability to query, explore, and visualize data using plain English sentences instead of programming languages or query syntax.</p>
            <p>Instead of this SQL:</p>
            <pre className="p-4 rounded-xl bg-black/40 border border-foreground/10 text-sm font-mono text-blue-300 overflow-x-auto">{`SELECT 
  category,
  SUM(revenue) as total_revenue
FROM sales
WHERE date >= '2024-01-01'
GROUP BY category
ORDER BY total_revenue DESC
LIMIT 10;`}</pre>
            <p>You just type: <em className="text-foreground">&quot;Show me top 10 categories by revenue in 2024&quot;</em></p>

            <h2 className="text-2xl font-bold text-foreground mt-12">How It Works in DataVision AI</h2>
            <p>When you upload a dataset and ask a question, DataVision AI:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Reads your dataset schema (column names, data types, sample values)</li>
              <li>Interprets your question using Google Gemini AI</li>
              <li>Generates the appropriate data query and chart configuration</li>
              <li>Returns an interactive Plotly chart with a plain-English summary</li>
            </ol>
            <p>The whole process takes under 5 seconds for most datasets.</p>

            <h2 className="text-2xl font-bold text-foreground mt-12">Real Examples of Natural Language Queries</h2>
            <div className="space-y-4">
              {[
                { q: "Show me monthly revenue trend for 2024", type: "Line chart" },
                { q: "Which salesperson closed the most deals last quarter?", type: "Bar chart" },
                { q: "Is there a correlation between marketing spend and sales?", type: "Scatter plot" },
                { q: "What percentage of orders are returns?", type: "Pie chart" },
                { q: "Show me the distribution of customer ages", type: "Histogram" },
                { q: "Which region had the highest growth rate year over year?", type: "Grouped bar chart" },
              ].map(({ q, type }) => (
                <div key={q} className="flex items-start gap-4 p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-sm">&quot;{q}&quot;</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-foreground/5 px-2 py-0.5 rounded-full shrink-0">{type}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-12">Who Benefits Most from This?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Business analysts</strong> — get answers without waiting for data engineers</li>
              <li><strong className="text-foreground">Marketing teams</strong> — analyze campaign performance directly from exported reports</li>
              <li><strong className="text-foreground">Finance teams</strong> — explore budget vs actuals without building Excel formulas</li>
              <li><strong className="text-foreground">Small business owners</strong> — understand sales data without hiring a data analyst</li>
              <li><strong className="text-foreground">Students and researchers</strong> — visualize research data instantly</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12">The Limits of Natural Language Analysis</h2>
            <p>Natural language analysis works best for exploratory analysis and ad-hoc questions. It&apos;s not ideal for complex multi-table joins, real-time database connections, or highly customized enterprise dashboards — for those, traditional BI tools are still better.</p>
            <p>But for the vast majority of everyday data questions — especially from CSV and Excel files — natural language is now the fastest and easiest path from data to insight.</p>

            <div className="mt-16 p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">Try natural language data analysis free</h3>
              <p className="mb-6">Upload any CSV and ask your first question in plain English — no account setup, no SQL needed.</p>
              <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all">
                Start Analyzing Free
              </Link>
            </div>
          </div>
        </article>
        <FooterSection />
      </main>
    </>
  );
}
