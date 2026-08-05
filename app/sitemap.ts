import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://sqlatolyesi.vercel.app";

const STATIC_ROUTES = [
  "",
  "/ogren",
  "/pratik",
  "/sinav",
  "/sinav/simulasyon",
  "/mulakat",
  "/fonksiyonlar",
  "/playground",
  "/hakkinda",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
