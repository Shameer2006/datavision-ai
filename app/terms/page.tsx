import type { Metadata } from "next";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = {
  title: "Terms of Service | DataVision AI",
  description: "Read our terms of service to understand the rules and guidelines for using DataVision AI.",
  keywords: ["terms of service", "AI SaaS agreement", "DataVision usage policy", "legal service terms"],
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
            <span className="w-8 h-px bg-foreground/30" />
            Legal
          </span>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-12">
            Terms of Service.
          </h1>
          
          <div className="space-y-12 text-lg text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-display text-foreground mb-6">1. Acceptance of Terms</h2>
              <p>
                By accessing or using DataVision AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-6">2. Description of Service</h2>
              <p>
                DataVision AI provides an AI-powered data visualization and analytics platform. We grant you a non-exclusive, non-transferable, revocable license to use the service for your business or personal needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-6">3. User Obligations</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service in compliance with all applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-6">4. Intellectual Property</h2>
              <p>
                All content, trademarks, and data on our platform are the property of DataVision AI. You may not use, copy, or distribute any part of the platform without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-6">5. Limitation of Liability</h2>
              <p>
                DataVision AI shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.
              </p>
            </section>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
