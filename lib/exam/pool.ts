import type { ExamQuestion } from "@/types/content";
import type { SinavAyarlari, SinavModu, SinavSonucu } from "./types";

function karistir<T>(dizi: T[]): T[] {
  const kopya = [...dizi];
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
  }
  return kopya;
}

/**
 * Seçilen moda göre soru havuzunu filtreler, karıştırır ve istenen sayıda
 * soruya keser. Vize: Ünite 1-3, Final: tümü, Özel: kullanıcının seçtiği
 * üniteler (boşsa tümü).
 */
export function soruHavuzuOlustur(tumSorular: ExamQuestion[], ayarlar: SinavAyarlari): ExamQuestion[] {
  let havuz: ExamQuestion[];
  if (ayarlar.mod === "vize") {
    havuz = tumSorular.filter((s) => s.uniteId <= 3);
  } else if (ayarlar.mod === "final") {
    havuz = tumSorular;
  } else {
    const secili = ayarlar.uniteIdleri && ayarlar.uniteIdleri.length > 0 ? ayarlar.uniteIdleri : [1, 2, 3, 4, 5];
    havuz = tumSorular.filter((s) => secili.includes(s.uniteId));
  }
  return karistir(havuz).slice(0, Math.min(ayarlar.soruSayisi, havuz.length));
}

export function sorulariGetir(idler: string[], tumSorular: ExamQuestion[]): ExamQuestion[] {
  const harita = new Map(tumSorular.map((s) => [s.id, s]));
  return idler.map((id) => harita.get(id)).filter((s): s is ExamQuestion => s !== undefined);
}

/**
 * Saf değerlendirme fonksiyonu — hiçbir I/O yapmaz, verilen soru listesini
 * ve kullanıcı cevaplarını karşılaştırıp karne verisini üretir.
 */
export function sinaviDegerlendir(
  mod: SinavModu,
  sorular: ExamQuestion[],
  cevaplar: Record<string, number>,
): SinavSonucu {
  let dogruSayisi = 0;
  const yanlisSoruIdleri: string[] = [];
  const konuKirilimi: Record<string, { dogru: number; toplam: number }> = {};

  for (const soru of sorular) {
    if (!konuKirilimi[soru.konu]) konuKirilimi[soru.konu] = { dogru: 0, toplam: 0 };
    const kirilim = konuKirilimi[soru.konu];
    kirilim.toplam++;

    if (cevaplar[soru.id] === soru.dogruIndex) {
      dogruSayisi++;
      kirilim.dogru++;
    } else {
      yanlisSoruIdleri.push(soru.id);
    }
  }

  return {
    id: `sinav-${Date.now()}`,
    mod,
    tarih: new Date().toISOString(),
    dogruSayisi,
    toplamSoru: sorular.length,
    konuKirilimi,
    yanlisSoruIdleri,
  };
}
