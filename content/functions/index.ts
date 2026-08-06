import type { FunctionRef } from "@/types/content";
import { metinFonksiyonlari } from "./metin";
import { sayisalFonksiyonlar } from "./sayisal";
import { tarihFonksiyonlari } from "./tarih";
import { nullKosulFonksiyonlari } from "./null-kosul";
import { toplulastirmaFonksiyonlari } from "./toplulastirma";

export const TUM_FONKSIYONLAR: FunctionRef[] = [
  ...metinFonksiyonlari,
  ...sayisalFonksiyonlar,
  ...tarihFonksiyonlari,
  ...nullKosulFonksiyonlari,
  ...toplulastirmaFonksiyonlari,
];

export function getFonksiyonBySlug(slug: string): FunctionRef | undefined {
  return TUM_FONKSIYONLAR.find((fn) => fn.slug === slug);
}
