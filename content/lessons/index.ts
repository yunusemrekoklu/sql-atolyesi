import type { Lesson } from "@/types/content";
import { ifadelerVeHesaplamalar } from "./unite-2/2-1-ifadeler-ve-hesaplamalar";

export const TUM_DERSLER: Lesson[] = [ifadelerVeHesaplamalar];

export function getDersBySlug(slug: string): Lesson | undefined {
  return TUM_DERSLER.find((ders) => ders.slug === slug);
}
