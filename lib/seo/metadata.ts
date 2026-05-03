import type { Metadata } from "next";
import { siteConfig } from "./config";

export interface PageMetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

// Development-only logging utility
function logSEOWarning(message: string, context?: object) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[SEO Warning]: ${message}`, context);
  }
}

export function generateMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime
}: PageMetadataProps): Metadata {
  try {
    // Validate and optimize title length (50-60 characters recommended)
    let optimizedTitle = title;
    if (title.length > 60) {
      logSEOWarning("Title exceeds recommended length", { 
        title, 
        length: title.length 
      });
      optimizedTitle = title.substring(0, 57) + "...";
    }

    // Validate and optimize description length (150-160 characters recommended)
    let optimizedDescription = description;
    if (description.length > 160) {
      logSEOWarning("Description exceeds recommended length", { 
        description, 
        length: description.length 
      });
      optimizedDescription = description.substring(0, 157) + "...";
    }

    const url = `${siteConfig.url}${path}`;
    const ogImage = image || siteConfig.ogImage;
    const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
    
    return {
      title: fullTitle,
      description: optimizedDescription,
      keywords: [...siteConfig.keywords, ...keywords],
      authors: [{ name: siteConfig.creator, url: siteConfig.url }],
      creator: siteConfig.creator,
      publisher: siteConfig.name,
      applicationName: siteConfig.shortName,
      generator: "Next.js",
      referrer: "origin-when-cross-origin",
      category: "technology",
      classification: "Business Software",
      robots: noIndex
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
              index: true,
              follow: true,
              noimageindex: false,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1
            }
          },
      alternates: {
        canonical: url,
        languages: {
          "en-US": url,
          "x-default": url
        }
      },
      formatDetection: {
        email: false,
        address: false,
        telephone: false
      },
      appleWebApp: {
        capable: true,
        title: siteConfig.shortName,
        statusBarStyle: "default"
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url,
        title: fullTitle,
        description: optimizedDescription,
        siteName: siteConfig.name,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${title} - ${siteConfig.name}`,
            type: "image/png"
          }
        ],
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime })
      },
      twitter: {
        card: "summary_large_image",
        site: siteConfig.twitterHandle,
        title: fullTitle,
        description: optimizedDescription,
        images: [
          {
            url: ogImage,
            alt: `${title} - ${siteConfig.name}`
          }
        ],
        creator: siteConfig.twitterHandle
      },
      metadataBase: new URL(siteConfig.url)
    };
  } catch (error) {
    logSEOWarning("Error generating metadata", { error, title, description, path });
    // Return minimal valid metadata as fallback
    return {
      title: siteConfig.name,
      description: siteConfig.description,
      metadataBase: new URL(siteConfig.url)
    };
  }
}

// Helper for generating default metadata
export function getDefaultMetadata(): Metadata {
  return generateMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/"
  });
}
