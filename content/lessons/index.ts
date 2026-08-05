import type { Lesson } from "@/types/content";
import { veritabaniNedir } from "./unite-1/1-1-veritabani-nedir";
import { selectIleSutunSecme } from "./unite-1/1-2-select-ile-sutun-secme";
import { whereIleFiltreleme } from "./unite-1/1-3-where-ile-filtreleme";
import { metinAramaVeAraliklar } from "./unite-1/1-4-metin-arama-ve-araliklar";
import { siralamaVeSinirlama } from "./unite-1/1-5-siralama-ve-sinirlama";
import { tekrarTurkiyeTuru } from "./unite-1/1-t-tekrar-turkiye-turu";
import { ifadelerVeHesaplamalar } from "./unite-2/2-1-ifadeler-ve-hesaplamalar";

export const TUM_DERSLER: Lesson[] = [
  veritabaniNedir,
  selectIleSutunSecme,
  whereIleFiltreleme,
  metinAramaVeAraliklar,
  siralamaVeSinirlama,
  tekrarTurkiyeTuru,
  ifadelerVeHesaplamalar,
];

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
