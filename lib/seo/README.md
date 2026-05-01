# SEO Utilities Documentation

This directory contains reusable SEO utilities for the DataVision AI website. These utilities help maintain consistent, optimized metadata across all pages.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Metadata Generation](#metadata-generation)
- [Structured Data](#structured-data)
- [Sitemap & Robots](#sitemap--robots)
- [Performance Guidelines](#performance-guidelines)
- [Semantic HTML Guidelines](#semantic-html-guidelines)

## Quick Start

### Adding SEO to a New Page

```typescript
import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, StructuredData } from "@/lib/seo/structured-data";

export const metadata: Metadata = genMeta({
  title: "Your Page Title",
  description: "Your page description (150-160 characters recommended)",
  path: "/your-page-path",
  keywords: ["keyword1", "keyword2", "keyword3"]
});

export default function YourPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Your Page" }
  ]);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <main>
        {/* Your page content */}
      </main>
    </>
  );
}
```

## Configuration

### Site Configuration (`config.ts`)

The `siteConfig` object contains site-wide SEO settings:

```typescript
export const siteConfig: SiteConfig = {
  name: "DataVision AI",
  description: "AI-powered data visualization platform...",
  url: "https://datavision.ai",
  ogImage: "https://datavision.ai/og-image.png",
  links: {
    twitter: "https://twitter.com/datavisionai",
    linkedin: "https://linkedin.com/company/datavisionai"
  },
  creator: "DataVision AI Team",
  keywords: [/* default keywords */]
};
```

**Important:** Update `siteConfig.url` to your production domain before deploying.

## Metadata Generation

### `generateMetadata()` Function

Generates comprehensive metadata for a page including Open Graph and Twitter Card tags.

#### Parameters

```typescript
interface PageMetadataProps {
  title: string;              // Page title (50-60 chars recommended)
  description: string;        // Page description (150-160 chars recommended)
  path: string;              // Page path (e.g., "/about")
  image?: string;            // Custom OG image URL (optional)
  keywords?: string[];       // Additional keywords (optional)
  noIndex?: boolean;         // Prevent search engine indexing (optional)
  publishedTime?: string;    // ISO 8601 date (optional)
  modifiedTime?: string;     // ISO 8601 date (optional)
}
```

#### Example Usage

```typescript
// Basic usage
export const metadata: Metadata = genMeta({
  title: "About Us",
  description: "Learn about our mission and team",
  path: "/about"
});

// With custom image and keywords
export const metadata: Metadata = genMeta({
  title: "Product Launch",
  description: "Introducing our new AI-powered features",
  path: "/blog/product-launch",
  image: "https://datavision.ai/images/product-launch.png",
  keywords: ["product launch", "new features", "AI"],
  publishedTime: "2024-01-15T00:00:00Z"
});

// Legal page (no indexing)
export const metadata: Metadata = genMeta({
  title: "Privacy Policy",
  description: "Our privacy policy and data handling practices",
  path: "/privacy",
  noIndex: true
});
```

### `getDefaultMetadata()` Function

Returns default metadata for the site (used in root layout).

```typescript
export const metadata: Metadata = getDefaultMetadata();
```

## Structured Data

### Organization Schema

Automatically included in the root layout. Defines your organization for search engines.

```typescript
const organizationSchema = generateOrganizationSchema();
```

### WebSite Schema

Automatically included in the root layout. Defines your website and search functionality.

```typescript
const websiteSchema = generateWebSiteSchema();
```

### Breadcrumb Schema

Add breadcrumb navigation to pages for better SEO and rich snippets.

```typescript
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Product Name" } // Last item typically has no path
]);

// Embed in your page
<StructuredData data={breadcrumbSchema} />
```

### Custom Structured Data

You can create custom structured data and embed it using the `StructuredData` component:

```typescript
const customSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Your Article Title",
  author: {
    "@type": "Person",
    name: "Author Name"
  }
};

<StructuredData data={customSchema} />
```

## Sitemap & Robots

### Adding Pages to Sitemap

Edit `app/sitemap.ts` to add new pages:

```typescript
const routes: RouteConfig[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/your-new-page", priority: 0.7, changeFrequency: "weekly" }
];
```

**Priority Guidelines:**
- `1.0`: Homepage
- `0.8-0.9`: Main pages (About, Products, Services)
- `0.6-0.7`: Secondary pages (Blog posts, Case studies)
- `0.4-0.5`: Legal pages (Privacy, Terms)

**Change Frequency Guidelines:**
- `daily`: News, blog homepage
- `weekly`: Product pages, main content
- `monthly`: About, team pages
- `yearly`: Legal pages, static content

### Robots.txt Configuration

Edit `app/robots.ts` to control crawler access:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
```

## Performance Guidelines

### Image Optimization

Always use Next.js `Image` component for optimal performance:

```typescript
import Image from "next/image";

<Image
  src="/your-image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy" // For below-the-fold images
  priority // For above-the-fold images
/>
```

**Best Practices:**
- Always include `width` and `height` to prevent layout shift
- Use descriptive `alt` text for accessibility and SEO
- Use `priority` for above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Prefer modern formats (WebP, AVIF) - Next.js handles this automatically

### Core Web Vitals

Monitor and optimize for Core Web Vitals:

1. **Largest Contentful Paint (LCP)**: < 2.5s
   - Optimize images
   - Use font-display: swap
   - Minimize render-blocking resources

2. **First Input Delay (FID)**: < 100ms
   - Minimize JavaScript execution time
   - Break up long tasks
   - Use code splitting

3. **Cumulative Layout Shift (CLS)**: < 0.1
   - Always set image dimensions
   - Reserve space for dynamic content
   - Avoid inserting content above existing content

### Font Optimization

Fonts are already optimized with `display: "swap"` in `app/layout.tsx`:

```typescript
const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument',
  display: 'swap' // Prevents FOIT (Flash of Invisible Text)
});
```

## Semantic HTML Guidelines

### Heading Hierarchy

Always maintain proper heading hierarchy:

```html
<h1>Page Title</h1>           <!-- One per page -->
  <h2>Main Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Main Section</h2>
    <h3>Subsection</h3>
```

**Rules:**
- One `<h1>` per page
- Don't skip heading levels (h1 → h3)
- Use headings for structure, not styling

### Semantic Elements

Use HTML5 semantic elements:

```html
<header>  <!-- Site/page header -->
<nav>     <!-- Navigation -->
<main>    <!-- Main content (one per page) -->
<article> <!-- Self-contained content -->
<section> <!-- Thematic grouping -->
<aside>   <!-- Sidebar content -->
<footer>  <!-- Site/page footer -->
```

### Link Best Practices

Use descriptive link text:

```html
<!-- Bad -->
<a href="/about">Click here</a>

<!-- Good -->
<a href="/about">Learn about our mission</a>
```

### Accessibility

Ensure all interactive elements are keyboard accessible:

```html
<!-- Buttons should be <button> elements -->
<button onClick={handleClick}>Submit</button>

<!-- Links should be <a> elements -->
<a href="/page">Go to page</a>

<!-- Form inputs need labels -->
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

## Testing & Validation

### Manual Testing Checklist

Before deploying, test your SEO implementation:

- [ ] **Open Graph Preview**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] **Twitter Card Preview**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] **Structured Data**: [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **Sitemap**: Visit `/sitemap.xml` and verify all pages are listed
- [ ] **Robots.txt**: Visit `/robots.txt` and verify rules are correct
- [ ] **Mobile Viewport**: Test on real mobile devices
- [ ] **Lighthouse Audit**: Run in Chrome DevTools (target SEO score > 90)
- [ ] **Core Web Vitals**: [PageSpeed Insights](https://pagespeed.web.dev/)

### Common Issues

**Issue: Metadata not updating**
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

**Issue: Sitemap not accessible**
- Ensure `app/sitemap.ts` exists
- Check build output for errors
- Verify production URL in `siteConfig.url`

**Issue: Open Graph image not showing**
- Verify image is 1200x630px
- Check image is under 300KB
- Ensure image URL is absolute
- Clear social media cache (Facebook Debugger, Twitter Validator)

## Deployment Checklist

Before deploying to production:

- [ ] Update `siteConfig.url` to production domain
- [ ] Replace `public/og-image.png` with branded 1200x630px image
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Verify robots.txt is not blocking important pages
- [ ] Run Lighthouse audit on production URL
- [ ] Verify canonical URLs point to correct domain
- [ ] Test all pages with social media validators

## Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)
- [Core Web Vitals](https://web.dev/vitals/)
