<div align="center">

# TinyOG — Lightning-fast Dynamic Social Cards with One URL

**Zero-config Open Graph card generator for developers, creators, and modern engineering teams.**

[![Website](https://img.shields.io/badge/Production-tinyog.cloud-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://tinyog.cloud)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Edge Runtime](https://img.shields.io/badge/Edge_Runtime-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary_%2F_Lifetime_Pass-8b5cf6?style=for-the-badge)](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3)
[![Status](https://img.shields.io/badge/Status-Live-10B981?style=for-the-badge)](https://tinyog.cloud)

<br />

[**Launch Studio**](https://tinyog.cloud) • [**Get Lifetime Pass ($29)**](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3) • [**API Documentation**](#-quick-integration) • [**Themes & Pro**](#-available-themes--pro-features) • [**Legal & Policies**](#-legal--compliance)

</div>

---

## ⚡ Overview & Core Value

Stop opening design software, exporting heavy PNGs, and manually uploading static `1200x630` images for every blog post, tutorial, product changelog, or docs page.

**TinyOG** is an ultra-lightweight, zero-config Open Graph card engine. It synthesizes pixel-perfect, high-DPI social cards on-the-fly via a single URL endpoint. Plug the generated endpoint directly into your HTML `<meta>` tags, and your Twitter Cards, Facebook previews, LinkedIn cards, and Slack/Discord unfurls will always reflect your latest content in real time.

### Why TinyOG?
- **Zero Configuration**: No Figma templates, headless Chrome instances, or fragile Puppeteer setups required.
- **Edge-Cached Sub-50ms Speed**: Powered by Next.js Edge Runtime and `@vercel/og` (Satori), with global CDN distribution and aggressive `Cache-Control` optimization.
- **Interactive Studio Playground**: Real-time preview with macOS window framing, instant live debounce rendering, character counter guards, and 1-click HTML meta tag export.
- **Framework Agnostic**: Drops seamlessly into Next.js, Astro, Ghost, Hugo, Gatsby, Nuxt, SvelteKit, WordPress, or plain HTML.
- **Developer-First Aesthetics**: High-contrast, typography-focused designs crafted for technical blogs, developer docs, and SaaS products.

---

## 🚀 Quick Integration

Generating dynamic cards is as simple as making an HTTP request to `https://tinyog.cloud/api/og`.

### 1. HTML `<meta>` Tag (Production Ready)

Drop this single line into your `<head>` section:

```html
<meta property="og:image" content="https://tinyog.cloud/api/og?title=Your+Title&tag=TUTORIAL&theme=gradient" />
```

### 2. Comprehensive Social Preview Setup

For complete support across Twitter/X, LinkedIn, Discord, and Slack:

```html
<!-- Open Graph / Facebook / LinkedIn / Discord -->
<meta property="og:type" content="website" />
<meta property="og:title" content="How to Build Modern Web Apps at the Edge" />
<meta property="og:image" content="https://tinyog.cloud/api/og?title=How+to+Build+Modern+Web+Apps+at+the+Edge&tag=ARCHITECTURE&theme=terminal&key=YOUR_PRO_LICENSE_KEY" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="How to Build Modern Web Apps at the Edge" />
<meta name="twitter:image" content="https://tinyog.cloud/api/og?title=How+to+Build+Modern+Web+Apps+at+the+Edge&tag=ARCHITECTURE&theme=terminal&key=YOUR_PRO_LICENSE_KEY" />
```

### 3. Next.js App Router Integration

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const ogUrl = new URL('https://tinyog.cloud/api/og');
  ogUrl.searchParams.set('title', 'Building High-Performance Web Apps');
  ogUrl.searchParams.set('tag', 'NEXT.JS');
  ogUrl.searchParams.set('theme', 'gradient');
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

## 📖 API Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|:---:|---|---|
| `title` | `string` | Optional | `"Default Title"` | Card headline. Automatic line wrapping with defense clamp (up to 100 characters). |
| `tag` | `string` | Optional | `"Next.js"` | Category / section badge displayed in the top pill (up to 30 characters). |
| `theme` | `string` | Optional | `"dark"` | Visual design theme: `dark`, `minimal`, `gradient`, `terminal`, `notion`, `bento`, `cyberpunk`, `sunset`. |
| `key` / `licenseKey` | `string` | Optional | `""` | Lemon Squeezy license key to remove the watermark and unlock commercial PRO themes. |

---

## 🎨 Available Themes & PRO Features

TinyOG provides 8 curated visual themes engineered for technical readability:

| Theme Key | Name | Access | Visual Style |
|---|---|:---:|---|
| `dark` | **Dark** | **Free** | Deep navy/zinc background with subtle matrix dots and border glow. |
| `minimal` | **Minimal** | **Free** | High-contrast editorial white background with sharp typography. |
| `gradient` | **Gradient** | **PRO** | Vibrant indigo-to-purple tech mesh gradient with frosted glass badge. |
| `terminal` | **Terminal** | **PRO** | macOS developer console with traffic light controls and monospace syntax. |
| `notion` | **Notion** | **PRO** | Warm cream background with minimal borders and editorial typography. |
| `bento` | **Bento** | **PRO** | Modern SaaS glassmorphism bento card with subtle ambient glow. |
| `cyberpunk` | **Cyberpunk** | **PRO** | High-tech neon cyan and magenta accents on obsidian/violet base. |
| `sunset` | **Sunset** | **PRO** | Deep orange and violet startup glow gradient with crisp typography. |

### 💎 Lifetime Pass Benefits ($29 One-Time)
- **Permanent Watermark Removal**: Clean, unbranded cards for your blogs and commercial products.
- **Full Access to All 6 PRO Themes**: Commercial rights to use `gradient`, `terminal`, `notion`, `bento`, `cyberpunk`, and `sunset`.
- **Unlimited Worldwide Edge Calls**: Edge-cached CDN delivery across global PoPs.
- **No Recurring Subscriptions**: Single one-time purchase with free lifetime updates.
- **14-Day Money-Back Guarantee**: Full refund if you're not completely satisfied.

👉 [**Get Your Lifetime Pass on Lemon Squeezy ($29) →**](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3)

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router, Edge Runtime)
- **Image Generation**: [`@vercel/og`](https://vercel.com/docs/functions/og-image-generation) (powered by Satori & Resvg)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Typography**: Pretendard Variable Font (edge-cached in-memory binary)
- **Billing & Licensing**: [Lemon Squeezy](https://www.lemonsqueezy.com/) (Merchant of Record & License Engine)
- **Edge CDN Hosting**: [Vercel](https://vercel.com/) Worldwide Edge Network (`tinyog.cloud`)

---

## ⚖️ Legal & Compliance

TinyOG operates under transparent, user-first policies:

- **Official Website**: [https://tinyog.cloud](https://tinyog.cloud)
- **Terms of Service**: [https://tinyog.cloud/terms](https://tinyog.cloud/terms)
- **Privacy Policy**: [https://tinyog.cloud/privacy](https://tinyog.cloud/privacy)
- **Refund Policy**: [https://tinyog.cloud/refund](https://tinyog.cloud/refund) (14-Day Refund Guarantee)
- **Merchant of Record**: Payments and billing are securely handled by [Lemon Squeezy](https://www.lemonsqueezy.com).
- **Customer Support**: [support@tinyog.cloud](mailto:support@tinyog.cloud)

---

## 💻 Local Development

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
# Optional: Local bypass key for local development and test verification
PRO_LICENSE_KEY=your_test_license_key_here
```

---

## 📄 License

The TinyOG web application and API service are provided under a commercial license with free tier usage. Commercial watermark removal and PRO themes are governed by the [TinyOG Lifetime Pass](https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3).
