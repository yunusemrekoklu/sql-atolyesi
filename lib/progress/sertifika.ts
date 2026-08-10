import type { InterviewQuestion, Lesson, PracticeSet } from "@/types/content";
import type { AlistirmaDurumu } from "./types";

/**
 * Bir ünitedeki tüm derslerin tamamlanmış (tamamlananDersler'de) olup
 * olmadığını hesaplar — ünite tamamlama sertifikası hak edişi için.
 */
export function uniteTamamlandiMi(
  uniteId: number,
  tumDersler: Lesson[],
  tamamlananDersler: string[],
): boolean {
  const uniteDersleri = tumDersler.filter((ders) => ders.uniteId === uniteId);
  return uniteDersleri.every((ders) => tamamlananDersler.includes(ders.slug));
}

/**
 * Tüm pratik setlerindeki tüm soruların en az "denenmiş" (çözüldü ya da
 * çözüm görüldü) olup olmadığını hesaplar — Pratik tamamlama sertifikası
 * hak edişi için.
 */
export function pratikTamamlandiMi(
  tumSetler: PracticeSet[],
  alistirmalar: Record<string, AlistirmaDurumu>,
): boolean {
  return tumSetler.every((set) => set.sorular.every((soru) => alistirmalar[soru.id] !== undefined));
}

/**
 * Tüm mülakat sorularının çözülmüş olup olmadığını hesaplar — Mülakat
 * tamamlama sertifikası hak edişi için.
 */
export function mulakatTamamlandiMi(
  tumSorular: InterviewQuestion[],
  cozulenMulakatSorulari: string[],
): boolean {
  return tumSorular.every((soru) => cozulenMulakatSorulari.includes(soru.slug));
}
