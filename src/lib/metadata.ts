import type { Metadata } from "next";

export const SITE_NAME = "Film Atlas";
export const SITE_URL = "https://filmatlas.online";
export const DEFAULT_DESCRIPTION =
  "Explore classic vintage movies and curated collections on Film Atlas. Discover, browse, and enjoy cinema from around the world.";
export const DEFAULT_OG_IMAGE = "https://filmatlas.online/og-home.jpg";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
};

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: MetadataInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, SITE_URL).toString();
  const openGraphTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Discover Movies, Classics & Hidden Gems`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Discover Movies`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
