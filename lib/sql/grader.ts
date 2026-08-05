import type { QueryExecResult, SqlValue } from "sql.js";
import type { TabloAnlikGorunum } from "./schema";

export interface SonucGirdisi {
  mod: "sonuc";
  kullanici: QueryExecResult | null;
  cozum: QueryExecResult;
  /** true ise satır sırası da doğru olmalı (varsayılan: önemsiz, multiset karşılaştırma). */
  siralamaOnemli?: boolean;
  /** true ise sütun adları da (case-insensitive) eşleşmeli (varsayılan: yalnızca sütun sayısı/değerler). */
  kolonAdiOnemli?: boolean;
}

export interface TabloDurumuGirdisi {
  mod: "tabloDurumu";
  kullanici: TabloAnlikGorunum[];
  cozum: TabloAnlikGorunum[];
}

export type GradeGirdisi = SonucGirdisi | TabloDurumuGirdisi;

export interface GradeSonucu {
  dogru: boolean;
  mesaj: string;
}

function sayiyaCevrilebilirMi(deger: string): boolean {
  return deger.trim() !== "" && !Number.isNaN(Number(deger));
}

function hucreEsit(a: SqlValue, b: SqlValue): boolean {
  if (a === null || b === null) return a === b;

  const aSayi = typeof a === "number" ? a : typeof a === "string" && sayiyaCevrilebilirMi(a) ? Number(a) : null;
  const bSayi = typeof b === "number" ? b : typeof b === "string" && sayiyaCevrilebilirMi(b) ? Number(b) : null;
  if (aSayi !== null && bSayi !== null) {
    return Math.abs(aSayi - bSayi) < 1e-9;
  }

  return String(a) === String(b);
}

function satirEsit(a: SqlValue[], b: SqlValue[]): boolean {
  return a.length === b.length && a.every((deger, i) => hucreEsit(deger, b[i]));
}

function siraliEsit(a: SqlValue[][], b: SqlValue[][]): boolean {
  return a.length === b.length && a.every((satir, i) => satirEsit(satir, b[i]));
}

function multisetEsit(a: SqlValue[][], b: SqlValue[][]): boolean {
  if (a.length !== b.length) return false;
  const kalan = [...b];
  for (const satirA of a) {
    const idx = kalan.findIndex((satirB) => satirEsit(satirA, satirB));
    if (idx === -1) return false;
    kalan.splice(idx, 1);
  }
  return true;
}

function degerlendirSonuc(girdi: SonucGirdisi): GradeSonucu {
  const { kullanici, cozum, siralamaOnemli = false, kolonAdiOnemli = false } = girdi;

  if (!kullanici) {
    return { dogru: false, mesaj: "Sorgun herhangi bir sonuç döndürmedi." };
  }

  if (kullanici.columns.length !== cozum.columns.length) {
    return {
      dogru: false,
      mesaj: `Sütun sayısı farklı: sorgun ${kullanici.columns.length} sütun döndürdü, beklenen ${cozum.columns.length}.`,
    };
  }

  if (kolonAdiOnemli) {
    const kullaniciKolonlari = kullanici.columns.map((k) => k.toLowerCase());
    const cozumKolonlari = cozum.columns.map((k) => k.toLowerCase());
    const eslesmiyor = cozumKolonlari.some((ad, i) => ad !== kullaniciKolonlari[i]);
    if (eslesmiyor) {
      return {
        dogru: false,
        mesaj: `Sütun adları beklenenle eşleşmiyor. Beklenen sütunlar: ${cozum.columns.join(", ")}.`,
      };
    }
  }

  if (kullanici.values.length !== cozum.values.length) {
    return {
      dogru: false,
      mesaj: `Satır sayısı farklı: sorgun ${kullanici.values.length} satır döndürdü, beklenen ${cozum.values.length}.`,
    };
  }

  if (siraliEsit(kullanici.values, cozum.values)) {
    return { dogru: true, mesaj: "Doğru!" };
  }

  if (multisetEsit(kullanici.values, cozum.values)) {
    if (siralamaOnemli) {
      return {
        dogru: false,
        mesaj: "İçerik doğru ama satır sırası farklı. Bu alıştırmada sıralama da önemli — ORDER BY'ını kontrol et.",
      };
    }
    return { dogru: true, mesaj: "Doğru!" };
  }

  return { dogru: false, mesaj: "Sonuç beklenenle eşleşmiyor. Değerleri kontrol et." };
}

function degerlendirTabloDurumu(girdi: TabloDurumuGirdisi): GradeSonucu {
  const { kullanici, cozum } = girdi;

  if (kullanici.length !== cozum.length) {
    return {
      dogru: false,
      mesaj: `Veritabanındaki tablo sayısı farklı: ${kullanici.length} tablo var, beklenen ${cozum.length}.`,
    };
  }

  for (const cozumTablo of cozum) {
    const kullaniciTablo = kullanici.find((t) => t.ad === cozumTablo.ad);
    if (!kullaniciTablo) {
      return { dogru: false, mesaj: `"${cozumTablo.ad}" adında bir tablo bulunamadı.` };
    }
    if (kullaniciTablo.kolonlar.length !== cozumTablo.kolonlar.length) {
      return { dogru: false, mesaj: `"${cozumTablo.ad}" tablosunun sütun sayısı beklenenle eşleşmiyor.` };
    }
    if (kullaniciTablo.satirlar.length !== cozumTablo.satirlar.length) {
      return {
        dogru: false,
        mesaj: `"${cozumTablo.ad}" tablosundaki satır sayısı farklı: ${kullaniciTablo.satirlar.length} satır var, beklenen ${cozumTablo.satirlar.length}.`,
      };
    }
    if (!multisetEsit(kullaniciTablo.satirlar, cozumTablo.satirlar)) {
      return { dogru: false, mesaj: `"${cozumTablo.ad}" tablosunun içeriği beklenenle eşleşmiyor.` };
    }
  }

  return { dogru: true, mesaj: "Doğru!" };
}

/**
 * Saf autograder — hiçbir I/O yapmaz, sadece verilen sonuç/durum verilerini
 * karşılaştırır. sql.js sorgularının çalıştırılması ve DB durumunun
 * okunması çağıran tarafın (bkz. lib/sql/db.ts, lib/sql/schema.ts)
 * sorumluluğundadır — bu ayrım grader'ı vitest ile wasm'a hiç dokunmadan
 * test edilebilir kılar.
 */
export function degerlendir(girdi: GradeGirdisi): GradeSonucu {
  return girdi.mod === "sonuc" ? degerlendirSonuc(girdi) : degerlendirTabloDurumu(girdi);
}
