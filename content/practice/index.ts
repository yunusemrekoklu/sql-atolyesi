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
