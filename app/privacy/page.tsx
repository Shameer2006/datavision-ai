import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";

export const metadata: Metadata = genMeta({
  title: "Privacy Policy",
  description: "Read the DataVision AI Privacy Policy to understand how we collect, use, and protect your personal data and uploaded datasets.",
  path: "/privacy",
  keywords: ["DataVision AI privacy policy", "data privacy", "GDPR compliance", "user data protection"],
  noIndex: false
});

export default function PrivacyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" }
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
              Legal
            </span>
            <h1 className="text-5xl lg:text-7xl font-display tracking-tight mb-12">
              Privacy Policy
            </h1>

            <div className="space-y-12 text-lg text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">Introduction</h2>
                <p>
                  At DataVision AI, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">Data Collection</h2>
                <p>
                  We primarily process metadata about your data structures (database schemas, field names, data types) to generate visualizations. We do not store your raw database rows on our servers unless explicitly required for specific processing tasks, and even then, only with your consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">How We Use Information</h2>
                <ul className="list-disc pl-6 space-y-4">
                  <li>To provide and improve our AI-powered visualization services.</li>
                  <li>To communicate with you about updates and account details.</li>
                  <li>To ensure the security and integrity of our platform.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">Security</h2>
                <p>
                  We use industry-standard encryption and security protocols to protect your information. Your connection strings and metadata are encrypted both at rest and in transit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">Cookie Details</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display text-foreground mb-6">Third-Party Disclosures</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property, or safety.
                </p>
              </section>
            </div>
          </div>
        </div>

        <FooterSection />
      </main>
    </>
  );
}
