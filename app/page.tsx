import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { StructuredData, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: `${siteConfig.name} — AI Data Analytics & Visualization Platform`,
  description: "Upload CSV or Excel files and instantly transform your data into interactive charts using plain English. No coding required. Powered by Google Gemini AI.",
  alternates: { canonical: siteConfig.url },
};

const faqSchema = generateFAQSchema([
  {
    question: "What is DataVision AI?",
    answer: "DataVision AI is an AI-powered data analytics platform that lets you upload CSV or Excel files and get instant interactive visualizations by asking questions in plain English.",
  },
  {
    question: "Do I need coding skills to use DataVision AI?",
    answer: "No. DataVision AI is designed for everyone. You simply upload your dataset and type questions like \"Show me sales by month\" to get instant charts.",
  },
  {
    question: "What file formats does DataVision AI support?",
    answer: "DataVision AI supports CSV, XLS, and XLSX file formats.",
  },
  {
    question: "Is my data safe with DataVision AI?",
    answer: "Yes. Your data is processed locally and securely. We use metadata-only processing and your raw data never leaves your control.",
  },
  {
    question: "Is DataVision AI free to use?",
    answer: "Yes, DataVision AI offers a free tier with 1,000 analysis credits on sign-up.",
  },
]);

const breadcrumbSchema = generateBreadcrumbSchema([{ name: "Home", path: "/" }]);

// SiteLinksSearchBox schema — tells Google to show a search box in sitelinks
const siteLinksSearchBoxSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: "DataVision AI",
  url: siteConfig.url,
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/chat?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  ],
};

// Sitelinks navigation schema — explicitly lists key pages
const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "DataVision AI Site Navigation",
  itemListElement: [
    { "@type": "SiteLinksSearchBox", position: 1, url: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "About DataVision AI",    url: `${siteConfig.url}/about`    },
    { "@type": "ListItem", position: 3, name: "Security & Compliance",  url: `${siteConfig.url}/security` },
    { "@type": "ListItem", position: 4, name: "Contact Us",             url: `${siteConfig.url}/contact`  },
    { "@type": "ListItem", position: 5, name: "Privacy Policy",         url: `${siteConfig.url}/privacy`  },
    { "@type": "ListItem", position: 6, name: "Terms of Service",       url: `${siteConfig.url}/terms`    },
  ],
};

export default function Home() {
  return (
    <>
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={siteLinksSearchBoxSchema} />
      <StructuredData data={siteNavigationSchema} />
      <main className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
