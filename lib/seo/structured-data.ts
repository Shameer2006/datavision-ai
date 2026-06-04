import React from "react";
import { siteConfig } from "./config";

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${siteConfig.url}${item.path}` }),
    })),
  };
}

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  });
}
