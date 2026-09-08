import { ThemeId, ThemeOption, PresetItem } from "@/types";

export const CHECKOUT_URL =
  "https://tinyog.lemonsqueezy.com/checkout/buy/f3a4a41a-fcd9-4e51-aaf0-5014089676a3";

export const PRODUCTION_DOMAIN = "https://tinyog.cloud";

export const PRO_THEME_IDS: ThemeId[] = ["gradient", "terminal"];

export const THEMES: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    desc: "Classic navy & matrix grid",
    previewClass: "bg-zinc-900 border-zinc-700",
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
    id: "minimal",
    name: "Minimal",
    desc: "Clean editorial white typography",
    previewClass: "bg-zinc-100 border-zinc-300",
    isPro: false,
  },
  {
    id: "terminal",
    name: "Terminal",
    desc: "macOS developer console",
    previewClass: "bg-zinc-950 border-zinc-700",
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
    title: "Zero-Config Open Graph Image Generation at the Edge",
    tag: "VERCEL / OG",
    theme: "gradient",
  },
  {
    title: "Clean Code Architecture for Modern Engineering Teams",
    tag: "GUIDE",
    theme: "minimal",
  },
  {
    title: "git commit -m 'Ship TinyOG v1.0 to Production'",
    tag: "CLI",
    theme: "terminal",
  },
];
