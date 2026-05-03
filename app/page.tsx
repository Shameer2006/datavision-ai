import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import {
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateAggregateReviewSchema,
  generateWebPageSchema,
  StructuredData
} from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { SecuritySection } from "@/components/landing/security-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "DataVision AI - AI Data Visualization & Analytics Platform",
  description: "Transform raw data into stunning visualizations instantly. Chat with your data using AI, get automated insights, and build dashboards without code. The smart Tableau & Power BI alternative. Try free.",
  path: "/",
  keywords: [
    "AI data visualization tool",
    "conversational analytics platform",
    "no-code data dashboards",
    "automated business insights",
    "natural language data queries",
    "real-time data visualization",
    "AI-powered business intelligence",
    "data analytics software",
    "interactive charts and graphs",
    "SQL-free data analysis",
    "chat with your data AI",
    "best data visualization tool 2025",
    "AI dashboard builder",
    "data analysis tool for non-technical users",
    "turn data into insights automatically",
    "Tableau alternative free",
    "Power BI alternative AI",
    "Looker alternative no-code",
    "AI chart generator from data",
    "connect database and visualize",
    "auto generate dashboard from CSV",
    "marketing analytics dashboard",
    "sales analytics AI tool",
    "self-service BI platform",
    "talk to your database AI"
  ]
});

export default function Home() {
  const webPageSchema = generateWebPageSchema({
    title: "DataVision AI - AI Data Visualization Platform",
    description: "Transform raw data into stunning visualizations instantly. Chat with your data using AI, get automated insights, and build dashboards without code.",
    path: "/"
  });

  return (
    <>
      <StructuredData data={generateSoftwareApplicationSchema()} />
      <StructuredData data={generateFAQSchema()} />
      <StructuredData data={generateAggregateReviewSchema()} />
      <StructuredData data={webPageSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
        <HeroSection />
        <section id="features" aria-label="Features"><FeaturesSection /></section>
        <section id="how-it-works" aria-label="How It Works"><HowItWorksSection /></section>
        <section id="infrastructure" aria-label="Infrastructure"><InfrastructureSection /></section>
        <section id="metrics" aria-label="Metrics"><MetricsSection /></section>
        <section id="integrations" aria-label="Integrations"><IntegrationsSection /></section>
        <section id="security" aria-label="Security"><SecuritySection /></section>
        <section id="developers" aria-label="Developers"><DevelopersSection /></section>
        <section id="testimonials" aria-label="Testimonials"><TestimonialsSection /></section>
        <section id="pricing" aria-label="Pricing"><PricingSection /></section>
        <CtaSection />
        <FooterSection />
      </main>
    </>
  );
}
