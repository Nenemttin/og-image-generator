<div align="center">

# TinyOG — Lightning-fast Dynamic Social Cards with One URL

**Zero-config, high-converting Open Graph image generator powered by Next.js Edge Runtime.**

[![Website](https://img.shields.io/badge/Production-tinyog.cloud-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://tinyog.cloud)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Edge Runtime](https://img.shields.io/badge/Edge_Runtime-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Lemon Squeezy](https://img.shields.io/badge/Merchant_of_Record-Lemon_Squeezy-FFC72C?style=for-the-badge&logoColor=black)](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3)
[![License](https://img.shields.io/badge/License-Lifetime_Pass_%2F_$29-8b5cf6?style=for-the-badge)](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3)

<br />

[**Launch Studio**](https://tinyog.cloud) • [**Get Lifetime Pass ($29)**](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3) • [**Quick Start**](#-quick-start) • [**API Reference**](#-api-reference-table) • [**Pricing**](#-pricing--lifetime-pass)

</div>

---

## ⚡ Overview

Stop opening Figma, manually exporting heavy PNG files, and uploading static `1200x630` social cards for every blog post, release note, or documentation page.

**TinyOG** is an edge-native Open Graph card engine. It dynamically renders pixel-perfect, high-DPI social preview cards on-the-fly via a single URL endpoint. Drop the generated URL directly into your HTML `<meta>` tags, and your Twitter Cards, Facebook previews, LinkedIn cards, and Slack/Discord unfurls will always reflect your latest content in real time.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| ⚡ **Edge-Cached 1200x630 Rendering** | Synthesizes cards via Next.js Edge Runtime and `@vercel/og` (Satori/Resvg). Globally cached across CDN edge nodes with sub-50ms latency. |
| 🎨 **8 Designer Themes** | Instantly toggle between **Dark**, **Minimal**, **Gradient**, **Terminal**, **Notion**, **Bento**, **Cyberpunk**, and **Sunset** themes via URL query parameters. |
| 🛡️ **Zero-Maintenance Stateless Architecture** | 100% stateless engine. No databases, no stored visitor logs, and no tracking cookies—guaranteeing GDPR and CCPA compliance. |
| 💻 **0ms Instant Client Playground** | Interactive dashboard with real-time DOM canvas preview (zero typing delay), live theme selector, and 1-click HTML meta tag copy. |
| 🔤 **Optimized Edge Typography** | In-memory cached Pretendard variable font delivering razor-sharp multilingual rendering across all devices. |

---

## 🚀 Quick Start

### 1. HTML Meta Tag (One-Line Integration)

Drop this single line into your `<head>` tag:

```html
<meta property="og:image" content="https://tinyog.cloud/api/og?title=Hello+World&tag=BLOG&theme=bento" />
```

### 2. Comprehensive Social Card Integration

For full coverage across X (Twitter), LinkedIn, Discord, Slack, and Facebook:

```html
<!-- Open Graph / Facebook / LinkedIn / Discord -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Building Modern Web Applications at the Edge" />
<meta property="og:description" content="Generate high-converting, dynamic Open Graph images at the Edge with a single URL." />
<meta property="og:image" content="https://tinyog.cloud/api/og?title=Building+Modern+Web+Applications+at+the+Edge&tag=ARCHITECTURE&theme=bento&key=YOUR_PRO_LICENSE_KEY" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Building Modern Web Applications at the Edge" />
<meta name="twitter:description" content="Generate high-converting, dynamic Open Graph images at the Edge with a single URL." />
<meta name="twitter:image" content="https://tinyog.cloud/api/og?title=Building+Modern+Web+Applications+at+the+Edge&tag=ARCHITECTURE&theme=bento&key=YOUR_PRO_LICENSE_KEY" />
```

### 3. Next.js App Router Integration

```typescript
// app/posts/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const ogUrl = new URL('https://tinyog.cloud/api/og');
  ogUrl.searchParams.set('title', 'Building High-Performance Web Apps');
  ogUrl.searchParams.set('tag', 'NEXT.JS');
  ogUrl.searchParams.set('theme', 'bento');
  ogUrl.searchParams.set('key', process.env.TINYOG_LICENSE_KEY || '');

  return {
    title: 'Building High-Performance Web Apps',
    openGraph: {
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: 'Building High-Performance Web Apps',
        },
      ],
    },
  };
}
```

---

## 📖 API Reference Table

| Parameter | Type | Required | Default | Description |
|---|---|:---:|---|---|
| `title` | `string` | Optional | `"Default Title"` | The main headline displayed on the card (Auto line-wrapping, clamped to max 100 characters). |
| `tag` | `string` | Optional | `"Next.js"` | Category or section badge displayed on the top pill (Clamped to max 30 characters). |
| `theme` | `string` | Optional | `"dark"` | Visual design theme: `dark`, `minimal`, `gradient`, `terminal`, `notion`, `bento`, `cyberpunk`, or `sunset`. |
| `licenseKey` / `key` | `string` | Optional | `""` | Lemon Squeezy license key to unlock PRO themes and remove demo watermarks permanently. |

---

## 🎨 Available Themes

| Theme Key | Name | Access | Visual Style |
|---|---|:---:|---|
| `dark` | **Dark** | **Free** | Deep navy/zinc background with subtle matrix dots and border glow. |
| `minimal` | **Minimal** | **Free** | High-contrast editorial white background with sharp typography. |
| `gradient` | **Gradient** | **PRO** | Vibrant indigo-to-purple tech mesh gradient with frosted glass badge. |
| `terminal` | **Terminal** | **PRO** | macOS developer console with traffic light controls and monospace syntax. |
| `notion` | **Notion** | **PRO** | Warm cream background with minimal borders and editorial typography. |
| `bento` | **Bento** | **PRO** | Modern SaaS glassmorphic bento card with subtle ambient glow. |
| `cyberpunk` | **Cyberpunk** | **PRO** | High-tech neon cyan and magenta accents on obsidian/violet base. |
| `sunset` | **Sunset** | **PRO** | Deep orange and violet startup glow gradient with crisp typography. |

---

## 💎 Pricing & Lifetime Pass

TinyOG operates with a transparent, one-time payment pricing model:

### **Lifetime Pass — $29 (One-Time Payment)**
- ✅ **Permanent Watermark Removal**: Clean, unbranded cards for blogs and commercial products.
- ✅ **Full Access to All 6 PRO Themes**: Commercial rights to `gradient`, `terminal`, `notion`, `bento`, `cyberpunk`, and `sunset`.
- ✅ **Unlimited Worldwide Edge Calls**: Edge-cached CDN delivery across global PoPs with no request quotas.
- ✅ **No Recurring Subscriptions**: Single one-time purchase with free lifetime updates.
- ✅ **14-Day Money-Back Guarantee**: Full refund if you're not completely satisfied.

👉 [**Get Your Lifetime Pass on Lemon Squeezy ($29) →**](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3)

---

## 💻 Development & Local Setup

To run the interactive studio playground locally:

```bash
# Clone the repository
git clone https://github.com/Nenemttin/og-image-generator.git
cd og-image-generator

# Install dependencies
npm install

# Run development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Configuration (Optional)

Create a `.env.local` file in the project root:

```env
# Optional: Local bypass key for automated tests and development
PRO_LICENSE_KEY=your_test_license_key_here
```

---

## ⚖️ Legal & Compliance

TinyOG operates under transparent, user-first policies:

- **Official Website**: [https://tinyog.cloud](https://tinyog.cloud)
- **Terms of Service**: [https://tinyog.cloud/terms](https://tinyog.cloud/terms)
- **Privacy Policy**: [https://tinyog.cloud/privacy](https://tinyog.cloud/privacy)
- **Refund Policy**: [https://tinyog.cloud/refund](https://tinyog.cloud/refund) (14-Day Money-Back Guarantee)
- **Merchant of Record**: Payments and billing are securely processed by [Lemon Squeezy](https://www.lemonsqueezy.com).
- **Customer Support**: [support@tinyog.cloud](mailto:support@tinyog.cloud)

---

## 📄 License

The TinyOG web application and API service are provided under a commercial license with free tier usage. Commercial watermark removal and PRO themes are governed by the [TinyOG Lifetime Pass](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3).
