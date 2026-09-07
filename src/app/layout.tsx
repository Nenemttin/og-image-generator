import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://og-image-generator-wine-nine.vercel.app"),
  title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
  description:
    "Zero-config Open Graph image generator for developers and bloggers. Preview in real-time and drop dynamic URLs straight into your HTML meta tags.",
  openGraph: {
    title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
    description:
      "Zero-config Open Graph image generator for developers and bloggers. Preview in real-time and drop dynamic URLs straight into your HTML meta tags.",
    url: "https://og-image-generator-wine-nine.vercel.app",
    siteName: "TinyOG",
    images: [
      {
        url: "https://og-image-generator-wine-nine.vercel.app/api/og?title=TinyOG&tag=TOOL",
        width: 1200,
        height: 630,
        alt: "TinyOG Preview Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
    description:
      "Zero-config Open Graph image generator for developers and bloggers. Preview in real-time and drop dynamic URLs straight into your HTML meta tags.",
    images: [
      "https://og-image-generator-wine-nine.vercel.app/api/og?title=TinyOG&tag=TOOL",
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
