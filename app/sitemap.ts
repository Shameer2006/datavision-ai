import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
}

const routes: RouteConfig[] = [
  // Core pages
  { path: "/",                                      priority: 1.0, changeFrequency: "weekly"  },
  { path: "/about",                                 priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact",                               priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq",                                   priority: 0.9, changeFrequency: "monthly" },
  { path: "/security",                              priority: 0.7, changeFrequency: "yearly"  },
  // Blog index + articles (high priority — drives organic traffic)
  { path: "/blog",                                  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/blog/analyze-csv-with-ai",              priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog/free-data-visualization-tool",     priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog/natural-language-data-analysis",   priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog/api-integration",                  priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog/secure-ai-data-analytics",         priority: 0.9, changeFrequency: "monthly" },
  // Legal
  { path: "/privacy",                               priority: 0.4, changeFrequency: "yearly"  },
  { path: "/terms",                                 priority: 0.4, changeFrequency: "yearly"  },
];

const blogLastModified: Record<string, string> = {
  "/blog/analyze-csv-with-ai":            "2025-06-01",
  "/blog/free-data-visualization-tool":   "2025-06-01",
  "/blog/natural-language-data-analysis": "2025-06-01",
  "/blog/api-integration":                "2025-06-01",
  "/blog/secure-ai-data-analytics":       "2026-06-21",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: blogLastModified[route.path] ?? currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
