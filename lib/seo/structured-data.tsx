import React from "react";
import { siteConfig } from "./config";

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.logo,
      width: 512,
      height: 512
    } as unknown as string,
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country
    } as unknown as string,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.email,
        availableLanguage: "English"
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@datavision.ai",
        availableLanguage: "English"
      }
    ] as unknown as string,
    sameAs: Object.values(siteConfig.links).filter(Boolean) as string[]
  };
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
  };
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
}

export function generateSoftwareApplicationSchema(): SoftwareApplicationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "DataVisualization",
    operatingSystem: "Web, Windows, macOS, Linux",
    softwareVersion: "2.0",
    screenshot: `${siteConfig.url}/og-image.png`,
    image: siteConfig.ogImage,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available. Paid plans from $29/month."
    } as unknown as { "@type": "Offer"; price: string; priceCurrency: string },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1200",
      bestRating: "5",
      worstRating: "1"
    }
  } as unknown as SoftwareApplicationSchema;
}

export interface AggregateReviewSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  url: string;
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: string;
    bestRating: string;
    worstRating: string;
    ratingCount: string;
  };
  review: Array<{
    "@type": "Review";
    reviewRating: { "@type": "Rating"; ratingValue: string };
    author: { "@type": "Person"; name: string };
    reviewBody: string;
  }>;
}

export function generateAggregateReviewSchema(): AggregateReviewSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1200"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        author: { "@type": "Person", name: "Sarah Chen" },
        reviewBody: "DataVision AI transformed how we understand our data. What used to take days of analysis now happens in seconds."
      },
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        author: { "@type": "Person", name: "Marcus Webb" },
        reviewBody: "The natural language queries are game-changing. Our team can ask questions without knowing SQL."
      },
      {
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        author: { "@type": "Person", name: "Elena Rodriguez" },
        reviewBody: "Finally, data visualization that actually understands context. Our decision-making is faster than ever."
      }
    ]
  };
}

export function generateFAQSchema(): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is DataVision AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DataVision AI is an AI-powered data visualization platform that lets you chat with your data and get instant, beautiful visualizations without writing code."
        }
      },
      {
        "@type": "Question",
        name: "How does DataVision AI work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply connect your data source, type a question in plain English, and DataVision AI automatically generates charts, graphs, and insights in seconds using advanced AI."
        }
      },
      {
        "@type": "Question",
        name: "Is DataVision AI free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, DataVision AI offers a free trial. Paid plans are available for teams and enterprises needing advanced features and higher data limits."
        }
      },
      {
        "@type": "Question",
        name: "What data sources does DataVision AI support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DataVision AI supports 100+ data source types including databases, spreadsheets, APIs, and cloud storage services."
        }
      },
      {
        "@type": "Question",
        name: "Is my data secure with DataVision AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DataVision AI uses 256-bit encryption and enterprise-grade security. We only process metadata, never storing your raw data."
        }
      }
    ]
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; path?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${siteConfig.url}${item.path}` })
    }))
  };
}

export function generateWebPageSchema({
  title,
  description,
  path,
  datePublished,
  dateModified
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteConfig.url}${path}`,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", url: siteConfig.url },
    datePublished: datePublished ?? siteConfig.foundingDate,
    dateModified: dateModified ?? new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo
      }
    }
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SoftwareApplication"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: siteConfig.logo,
    image: siteConfig.ogImage,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.7749,
      longitude: -122.4194
    },
    openingHours: "Mo-Fr 09:00-18:00",
    priceRange: siteConfig.priceRange,
    sameAs: Object.values(siteConfig.links).filter(Boolean)
  };
}

// Helper component to embed structured data
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
