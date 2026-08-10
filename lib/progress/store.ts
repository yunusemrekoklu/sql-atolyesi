import {
  alistirmaDurumunuBirlestir,
  BOS_ILERLEME,
  type AlistirmaDurumu,
  type IlerlemeVerisi,
  type KazanilanSertifika,
} from "./types";
import { safeGetItem, safeSetItem, STORAGE_KEY } from "./storage";

/**
 * useSyncExternalStore ile kullanılan modül-seviyeli mini store. Bu yaklaşım
 * (useEffect içinde setState yerine) React'in önerdiği, dış veri
 * kaynaklarını (burada: localStorage) SSR/hydration güvenli şekilde
 * senkronize etme yöntemidir.
 */

let onbellek: IlerlemeVerisi = BOS_ILERLEME;
let ilkYuklemeYapildi = false;
const dinleyiciler = new Set<() => void>();

function diskteOku(): IlerlemeVerisi {
  const ham = safeGetItem();
  if (!ham) return BOS_ILERLEME;
  try {
    const ayristirilmis = JSON.parse(ham) as IlerlemeVerisi;
    // Gelecekte surum artarsa migrasyon zinciri buraya eklenir (surum 1 -> 2 -> ...).
    // Eski kayıtlarda henüz olmayan alanlar (ör. cozulenMulakatSorulari) BOS_ILERLEME
    // varsayılanlarıyla birleştirilir, undefined kalmaz.
    return ayristirilmis.surum === 1 ? { ...BOS_ILERLEME, ...ayristirilmis } : BOS_ILERLEME;
  } catch {
    return BOS_ILERLEME;
  }
}

function bildir(): void {
  for (const dinleyici of dinleyiciler) dinleyici();
}

function ilkYuklemeyiYap(): void {
  if (ilkYuklemeYapildi) return;
  ilkYuklemeYapildi = true;
  onbellek = diskteOku();
}

export function getSnapshot(): IlerlemeVerisi {
  ilkYuklemeyiYap();
  return onbellek;
}

export function getServerSnapshot(): IlerlemeVerisi {
  return BOS_ILERLEME;
}

export function subscribe(callback: () => void): () => void {
  ilkYuklemeyiYap();
  dinleyiciler.add(callback);

  function depoDegisti(e: StorageEvent): void {
    if (e.key === STORAGE_KEY) {
      onbellek = diskteOku();
      callback();
    }
  }
  window.addEventListener("storage", depoDegisti);

  return () => {
    dinleyiciler.delete(callback);
    window.removeEventListener("storage", depoDegisti);
  };
}

function guncelle(guncelleyici: (onceki: IlerlemeVerisi) => IlerlemeVerisi): void {
  onbellek = guncelleyici(onbellek);
  safeSetItem(JSON.stringify(onbellek));
  bildir();
}

/** "Çözüme bakan çözdü sayılmaz" kuralı — bkz. lib/progress/types.ts. */
export function alistirmaDurumunuAyarla(id: string, durum: AlistirmaDurumu): void {
  guncelle((onceki) => ({
    ...onceki,
    alistirmalar: {
      ...onceki.alistirmalar,
      [id]: alistirmaDurumunuBirlestir(onceki.alistirmalar[id], durum),
    },
  }));
}

export function dersiTamamlaninIsaretle(dersSlug: string): void {
  guncelle((onceki) =>
    onceki.tamamlananDersler.includes(dersSlug)
      ? onceki
      : { ...onceki, tamamlananDersler: [...onceki.tamamlananDersler, dersSlug] },
  );
}

export function miniQuizSonucunuKaydet(dersSlug: string, dogruSayisi: number, toplamSoru: number): void {
  guncelle((onceki) => ({
    ...onceki,
    miniQuizSonuclari: { ...onceki.miniQuizSonuclari, [dersSlug]: { dogruSayisi, toplamSoru } },
  }));
}

export function mulakatSorusunuCozulduIsaretle(slug: string): void {
  guncelle((onceki) =>
    onceki.cozulenMulakatSorulari.includes(slug)
      ? onceki
      : { ...onceki, cozulenMulakatSorulari: [...onceki.cozulenMulakatSorulari, slug] },
  );
}

export function kullaniciAdiniKaydet(ad: string): void {
  guncelle((onceki) => ({ ...onceki, kullaniciAdi: ad.trim() }));
}

/**
 * "Getir ya da oluştur" deseni bilinçli: bir sertifika ilk kazanıldığı an
 * tarih/ID sabitlenir, sonraki her görüntülemede aynı kayıt döner —
 * tekrar tekrar yeni tarih/ID üretilmez.
 */
export function sertifikaGetirYaDaOlustur(anahtar: string): KazanilanSertifika {
  const mevcut = onbellek.kazanilanSertifikalar[anahtar];
  if (mevcut) return mevcut;
  const yeni: KazanilanSertifika = {
    id: `SQLCODEX-${anahtar.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    tarih: new Date().toISOString().slice(0, 10),
  };
  guncelle((onceki) => ({
    ...onceki,
    kazanilanSertifikalar: { ...onceki.kazanilanSertifikalar, [anahtar]: yeni },
  }));
  return yeni;
}
