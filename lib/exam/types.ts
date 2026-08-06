export type SinavModu = "vize" | "final" | "ozel";

export interface SinavAyarlari {
  mod: SinavModu;
  soruSayisi: number;
  dakika: number;
  /** sadece mod: 'ozel' için — dahil edilecek ünite id'leri (boşsa tümü). */
  uniteIdleri?: number[];
}

export interface SinavOturumu {
  mod: SinavModu;
  soruIdleri: string[];
  cevaplar: Record<string, number>;
  baslangicZamani: number;
  bitisZamani: number;
}

export interface SinavSonucu {
  id: string;
  mod: SinavModu;
  tarih: string;
  dogruSayisi: number;
  toplamSoru: number;
  konuKirilimi: Record<string, { dogru: number; toplam: number }>;
  yanlisSoruIdleri: string[];
}
