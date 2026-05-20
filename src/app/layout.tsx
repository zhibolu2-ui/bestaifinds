import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, JetBrains_Mono, Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const GA_ID = "G-SEBVN0582L";
const ADSENSE_ID = "ca-pub-1615916133652088";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BestAIFinds – Free Online Tools for PDF, Image, Video & AI Writing",
    template: "%s | BestAIFinds",
  },
  description:
    "240+ free online tools: edit PDFs, convert images, compress videos, AI writing assistant and more. No registration required.",
  keywords: [
    "free online tools",
    "pdf editor",
    "image converter",
    "video compressor",
    "ai writer",
    "remove background",
  ],
  openGraph: {
    siteName: "BestAIFinds",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", outfit.variable, jetbrains.variable, "font-sans", geist.variable)}>
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
