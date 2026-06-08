import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateFAQSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "Frequently Asked Questions — DataVision AI",
  description: "Find answers to common questions about DataVision AI, pricing, security, and how our AI-powered data analytics platform works.",
  path: "/faq",
  keywords: ["DataVision AI FAQ", "help center", "frequently asked questions", "AI analytics support"]
});

const faqItems = [
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
];

export default function FAQPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "FAQ" }
  ]);
  
  const faqSchema = generateFAQSchema(faqItems);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
        <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[800px] mx-auto">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Support
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-16">
            Frequently Asked
            <br />
            Questions.
          </h1>
          
          <div className="space-y-12">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-foreground/10 pb-8 last:border-0">
                <h3 className="text-xl font-medium mb-4 text-foreground">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <FooterSection />
      </main>
    </>
  );
}
