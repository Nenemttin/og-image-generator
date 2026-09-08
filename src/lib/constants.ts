import { ThemeId, ThemeOption, PresetItem } from "@/types";

export const CHECKOUT_URL =
  "https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3";

export const PRODUCTION_DOMAIN = "https://tinyog.cloud";

export const PRO_THEME_IDS: ThemeId[] = [
  "gradient",
  "terminal",
  "notion",
  "bento",
  "cyberpunk",
  "sunset",
];

export const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    desc: "Classic navy & matrix grid",
    previewClass: "bg-zinc-900 border-zinc-700",
    isPro: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean editorial white typography",
    previewClass: "bg-zinc-100 border-zinc-300",
    isPro: false,
  },
  {
    id: "gradient",
    name: "Gradient",
    desc: "Vibrant tech mesh gradient",
    previewClass:
      "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-zinc-600",
    isPro: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "macOS developer console",
    previewClass: "bg-zinc-950 border-zinc-700",
    isPro: true,
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Warm cream & clean typography",
    previewClass: "bg-[#fbfbfa] border-[#e3e2de]",
    isPro: true,
  },
  {
    id: "bento",
    name: "Bento",
    desc: "Modern SaaS glassmorphic cards",
    previewClass:
      "bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-700",
    isPro: true,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    desc: "Neon cyan & magenta high-tech",
    previewClass:
      "bg-gradient-to-r from-[#0a0414] to-[#120726] border-cyan-400",
    isPro: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    desc: "Deep orange & violet startup glow",
    previewClass:
      "bg-gradient-to-br from-amber-600 via-rose-600 to-indigo-900 border-rose-500",
    isPro: true,
  },
];

export const PRESETS: PresetItem[] = [
  {
    title: "Building High-Performance Web Apps with Next.js 15",
    tag: "FRONTEND",
    theme: "dark",
  },
  {
    title: "Clean Code Architecture for Modern Engineering Teams",
    tag: "GUIDE",
    theme: "minimal",
  },
  {
    title: "Zero-Config Open Graph Image Generation at the Edge",
    tag: "VERCEL / OG",
    theme: "gradient",
  },
  {
    title: "git commit -m 'Ship TinyOG v1.1 to Production'",
    tag: "CLI",
    theme: "terminal",
  },
  {
    title: "The Complete Engineering Handbook & Documentation",
    tag: "DOCS",
    theme: "notion",
  },
  {
    title: "Modular Component Systems in Modern SaaS Architecture",
    tag: "SAAS",
    theme: "bento",
  },
  {
    title: "Building Autonomous AI Agents with Edge Computing",
    tag: "AI / WEB3",
    theme: "cyberpunk",
  },
  {
    title: "From Zero to $100K MRR: The Solo Founder Blueprint",
    tag: "GROWTH",
    theme: "sunset",
  },
];
