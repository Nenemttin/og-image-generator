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
  metadataBase: new URL("https://tinyog.cloud"),
  alternates: {
    canonical: "https://tinyog.cloud",
  },
  title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
  description:
    "Generate high-converting, dynamic Open Graph images at the Edge with a single URL. Zero config, pure speed.",
  openGraph: {
    title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
    description:
      "Generate high-converting, dynamic Open Graph images at the Edge with a single URL. Zero config, pure speed.",
    url: "https://tinyog.cloud",
    siteName: "TinyOG",
    images: [
      {
        url: "https://tinyog.cloud/api/og?title=Dynamic+Social+Cards+with+One+URL&tag=DEVELOPER+TOOL&theme=gradient",
        width: 1200,
        height: 630,
        alt: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyOG — Lightning-fast Dynamic Social Cards with One URL",
    description:
      "Generate high-converting, dynamic Open Graph images at the Edge with a single URL. Zero config, pure speed.",
    images: [
      "https://tinyog.cloud/api/og?title=Dynamic+Social+Cards+with+One+URL&tag=DEVELOPER+TOOL&theme=gradient",
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
