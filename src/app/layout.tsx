import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";

import { Atmosphere } from "@/components/layout/Atmosphere";
import { BootCurtain } from "@/components/layout/BootCurtain";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { jsonLdApp, jsonLdOrg, jsonLdWebsite } from "@/lib/seo";
import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.titleDefault,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author, url: site.github }],
  creator: site.author,
  publisher: site.name,
  keywords: [...site.keywords],
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  // Canonicals live on each route. A layout-level `/` canonical would
  // collapse every child into the homepage in the index.
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.titleDefault,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.titleDefault,
    description: site.description,
  },
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0b" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Atmosphere />
        <BootCurtain />
        <JsonLd data={jsonLdOrg()} />
        <JsonLd data={jsonLdWebsite()} />
        <JsonLd data={jsonLdApp()} />
        <a
          href="#main"
          className="focus:bg-fg focus:text-bg sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative z-10 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
