import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "About Us — AI Data Analytics Mission",
  description: "Learn how DataVision AI uses Gemini to turn spreadsheets into instant charts. Free, no-code data analytics for everyone.",
  path: "/about",
  keywords: ["about DataVision AI", "AI data analytics company", "data visualization startup", "democratize data analytics", "AI business intelligence", "no-code analytics platform"]
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About DataVision AI", path: "/about" }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Our Story
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-12">
            About DataVision AI
          </h1>
          
          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p>
              At DataVision AI, we believe that data should be accessible to everyone, not just those who can write complex SQL queries or build complicated dashboards. Our mission is to bridge the gap between raw information and meaningful action by democratizing data analytics.
            </p>
            <p>
              Founded in 2024, our platform leverages the latest advancements in large language models and computer graphics to provide a seamless, conversational interface for data analysis. We transform how organizations interact with their most valuable asset by removing the technical barriers that traditionally slow down decision-making.
            </p>
          </div>
          
          <div className="mt-24 mb-24">
            <h2 className="text-3xl font-display tracking-tight mb-8 text-foreground">Why We Built DataVision AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-foreground">The Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Traditional data analytics tools are intimidating. They require specialized knowledge, hours of setup, and a steep learning curve. This leaves business owners, marketers, and operators waiting days for a simple chart from their data team. The speed of business is fast, but data analysis was painfully slow.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-foreground">Our Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We built a platform where you can simply ask questions in plain English. Want to know your top-selling products last month? Just type it. Need a pie chart of your regional revenue? Ask for it. DataVision AI instantly parses your intent and generates the exact visualization you need.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-foreground/[0.02] border border-foreground/10 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl font-display tracking-tight mb-8 text-foreground">Our Core Pillars</h2>
            <ul className="space-y-8">
              <li className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">1</div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-foreground">Simplicity First</h3>
                  <p className="text-muted-foreground leading-relaxed">No coding, no complex formulas, and no steep learning curves. If you can type a question, you can be a data analyst. We hide the complexity behind a beautiful, intuitive chat interface.</p>
                </div>
              </li>
              <li className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">2</div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-foreground">Uncompromising Security</h3>
                  <p className="text-muted-foreground leading-relaxed">Your data remains your data. We use metadata-only processing, meaning our AI only looks at your column names and structure—not the sensitive information inside your rows. We utilize enterprise-grade encryption for all interactions.</p>
                </div>
              </li>
              <li className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">3</div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-foreground">Instant Value</h3>
                  <p className="text-muted-foreground leading-relaxed">Time is money. You shouldn&apos;t have to wait for a weekly report to make a critical business decision. DataVision AI delivers insights in seconds, allowing you to pivot, adapt, and grow faster than ever before.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
    </>
  );
}
