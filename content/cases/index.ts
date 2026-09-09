import type { Vaka, VakaSeviyesi } from "@/types/content";
import { ortakBuzdolabiDavasi } from "./ortak-buzdolabi-davasi";
import { sahteOySkandali } from "./sahte-oy-skandali";
import { finalSinaviSizintisi } from "./final-sinavi-sizintisi";
import { sahteTakipciSkandali } from "./sahte-takipci-skandali";
import { kuyumcuSoygunu } from "./kuyumcu-soygunu";
import { kulupKasasiAcigi } from "./kulup-kasasi-acigi";

export const TUM_VAKALAR: Vaka[] = [
  ortakBuzdolabiDavasi,
  sahteOySkandali,
  finalSinaviSizintisi,
  sahteTakipciSkandali,
  kuyumcuSoygunu,
  kulupKasasiAcigi,
];

export function getVakaBySlug(slug: string): Vaka | undefined {
  return TUM_VAKALAR.find((v) => v.slug === slug);
}

export function getVakalarBySeviye(seviye: VakaSeviyesi): Vaka[] {
  return TUM_VAKALAR.filter((v) => v.seviye === seviye);
}
