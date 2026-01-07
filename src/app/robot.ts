import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/search/",
        ],
      },
    ],
    sitemap: "https://filmatlas.online/sitemap.xml",
  };
}
