import type { SinavOturumu, SinavSonucu } from "./types";

/**
 * Aktif sınav oturumu sessionStorage'da tutulur (sekme kapanınca silinir,
 * ama sayfa yenilemeye dayanıklıdır — bkz. ExamSimulation). Geçmiş sınav
 * sonuçları ise kalıcı olması gerektiği için localStorage'da tutulur.
 * İkisi de lib/progress'ten bağımsız, ayrı bir concern.
 */

const OTURUM_ANAHTARI = "sqlatolyesi.sinavOturumu.v1";
const GECMIS_ANAHTARI = "sqlatolyesi.sinavGecmisi.v1";
const GECMIS_LIMIT = 20;

function safeGet(depo: Storage, anahtar: string): string | null {
  try {
    return depo.getItem(anahtar);
  } catch {
    return null;
  }
}

function safeSet(depo: Storage, anahtar: string, deger: string): void {
  try {
    depo.setItem(anahtar, deger);
  } catch {
    // yoksay
  }
}

function safeRemove(depo: Storage, anahtar: string): void {
  try {
    depo.removeItem(anahtar);
  } catch {
    // yoksay
  }
}

export function oturumuKaydet(oturum: SinavOturumu): void {
  safeSet(window.sessionStorage, OTURUM_ANAHTARI, JSON.stringify(oturum));
}

export function oturumuOku(): SinavOturumu | null {
  const ham = safeGet(window.sessionStorage, OTURUM_ANAHTARI);
  if (!ham) return null;
  try {
    return JSON.parse(ham) as SinavOturumu;
  } catch {
    return null;
  }
}

export function oturumuTemizle(): void {
  safeRemove(window.sessionStorage, OTURUM_ANAHTARI);
}

export function gecmiseEkle(sonuc: SinavSonucu): void {
  const guncel = [sonuc, ...gecmisiOku()].slice(0, GECMIS_LIMIT);
  safeSet(window.localStorage, GECMIS_ANAHTARI, JSON.stringify(guncel));
}

export function gecmisiOku(): SinavSonucu[] {
  const ham = safeGet(window.localStorage, GECMIS_ANAHTARI);
  if (!ham) return [];
  try {
    return JSON.parse(ham) as SinavSonucu[];
  } catch {
    return [];
  }
}
