import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Film Atlas | Discover Movies, Classics & Hidden Gems",
    template: "%s | Film Atlas",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "movies",
    "film database",
    "classic movies",
    "vintage cinema",
    "movie discovery",
    "film atlas",
    "watch movies",
    "public domain movies",
    "movie recommendations",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Film Atlas | Discover Movies, Classics & Hidden Gems",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Film Atlas",
    type: "website",
    images: [
      {
        url: "https://filmatlas.online/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Film Atlas - Discover Movies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Atlas | Discover Movies, Classics & Hidden Gems",
    description: DEFAULT_DESCRIPTION,
    images: ["https://filmatlas.online/og-home.jpg"],
  },
  icons: {
    icon: "/filmAtlas.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-black text-on-surface font-body">
        <Navbar />
        <div className="grow flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
