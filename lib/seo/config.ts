export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  creator: string;
  keywords: string[];
}

export const siteConfig: SiteConfig = {
  name: "DataVision AI",
  description: "AI-powered data visualization platform. Chat with your data, get instant visualizations, and discover insights in seconds.",
  url: "https://datavision.ai",
  ogImage: "https://datavision.ai/og-image.png",
  links: {
    twitter: "https://twitter.com/datavisionai",
    linkedin: "https://linkedin.com/company/datavisionai"
  },
  creator: "DataVision AI Team",
  keywords: [
    "AI data visualization",
    "data analytics",
    "business intelligence",
    "automated insights",
    "data chat interface",
    "conversational analytics",
    "AI-powered dashboards",
    "real-time data insights"
  ]
};
