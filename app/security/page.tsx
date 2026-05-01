import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Shield, Lock, EyeOff, ShieldCheck } from "lucide-react";

export const metadata: Metadata = genMeta({
  title: "Security & Compliance - SOC2, GDPR & HIPAA | DataVision AI",
  description: "DataVision AI uses AES-256 encryption, TLS 1.3, zero-knowledge row access, and SOC2/GDPR/HIPAA-aligned practices to keep your data safe.",
  path: "/security",
  keywords: ["enterprise data security", "AES-256 encryption", "SOC2 compliance", "GDPR data analytics", "HIPAA compliant analytics", "secure AI data platform", "zero-knowledge analytics"]
});

export default function SecurityPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Security" }
  ]);

  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "End-to-End Encryption",
      description: "All metadata and connection strings are encrypted in transit using TLS 1.3 and at rest using AES-256."
    },
    {
      icon: <EyeOff className="w-8 h-8" />,
      title: "Zero-Knowledge Row Access",
      description: "Our AI engine only processes schema metadata. We never store or permanentely access your raw database rows."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Compliance Standards",
      description: "Built to align with SOC2, GDPR, and HIPAA requirements for data handling and organizational security."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Network Protection",
      description: "Dedicated VPC environments and strictly filtered network access to ensure your data is isolated."
    }
  ];

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Trust & Safety
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-12">
            Your data is 
            <br />
            your most valuable asset.
          </h1>
          
          <div className="text-xl text-muted-foreground mb-24 max-w-2xl leading-relaxed">
            Security isn&apos;t a feature—it&apos;s the foundation of everything we build. We implement multiple layers of protection to ensure your insights remain yours alone.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
            {securityFeatures.map((feature, i) => (
              <div key={i} className="bg-background p-10 lg:p-12">
                <div className="text-foreground mb-8">{feature.icon}</div>
                <h3 className="text-2xl font-display mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 py-16 px-10 bg-foreground text-background rounded-2xl">
            <h2 className="text-3xl font-display mb-6">Need a security overview?</h2>
            <p className="text-background/80 mb-8 max-w-lg">
              Download our full security whitepaper or speak with our compliance team regarding specific regulatory requirements.
            </p>
            <button className="px-8 h-14 bg-background text-foreground rounded-full font-medium hover:bg-background/90 transition-colors">
              Contact Compliance
            </button>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
    </>
  );
}
