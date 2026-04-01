import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata() {
  const title = "Film-Atlas | Discover Movies, Classics & Hidden Gems";
  const description =
    "Explore trending movies, vintage classics, and curated collections on Film-Atlas. Discover, browse, and enjoy cinema from around the world.";

  const url = "https://filmatlas.online";
  const image = "https://filmatlas.online/og-home.jpg";

  return {
    title,
    description,
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
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Film-Atlas",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Film-Atlas – Discover Movies",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: "/filmAtlas.ico",
    },
  };
}

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
