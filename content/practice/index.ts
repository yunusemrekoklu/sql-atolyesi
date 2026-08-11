import type { PracticeSet } from "@/types/content";
import { selectTemelleri } from "./select-temelleri";
import { filtreleme } from "./filtreleme";
import { toplulastirmaGroupBy } from "./toplulastirma-group-by";
import { joinler } from "./joinler";
import { altSorgular } from "./alt-sorgular";
import { pencereFonksiyonlariPratik } from "./pencere-fonksiyonlari";
import { dmlDdl } from "./dml-ddl";
import { zorluKarisik } from "./zorlu-karisik";

export const TUM_PRATIK_SETLERI: PracticeSet[] = [
  selectTemelleri,
  filtreleme,
  toplulastirmaGroupBy,
  joinler,
  altSorgular,
  pencereFonksiyonlariPratik,
  dmlDdl,
  zorluKarisik,
];

export function getPratikSetBySlug(slug: string): PracticeSet | undefined {
  return TUM_PRATIK_SETLERI.find((set) => set.slug === slug);
}

export function getOncekiSonrakiPratik(slug: string): { onceki: PracticeSet | null; sonraki: PracticeSet | null } {
  const index = TUM_PRATIK_SETLERI.findIndex((set) => set.slug === slug);
  if (index === -1) return { onceki: null, sonraki: null };
  return {
    onceki: index > 0 ? TUM_PRATIK_SETLERI[index - 1] : null,
    sonraki: index < TUM_PRATIK_SETLERI.length - 1 ? TUM_PRATIK_SETLERI[index + 1] : null,
  };
}
