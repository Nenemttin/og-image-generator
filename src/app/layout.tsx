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
  title: "OG Image Maker - 1초 만에 만드는 소셜 썸네일",
  description: "개발자와 블로거를 위한 동적 오픈그래프(OG) 썸네일 자동 생성기",
  openGraph: {
    title: "OG Image Maker - 1초 만에 만드는 소셜 썸네일",
    description: "개발자와 블로거를 위한 동적 오픈그래프(OG) 썸네일 자동 생성기",
    url: "https://og-image-generator-wine-nine.vercel.app",
    siteName: "OG Image Maker",
    images: [
      {
        url: "https://og-image-generator-wine-nine.vercel.app/api/og?title=OG+Image+Maker&tag=TOOL",
        width: 1200,
        height: 630,
        alt: "OG Image Maker 미리보기 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Image Maker - 1초 만에 만드는 소셜 썸네일",
    description: "개발자와 블로거를 위한 동적 오픈그래프(OG) 썸네일 자동 생성기",
    images: [
      "https://og-image-generator-wine-nine.vercel.app/api/og?title=OG+Image+Maker&tag=TOOL",
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
