import type { Metadata } from "next";
import { siteConfig } from "./config";

interface MetadataProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: MetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const allKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    keywords: allKeywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
      creator: "@datavisionai",
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
