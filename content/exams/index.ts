import type { ExamQuestion } from "@/types/content";
import { unite1Sinavi } from "./unite-1";
import { unite2Sinavi } from "./unite-2";
import { unite3Sinavi } from "./unite-3";
import { unite4Sinavi } from "./unite-4";
import { unite5Sinavi } from "./unite-5";

export const UNITE_SINAVLARI: Record<number, ExamQuestion[]> = {
  1: unite1Sinavi,
  2: unite2Sinavi,
  3: unite3Sinavi,
  4: unite4Sinavi,
  5: unite5Sinavi,
};

export const TUM_SINAV_SORULARI: ExamQuestion[] = [
  ...unite1Sinavi,
  ...unite2Sinavi,
  ...unite3Sinavi,
  ...unite4Sinavi,
  ...unite5Sinavi,
];

export function getUniteSinavi(uniteId: number): ExamQuestion[] | undefined {
  return UNITE_SINAVLARI[uniteId];
}
