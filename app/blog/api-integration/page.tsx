import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ApiDocsContent } from "./api-docs-content";

export const metadata: Metadata = genMeta({
  title: "Integrate DataVision API — Developer Guide",
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
        <ApiDocsContent />
        <FooterSection />
      </main>
    </>
  );
}
