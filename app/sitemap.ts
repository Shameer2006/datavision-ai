import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
}

const routes: RouteConfig[] = [
  { path: "/",         priority: 1.0, changeFrequency: "weekly"  },
  { path: "/about",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/security", priority: 0.7, changeFrequency: "yearly"  },
  { path: "/contact",  priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy",  priority: 0.4, changeFrequency: "yearly"  },
  { path: "/terms",    priority: 0.4, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
