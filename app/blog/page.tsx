import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import Link from "next/link";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = genMeta({
  title: "Blog — Analytics Guides",
  description: "Guides, tutorials, and tips on AI-powered data analytics, CSV visualization, and no-code data analysis.",
  path: "/blog",
  keywords: ["data analytics blog", "CSV analysis tutorial", "data visualization guide", "AI analytics tips", "how to analyze data"],
});

const posts = [
  {
    slug: "secure-ai-data-analytics",
    title: "Why Secure AI Data Analytics Matters — Protecting Your Business",
    description: "Learn the hidden risks of using unsafe data platforms and why zero-knowledge, metadata-only processing keeps your enterprise safe.",
    date: "2026-06-21",
    readTime: "6 min read",
    tags: ["Security", "Enterprise", "AI"],
  },
  {
    slug: "analyze-csv-with-ai",
    title: "How to Analyze a CSV File with AI — No Coding Required",
    description: "Step-by-step guide to uploading your CSV file and getting instant charts and insights using DataVision AI.",
    date: "2024-12-01",
    readTime: "5 min read",
    tags: ["Tutorial", "CSV", "Getting Started"],
  },
  {
    slug: "free-data-visualization-tool",
    title: "The Best Free Data Visualization Tool in 2025",
    description: "Compare the top free data visualization tools and see why DataVision AI is the fastest way to turn spreadsheets into charts.",
    date: "2024-12-10",
    readTime: "7 min read",
    tags: ["Comparison", "Tools", "Free"],
  },
  {
    slug: "natural-language-data-analysis",
    title: "Natural Language Data Analysis: Ask Questions, Get Charts",
    description: "How natural language processing is transforming data analytics — and how you can use it today without any technical skills.",
    date: "2024-12-20",
    readTime: "6 min read",
    tags: ["AI", "NLP", "Analytics"],
  },
  {
    slug: "api-integration",
    title: "DataVision AI API Integration Guide",
    description: "How to integrate DataVision AI into your application using our REST API. Full examples in JavaScript, Python, and curl.",
    date: "2024-11-15",
    readTime: "8 min read",
    tags: ["API", "Developer", "Integration"],
  },
];

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "DataVision AI Blog",
  url: `${siteConfig.url}/blog`,
  description: "Guides, tutorials and tips on AI-powered data analytics and visualization.",
  blogPost: posts.map(p => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url: `${siteConfig.url}/blog/${p.slug}`,
    datePublished: p.date,
    author: { "@type": "Organization", name: "DataVision AI" },
  })),
};

export default function BlogPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={blogListSchema} />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />

        <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" />
              Resources
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Guides, tutorials, and tips on AI-powered data analytics and visualization.
            </p>
            <p className="text-base text-muted-foreground mb-16 leading-relaxed">
              Whether you are a business analyst looking for quick insights, a developer building data integrations, or a student exploring datasets for the first time, our blog covers everything from step-by-step CSV analysis tutorials to enterprise security best practices. Learn how to turn raw spreadsheets into actionable charts in seconds.
            </p>

            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="group border-b border-foreground/10 pb-8 last:border-0">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        <FooterSection />
      </main>
    </>
  );
}
