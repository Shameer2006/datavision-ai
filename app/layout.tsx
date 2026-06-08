import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/seo/config";
import { StructuredData, generateSoftwareAppSchema } from "@/lib/seo/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — AI-Powered Data Analytics & Visualization`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  category: "technology",
  classification: "Business Intelligence Software",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — AI-Powered Data Analytics & Visualization`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — Transform your data into insights` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — AI-Powered Data Analytics`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@datavisionai",
    site: "@datavisionai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "", // add your GSC token here after deploy
    "llms-txt": "https://datavision-ai.vercel.app/llms.txt",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

const softwareAppSchema = generateSoftwareAppSchema();

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/chat?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/icon.png`,
    width: 512,
    height: 512,
  },
  sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@datavision.ai",
    contactType: "customer support",
    availableLanguage: "English",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* LLM discovery links */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <StructuredData data={websiteSchema} />
        <StructuredData data={organizationSchema} />
        <StructuredData data={softwareAppSchema} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
