import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "About DataVision AI - Our Mission to Democratize Data Analytics",
  description: "DataVision AI was founded in 2024 to make data analytics accessible to everyone. Learn how we use AI to turn complex data into instant, beautiful visualizations.",
  path: "/about",
  keywords: ["about DataVision AI", "AI data analytics company", "data visualization startup", "AI business intelligence mission", "data democratization"]
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About" }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Our Story
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-12">
            Democratizing data 
            <br />
            intelligence through AI.
          </h1>
          
          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p>
              At DataVision AI, we believe that data should be accessible to everyone, not just those who can write complex SQL queries or build complicated dashboards. Our mission is to bridge the gap between raw information and meaningful action.
            </p>
            <p>
              Founded in 2024, our platform leverages the latest advancements in large language models and computer graphics to provide a seamless, conversational interface for data analysis. We transform how organizations interact with their most valuable asset.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-24">
            <div>
              <h3 className="text-xl font-medium mb-4 text-foreground">The Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every decision is informed by clear, instant, and beautiful data visualizations that anyone can create.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-4 text-foreground">The Technology</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enterprise-grade metadata processing that ensures security while delivering lightning-fast insights and schema mapping.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
    </>
  );
}
