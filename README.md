# DataVision AI

> **AI-powered data visualization platform.** Chat with your data, get instant visualizations, and discover insights in seconds — no code required.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Overview

DataVision AI is a modern SaaS landing page and platform built with **Next.js 16**, featuring a fully optimised SEO architecture, smooth in-page scrolling, rich structured data, and premium UI animations — all without a single line of manual SQL or complex dashboard configuration.

**Live site:** [datavision.ai](https://datavision.ai)

---

## Features

- 🤖 **AI-Powered Chat Interface** — Ask questions in plain English, get instant charts and insights
- 📊 **100+ Data Source Integrations** — Databases, spreadsheets, APIs, cloud storage
- ⚡ **1ms Query Response** — Enterprise-grade infrastructure with 99.9% uptime
- 🔒 **Enterprise Security** — AES-256 encryption, TLS 1.3, SOC2/GDPR/HIPAA-aligned
- 📱 **Responsive & PWA-Ready** — Works on all devices, installable as a web app
- 🎨 **Premium Animations** — Animated 3D sphere, tetrahedron, wave, and character-level text reveals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Fonts | Instrument Sans, Instrument Serif, JetBrains Mono |
| Analytics | Vercel Analytics + Speed Insights |
| Icons | Lucide React |
| Deployment | Vercel (auto-deploy on push to `main`) |

---

## SEO Architecture

This project implements a **maximum SEO** setup across every layer:

### Metadata (`lib/seo/`)
- **`config.ts`** — Central site configuration: name, URL, keywords, social links, address, contact
- **`metadata.ts`** — Generates per-page `Metadata` with canonical URLs, `hreflang` (`en-US` + `x-default`), Open Graph, Twitter Cards, `appleWebApp`, `formatDetection`
- **`structured-data.tsx`** — Schema.org JSON-LD generators:
  - `Organization` (with `PostalAddress` + `ContactPoint`)
  - `WebSite` (with `SearchAction`)
  - `SoftwareApplication` (with `AggregateRating`, `Offer`, `screenshot`)
  - `FAQPage`
  - `Product` + `Review` aggregate
  - `BreadcrumbList` (per-page)
  - `WebPage` (per-page)
  - `LocalBusiness` (site-wide)

### Technical SEO
- **`/sitemap.xml`** — Auto-generated with priorities and change frequencies for all public routes
- **`/robots.txt`** — Explicit rules for Googlebot, Googlebot-Image, Bingbot, DuckDuckBot, Baiduspider, YandexBot
- **`/manifest.json`** — Web app manifest for PWA install prompts and mobile search signals
- **`next.config.mjs`** — `X-Robots-Tag` headers, aggressive `Cache-Control`, `stale-while-revalidate`, `poweredByHeader: false`, AVIF/WebP image optimisation
- **Google Search Console** — Verified via `google28b6dbf4d718a7b0.html`

### Smooth Scrolling
- CSS `scroll-behavior: smooth` + `scroll-padding-top: 5rem` (accounts for fixed nav)
- JS smooth scroll handler in `Navigation` with active section tracking and `aria-current`
- `history.pushState` updates the URL hash without triggering a page jump

---

## Project Structure

```
datavision-ai/
├── app/
│   ├── layout.tsx          # Root layout: fonts, structured data, icons, manifest
│   ├── page.tsx            # Home page: all section composition + structured data
│   ├── globals.css         # Design tokens, animations, smooth scroll config
│   ├── robots.ts           # Dynamic robots.txt
│   ├── sitemap.ts          # Dynamic XML sitemap
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── security/           # Security & compliance page
│   ├── terms/              # Terms of service
│   └── privacy/            # Privacy policy
├── components/
│   └── landing/
│       ├── navigation.tsx          # Fixed nav with smooth scroll + active state
│       ├── hero-section.tsx        # Animated hero with word cycle
│       ├── features-section.tsx    # Feature cards grid
│       ├── how-it-works-section.tsx
│       ├── infrastructure-section.tsx
│       ├── metrics-section.tsx
│       ├── integrations-section.tsx
│       ├── security-section.tsx
│       ├── developers-section.tsx
│       ├── testimonials-section.tsx
│       ├── pricing-section.tsx
│       ├── cta-section.tsx
│       ├── footer-section.tsx
│       ├── animated-sphere.tsx     # 3D WebGL-style sphere animation
│       ├── animated-tetrahedron.tsx
│       └── animated-wave.tsx
├── lib/
│   └── seo/
│       ├── config.ts           # Site-wide SEO configuration
│       ├── metadata.ts         # Per-page metadata generator
│       ├── structured-data.tsx # JSON-LD schema generators
│       └── README.md           # SEO system documentation
├── public/
│   ├── manifest.json           # PWA web app manifest
│   ├── og-image.png            # Open Graph image (1200x630)
│   ├── apple-icon.png          # Apple touch icon (180x180)
│   ├── icon.svg                # SVG favicon
│   └── google28b6dbf4d718a7b0.html  # Search Console verification
└── next.config.mjs             # Next.js config: headers, images, compression
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## Deployment

Every push to `main` automatically deploys to **Vercel**.

This repository is linked to a [v0](https://v0.app) project for AI-assisted UI development:

[Continue working on v0 →](https://v0.app/chat/projects/prj_EGOchmFfbqKBv1YAauKw60cgmA93)

<a href="https://v0.app/chat/api/kiro/clone/Shameer2006/datavision-ai" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>

---

## License

MIT © [DataVision AI Team](https://datavision.ai)
