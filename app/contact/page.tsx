import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Mail, MessageCircle, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = genMeta({
  title: "Contact Us",
  description: "Get in touch with the DataVision AI team for support, sales inquiries, or partnership opportunities.",
  path: "/contact",
  keywords: ["contact DataVision AI", "AI support", "sales inquiry", "customer help", "partnership opportunities"]
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact" }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main className="relative min-h-screen overflow-x-hidden noise-overlay">
        <Navigation />
      
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-8 h-px bg-foreground/30" />
              Get in touch
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-8">
              Let&apos;s talk about 
              <br />
              your data.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Have questions about our platform or want to see a custom demo? Our team is ready to help you transform your information into insights.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Email us</h3>
                  <a href="mailto:hello@datavision.ai" className="text-muted-foreground hover:text-foreground transition-colors">
                    hello@datavision.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Support chat</h3>
                  <p className="text-muted-foreground">Available 24/7 for enterprise customers.</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Headquarters</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-foreground/[0.02] border border-foreground/10 p-8 lg:p-12 rounded-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First name</label>
                  <input type="text" className="w-full h-12 px-4 bg-background border border-foreground/10 rounded-lg focus:ring-2 focus:ring-foreground/20 outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last name</label>
                  <input type="text" className="w-full h-12 px-4 bg-background border border-foreground/10 rounded-lg focus:ring-2 focus:ring-foreground/20 outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email address</label>
                <input type="email" className="w-full h-12 px-4 bg-background border border-foreground/10 rounded-lg focus:ring-2 focus:ring-foreground/20 outline-none transition-all" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full h-32 p-4 bg-background border border-foreground/10 rounded-lg focus:ring-2 focus:ring-foreground/20 outline-none transition-all resize-none" placeholder="Tell us about your data needs..." />
              </div>

              <button className="w-full h-14 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group">
                Send message
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
    </>
  );
}
