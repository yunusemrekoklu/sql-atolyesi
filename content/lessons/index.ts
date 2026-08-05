import type { Lesson } from "@/types/content";
import { ifadelerVeHesaplamalar } from "./unite-2/2-1-ifadeler-ve-hesaplamalar";

export const TUM_DERSLER: Lesson[] = [ifadelerVeHesaplamalar];

export function getDersBySlug(slug: string): Lesson | undefined {
  return TUM_DERSLER.find((ders) => ders.slug === slug);
}

export function getOncekiSonraki(slug: string): { onceki: Lesson | null; sonraki: Lesson | null } {
  const index = TUM_DERSLER.findIndex((ders) => ders.slug === slug);
  if (index === -1) return { onceki: null, sonraki: null };
  return {
    onceki: index > 0 ? TUM_DERSLER[index - 1] : null,
    sonraki: index < TUM_DERSLER.length - 1 ? TUM_DERSLER[index + 1] : null,
  };
}
