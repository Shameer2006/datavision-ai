import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/", "/*.json$"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/api/", "/admin/"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url
  };
}
