import {
  alistirmaDurumunuBirlestir,
  BOS_ILERLEME,
  type AlistirmaDurumu,
  type IlerlemeVerisi,
  type KazanilanSertifika,
} from "./types";
import { safeGetItem, safeSetItem, STORAGE_KEY } from "./storage";
import { createClient } from "@/lib/supabase/client";
import {
  uzakAlistirmaDurumunuAyarla,
  uzakDersiTamamlaniIsaretle,
  uzakIlerlemeyiGetir,
  uzakKullaniciAdiniKaydet,
  uzakMiniQuizSonucunuKaydet,
  uzakMulakatSorusunuIsaretle,
  uzakSertifikaGetirYaDaOlustur,
  uzakYereliIceAktar,
} from "./remote";

/**
 * useSyncExternalStore ile kullanılan modül-seviyeli mini store. Bu yaklaşım
 * (useEffect içinde setState yerine) React'in önerdiği, dış veri
 * kaynaklarını (burada: localStorage + Supabase) SSR/hydration güvenli
 * şekilde senkronize etme yöntemidir.
 *
 * Çift modlu: oturum yoksa ("yerel") bugünkü davranış birebir korunur —
 * misafir kullanıcı localStorage'da ilerleyebilir. Oturum açılınca
 * ("uzak") localStorage'daki mevcut ilerleme bir kerelik Supabase'e
 * aktarılır, ardından kaynak Supabase'e döner: her mutasyon iyimser
 * olarak local önbelleğe yazılır ve arka planda Supabase'e senkronlanır.
 */

const ICE_AKTARMA_BAYRAK_ANAHTARI = "sqlatolyesi.progress.imported.v1";

let onbellek: IlerlemeVerisi = BOS_ILERLEME;
let ilkYuklemeYapildi = false;
let authDinlemeBaslatildi = false;
let kaynak: "yerel" | "uzak" = "yerel";
let uzakKullaniciId: string | null = null;
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

function arkaPlandaCalistir(gorev: Promise<unknown>): void {
  gorev.catch((err) => {
    console.error("[progress] Uzak senkron hatası:", err);
  });
}

async function iceAktarmayiGerekirseYap(userId: string): Promise<void> {
  let zatenYapildi = false;
  try {
    zatenYapildi = window.localStorage.getItem(ICE_AKTARMA_BAYRAK_ANAHTARI) === "1";
  } catch {
    return;
  }
  if (zatenYapildi) return;

  const yerelVeri = diskteOku();
  try {
    await uzakYereliIceAktar(userId, yerelVeri);
  } finally {
    try {
      window.localStorage.setItem(ICE_AKTARMA_BAYRAK_ANAHTARI, "1");
    } catch {
      // yoksay
    }
  }
}

async function uzakModaGec(userId: string): Promise<void> {
  if (kaynak === "uzak" && uzakKullaniciId === userId) return;
  kaynak = "uzak";
  uzakKullaniciId = userId;

  await iceAktarmayiGerekirseYap(userId);

  const uzakVeri = await uzakIlerlemeyiGetir(userId);
  // Bu sırada kullanıcı çıkış yapmış olabilir — o zaman yazma.
  if (kaynak === "uzak" && uzakKullaniciId === userId) {
    onbellek = uzakVeri;
    bildir();
  }
}

function yerelModaGec(): void {
  if (kaynak === "yerel") return;
  kaynak = "yerel";
  uzakKullaniciId = null;
  onbellek = diskteOku();
  bildir();
}

function authDinlemeyiBaslat(): void {
  if (authDinlemeBaslatildi) return;
  authDinlemeBaslatildi = true;

  const supabase = createClient();

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) uzakModaGec(session.user.id);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      uzakModaGec(session.user.id);
    } else if (event === "SIGNED_OUT") {
      yerelModaGec();
    }
  });
}

export function subscribe(callback: () => void): () => void {
  ilkYuklemeyiYap();
  authDinlemeyiBaslat();
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
  if (kaynak === "uzak") arkaPlandaCalistir(uzakAlistirmaDurumunuAyarla(id, durum));
}

export function dersiTamamlaninIsaretle(dersSlug: string): void {
  guncelle((onceki) =>
    onceki.tamamlananDersler.includes(dersSlug)
      ? onceki
      : { ...onceki, tamamlananDersler: [...onceki.tamamlananDersler, dersSlug] },
  );
  if (kaynak === "uzak" && uzakKullaniciId) {
    arkaPlandaCalistir(uzakDersiTamamlaniIsaretle(uzakKullaniciId, dersSlug));
  }
}

export function miniQuizSonucunuKaydet(dersSlug: string, dogruSayisi: number, toplamSoru: number): void {
  guncelle((onceki) => ({
    ...onceki,
    miniQuizSonuclari: { ...onceki.miniQuizSonuclari, [dersSlug]: { dogruSayisi, toplamSoru } },
  }));
  if (kaynak === "uzak" && uzakKullaniciId) {
    arkaPlandaCalistir(uzakMiniQuizSonucunuKaydet(uzakKullaniciId, dersSlug, dogruSayisi, toplamSoru));
  }
}

export function mulakatSorusunuCozulduIsaretle(slug: string): void {
  guncelle((onceki) =>
    onceki.cozulenMulakatSorulari.includes(slug)
      ? onceki
      : { ...onceki, cozulenMulakatSorulari: [...onceki.cozulenMulakatSorulari, slug] },
  );
  if (kaynak === "uzak" && uzakKullaniciId) {
    arkaPlandaCalistir(uzakMulakatSorusunuIsaretle(uzakKullaniciId, slug));
  }
}

export function kullaniciAdiniKaydet(ad: string): void {
  const temiz = ad.trim();
  guncelle((onceki) => ({ ...onceki, kullaniciAdi: temiz }));
  if (kaynak === "uzak" && uzakKullaniciId) {
    arkaPlandaCalistir(uzakKullaniciAdiniKaydet(uzakKullaniciId, temiz));
  }
}

function yerelSertifikaUret(anahtar: string): KazanilanSertifika {
  const kod = `SQLCODEX-${anahtar.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return { id: kod, displayCode: kod, tarih: new Date().toISOString().slice(0, 10) };
}

/**
 * "Getir ya da oluştur" deseni bilinçli: bir sertifika ilk kazanıldığı an
 * tarih/ID sabitlenir, sonraki her görüntülemede aynı kayıt döner —
 * tekrar tekrar yeni tarih/ID üretilmez. Uzak modda sunucu round-trip'i
 * gerektiği için (gerçek UUID + display_code üretimi) fonksiyon her iki
 * modda da async'tir.
 */
export async function sertifikaGetirYaDaOlustur(anahtar: string): Promise<KazanilanSertifika> {
  const mevcut = onbellek.kazanilanSertifikalar[anahtar];
  if (mevcut) return mevcut;

  if (kaynak === "uzak") {
    const yeni = await uzakSertifikaGetirYaDaOlustur(anahtar);
    guncelle((onceki) => ({
      ...onceki,
      kazanilanSertifikalar: { ...onceki.kazanilanSertifikalar, [anahtar]: yeni },
    }));
    return yeni;
  }

  const yeni = yerelSertifikaUret(anahtar);
  guncelle((onceki) => ({
    ...onceki,
    kazanilanSertifikalar: { ...onceki.kazanilanSertifikalar, [anahtar]: yeni },
  }));
  return yeni;
}
