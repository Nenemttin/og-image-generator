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
  title: "TinyOG - 1초 만에 만드는 초경량 동적 OG 썸네일",
  description: "블로거와 개발자를 위한 Zero-config 오픈그래프 카드 자동 생성기",
  openGraph: {
    title: "TinyOG - 1초 만에 만드는 초경량 동적 OG 썸네일",
    description: "블로거와 개발자를 위한 Zero-config 오픈그래프 카드 자동 생성기",
    url: "https://og-image-generator-wine-nine.vercel.app",
    siteName: "TinyOG",
    images: [
      {
        url: "https://og-image-generator-wine-nine.vercel.app/api/og?title=TinyOG&tag=TOOL",
        width: 1200,
        height: 630,
        alt: "TinyOG 미리보기 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyOG - 1초 만에 만드는 초경량 동적 OG 썸네일",
    description: "블로거와 개발자를 위한 Zero-config 오픈그래프 카드 자동 생성기",
    images: [
      "https://og-image-generator-wine-nine.vercel.app/api/og?title=TinyOG&tag=TOOL",
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
