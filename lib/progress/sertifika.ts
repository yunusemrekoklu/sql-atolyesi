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

export interface IlerlemeKesri {
  tamamlanan: number;
  toplam: number;
}

/** Bir ünitedeki kaç dersin tamamlandığı — /sertifikalarim ilerleme çubuğu için. */
export function uniteIlerlemesi(
  uniteId: number,
  tumDersler: Lesson[],
  tamamlananDersler: string[],
): IlerlemeKesri {
  const uniteDersleri = tumDersler.filter((ders) => ders.uniteId === uniteId);
  const tamamlanan = uniteDersleri.filter((ders) => tamamlananDersler.includes(ders.slug)).length;
  return { tamamlanan, toplam: uniteDersleri.length };
}

/** Tüm pratik sorularından kaçının denendiği — /sertifikalarim ilerleme çubuğu için. */
export function pratikIlerlemesi(
  tumSetler: PracticeSet[],
  alistirmalar: Record<string, AlistirmaDurumu>,
): IlerlemeKesri {
  const tumSorular = tumSetler.flatMap((set) => set.sorular);
  const tamamlanan = tumSorular.filter((soru) => alistirmalar[soru.id] !== undefined).length;
  return { tamamlanan, toplam: tumSorular.length };
}

/** Tüm mülakat sorularından kaçının çözüldüğü — /sertifikalarim ilerleme çubuğu için. */
export function mulakatIlerlemesi(
  tumSorular: InterviewQuestion[],
  cozulenMulakatSorulari: string[],
): IlerlemeKesri {
  const tamamlanan = tumSorular.filter((soru) => cozulenMulakatSorulari.includes(soru.slug)).length;
  return { tamamlanan, toplam: tumSorular.length };
}
