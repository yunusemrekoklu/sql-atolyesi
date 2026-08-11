export type AlistirmaDurumu = "cozuldu" | "cozumGoruldu";

export interface KazanilanSertifika {
  /** Uzak modda Supabase certificates.id (gerçek UUID, /certificate/[id] için); yerel modda üretilen id ile aynı. */
  id: string;
  /** Sertifika üzerinde gösterilen "SQLCODEX-..." biçimli okunabilir kod. */
  displayCode: string;
  tarih: string; // ISO YYYY-MM-DD
}

export interface IlerlemeVerisi {
  surum: 1;
  alistirmalar: Record<string, AlistirmaDurumu>;
  tamamlananDersler: string[];
  miniQuizSonuclari: Record<string, { dogruSayisi: number; toplamSoru: number }>;
  cozulenMulakatSorulari: string[];
  kullaniciAdi: string | null;
  kazanilanSertifikalar: Record<string, KazanilanSertifika>;
  /** Ünite testi (sınav) sonuçları — anahtar unite id'si. miniQuizSonuclari'ndan
   * bilinçli olarak ayrı (bkz. lib/exam/remote.ts, unit_test_results tablosu). */
  uniteSinavSonuclari: Record<number, { dogruSayisi: number; toplamSoru: number }>;
  /** Sadece Supabase'den okunur, sunucu tarafında puan_events'ten hesaplanır — misafir modunda her zaman 0. */
  puan: number;
}

export const BOS_ILERLEME: IlerlemeVerisi = {
  surum: 1,
  alistirmalar: {},
  tamamlananDersler: [],
  miniQuizSonuclari: {},
  cozulenMulakatSorulari: [],
  kullaniciAdi: null,
  kazanilanSertifikalar: {},
  uniteSinavSonuclari: {},
  puan: 0,
};

/**
 * "Çözüme bakan çözdü sayılmaz" kuralı: `cozuldu` bir kez dürüstçe
 * kazanıldıysa asla düşürülmez; `cozumGoruldu` bir kez ayarlandıysa
 * (kullanıcı çözümü gördüyse) artık `cozuldu`'ya yükseltilemez — karne
 * dürüst kalır.
 */
export function alistirmaDurumunuBirlestir(
  mevcut: AlistirmaDurumu | undefined,
  yeni: AlistirmaDurumu,
): AlistirmaDurumu {
  if (mevcut === "cozuldu") return "cozuldu";
  if (mevcut === "cozumGoruldu") return "cozumGoruldu";
  return yeni;
}
