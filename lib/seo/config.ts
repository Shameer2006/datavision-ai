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
  url: "https://datavision-ai.vercel.app",
  ogImage: "https://datavision-ai.vercel.app/og-image.png",
  logo: "https://datavision-ai.vercel.app/icon.svg",
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
    "talk to your database",
    "natural language SQL",
    // No-code / low-code
    "no-code analytics",
    "no-code dashboards",
    "SQL-free data analysis",
    "build dashboards without code",
    "no-code BI tool",
    "drag and drop dashboard builder",
    // Use cases
    "automated business insights",
    "real-time data visualization",
    "instant data visualization",
    "AI-powered dashboards",
    "interactive charts and graphs",
    "data exploration platform",
    "automated data analysis",
    "data storytelling tool",
    "self-service analytics",
    "embedded analytics",
    // Enterprise
    "enterprise analytics AI",
    "AI business intelligence",
    "enterprise data platform",
    "secure data analytics",
    "enterprise BI software",
    "large-scale data platform",
    "multi-source data analytics",
    // Comparisons / alternatives
    "Tableau alternative",
    "Power BI alternative",
    "Looker alternative",
    "Metabase alternative",
    "better than Tableau",
    "AI Tableau replacement",
    // Verticals
    "data analytics for startups",
    "data analytics for enterprises",
    "marketing analytics AI",
    "sales analytics dashboard",
    "finance analytics platform",
    "e-commerce data analytics",
    "SaaS analytics tool",
    // Long-tail
    "how to visualize data with AI",
    "best AI data visualization tool 2025",
    "data analysis without SQL",
    "smart dashboards",
    "data insights automation",
    "AI data platform",
    "turn CSV into dashboard",
    "connect database and visualize",
    "AI chart generator",
    "auto generate charts from data",
    "data dashboard in seconds",
    // Data visualization — types & formats
    "bar chart maker online",
    "line chart generator",
    "pie chart creator",
    "scatter plot tool",
    "heatmap visualization",
    "treemap chart tool",
    "funnel chart maker",
    "waterfall chart generator",
    "histogram maker online",
    "area chart tool",
    "bubble chart maker",
    "gantt chart software",
    "geographic data visualization",
    "geospatial data mapping",
    "data map visualization",
    "network graph visualization",
    "sankey diagram maker",
    "KPI dashboard builder",
    "metrics dashboard software",
    "executive dashboard tool",
    // Visual insights — discovery
    "visual data exploration",
    "visual analytics platform",
    "get insights from data visually",
    "data pattern recognition AI",
    "trend analysis visualization",
    "anomaly detection dashboard",
    "outlier detection in data",
    "data correlation tool",
    "visual data discovery",
    "exploratory data analysis tool",
    "EDA tool online",
    "data profiling tool",
    "automated insight generation",
    "AI data pattern detection",
    "predictive analytics visualization",
    "forecasting dashboard",
    "data trend forecasting",
    "cohort analysis tool",
    "retention analytics visualization",
    "funnel analysis dashboard",
    // Data analysis — workflows
    "data analysis tool online",
    "online data analyzer",
    "data report generator",
    "automated reporting tool",
    "business report automation",
    "data summary generator",
    "drag and drop data analysis",
    "point and click analytics",
    "spreadsheet to dashboard",
    "Excel to dashboard converter",
    "Google Sheets dashboard",
    "CSV data visualization",
    "JSON data visualization",
    "database visualization tool",
    "SQL query to chart",
    "query results visualization",
    "data aggregation tool",
    "cross-database analytics",
    "multi-dataset analysis"
  ]
};
