import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

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
