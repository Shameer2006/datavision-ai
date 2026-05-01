export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  logo: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
  };
  twitterHandle: string;
  creator: string;
  email: string;
  phone: string;
  address: {
    streetAddress: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  foundingDate: string;
  priceRange: string;
  keywords: string[];
}

export const siteConfig: SiteConfig = {
  name: "DataVision AI",
  shortName: "DataVision",
  description: "AI-powered data visualization platform. Chat with your data, get instant visualizations, and discover insights in seconds.",
  url: "https://datavision.ai",
  ogImage: "https://datavision.ai/og-image.png",
  logo: "https://datavision.ai/icon.svg",
  links: {
    twitter: "https://twitter.com/datavisionai",
    linkedin: "https://linkedin.com/company/datavisionai",
    youtube: "https://youtube.com/@datavisionai"
  },
  twitterHandle: "@datavisionai",
  creator: "DataVision AI Team",
  email: "hello@datavision.ai",
  phone: "+1-415-555-0100",
  address: {
    streetAddress: "100 Market Street, Suite 400",
    city: "San Francisco",
    region: "CA",
    postalCode: "94105",
    country: "US"
  },
  foundingDate: "2024-01-01",
  priceRange: "Free–$$$",
  keywords: [
    // Primary — high-intent
    "AI data visualization",
    "data visualization software",
    "business intelligence platform",
    "data analytics platform",
    "AI analytics tool",
    // Conversational / NLP
    "chat with your data",
    "natural language data queries",
    "ask questions to your data",
    "conversational analytics",
    "AI-powered data insights",
    // No-code / low-code
    "no-code analytics",
    "no-code dashboards",
    "SQL-free data analysis",
    "build dashboards without code",
    // Use cases
    "automated business insights",
    "real-time data visualization",
    "instant data visualization",
    "AI-powered dashboards",
    "interactive charts and graphs",
    "data exploration platform",
    // Enterprise
    "enterprise analytics AI",
    "AI business intelligence",
    "enterprise data platform",
    "secure data analytics",
    // Long-tail
    "how to visualize data with AI",
    "best AI data visualization tool 2025",
    "data analysis without SQL",
    "smart dashboards",
    "data insights automation",
    "AI data platform"
  ]
};
