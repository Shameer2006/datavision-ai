import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { StructuredData } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = genMeta({
  title: "Chat — Analyze Your Data with AI",
  description:
    "Upload CSV, Excel, or connect your database. Ask questions in plain English and get instant interactive charts, trends, and insights powered by AI.",
  path: "/chat",
  keywords: [
    "AI data chat",
    "upload CSV analyze",
    "conversational data analytics",
    "interactive data charts",
    "natural language data query",
    "AI dashboard builder",
  ],
});

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: `${siteConfig.name} Chat`,
  url: `${siteConfig.url}/chat`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Conversational AI interface for data analytics. Upload datasets and ask questions in natural language to get instant visualizations.",
  featureList: [
    "CSV and Excel file upload",
    "Natural language data querying",
    "Interactive Plotly charts",
    "Multi-conversation history",
    "Dark and light mode",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={softwareAppSchema} />
      {children}
    </>
  );
}
