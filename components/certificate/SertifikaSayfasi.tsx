"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TUM_DERSLER } from "@/content/lessons";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { UNITE_BASLIKLARI } from "@/lib/content/uniteler";
import { uniteTamamlandiMi, pratikTamamlandiMi, mulakatTamamlandiMi } from "@/lib/progress/sertifika";
import { useProgress } from "@/components/progress/ProgressProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { SertifikaKarti } from "@/components/certificate/SertifikaKarti";
import { SertifikaPaylasButonlari } from "@/components/certificate/SertifikaPaylasButonlari";
import { SertifikaIndirButonu } from "@/components/print/SertifikaIndirButonu";
import { YazdirButonu } from "@/components/print/YazdirButonu";
import { KART_SINIFI } from "@/lib/ui/kart";
import { SITE_URL } from "@/lib/site";

type SertifikaTuru = { tip: "unite"; uniteId: number } | { tip: "pratik" } | { tip: "mulakat" } | { tip: "tumu" };

function turuAyristir(tur: string): SertifikaTuru | null {
  const eslesme = /^unite-([1-5])$/.exec(tur);
  if (eslesme) return { tip: "unite", uniteId: Number(eslesme[1]) };
  if (tur === "pratik") return { tip: "pratik" };
  if (tur === "mulakat") return { tip: "mulakat" };
  if (tur === "tumu") return { tip: "tumu" };
  return null;
}

function baslikVeGeriLink(turu: SertifikaTuru): { baslik: string; geriLink: string; geriMetin: string } {
  if (turu.tip === "unite") {
    return {
      baslik: `Ünite ${turu.uniteId} — ${UNITE_BASLIKLARI[turu.uniteId]}`,
      geriLink: "/ogren/",
      geriMetin: "Öğren sayfasına dön",
    };
  }
  if (turu.tip === "pratik") {
    return { baslik: "Pratik", geriLink: "/pratik/", geriMetin: "Pratik sayfasına dön" };
  }
  if (turu.tip === "mulakat") {
    return { baslik: "Mülakat", geriLink: "/mulakat/", geriMetin: "Mülakat sayfasına dön" };
  }
  return { baslik: "Büyük Sertifika", geriLink: "/", geriMetin: "Ana sayfaya dön" };
}

function kursSatiriUret(turu: SertifikaTuru): string {
  if (turu.tip === "tumu") {
    return "Has successfully completed the entire SQLCODEX curriculum — Learn, Practical, and Interview.";
  }
  const ek =
    turu.tip === "unite" ? `Unit ${turu.uniteId} course.` : turu.tip === "pratik" ? "Practical Section." : "Interview Section.";
  return `Has successfully completed the SQLCODEX ${ek}`;
}

export function SertifikaSayfasi({ tur }: { tur: string }) {
  const turu = turuAyristir(tur);
  const { ilerleme, kullaniciAdiniKaydet, sertifikaGetirYaDaOlustur } = useProgress();
  const { user } = useAuth();
  const [adTaslak, setAdTaslak] = useState("");
  const sertifikaRef = useRef<HTMLDivElement>(null);

  const kazanildiMi = turu
    ? turu.tip === "unite"
      ? uniteTamamlandiMi(turu.uniteId, TUM_DERSLER, ilerleme.tamamlananDersler)
      : turu.tip === "pratik"
        ? pratikTamamlandiMi(TUM_PRATIK_SETLERI, ilerleme.alistirmalar)
        : turu.tip === "mulakat"
          ? mulakatTamamlandiMi(TUM_MULAKAT_SORULARI, ilerleme.cozulenMulakatSorulari)
          : [1, 2, 3, 4, 5].every((uniteId) => uniteTamamlandiMi(uniteId, TUM_DERSLER, ilerleme.tamamlananDersler)) &&
            pratikTamamlandiMi(TUM_PRATIK_SETLERI, ilerleme.alistirmalar) &&
            mulakatTamamlandiMi(TUM_MULAKAT_SORULARI, ilerleme.cozulenMulakatSorulari)
    : false;

  const kayit = ilerleme.kazanilanSertifikalar[tur];

  useEffect(() => {
    if (kazanildiMi && ilerleme.kullaniciAdi && !kayit) {
      sertifikaGetirYaDaOlustur(tur).catch((err) => {
        console.error("Sertifika oluşturulamadı:", err);
      });
    }
  }, [kazanildiMi, ilerleme.kullaniciAdi, kayit, tur, sertifikaGetirYaDaOlustur]);

  if (!turu) return null;

  const { baslik, geriLink, geriMetin } = baslikVeGeriLink(turu);

  if (!kazanildiMi) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <div className={KART_SINIFI}>
          <p className="text-lg font-semibold">Henüz bu sertifikayı kazanmadın</p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            {baslik} bölümünü tamamladığında bu sertifika burada açılacak.
          </p>
          <Link
            href={geriLink}
            className="mt-5 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {geriMetin}
          </Link>
        </div>
      </div>
    );
  }

  if (!ilerleme.kullaniciAdi) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className={KART_SINIFI}>
          <p className="text-lg font-semibold">
            {turu.tip === "tumu" ? "🏆 Tebrikler, SQLCODEX'i baştan sona tamamladın!" : `🎓 Tebrikler, ${baslik} sertifikasını kazandın!`}
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Sertifikada görünecek adını yaz — bir kez girilir, sonraki tüm sertifikalarda otomatik kullanılır.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const temiz = adTaslak.trim();
              if (!temiz) return;
              kullaniciAdiniKaydet(temiz);
              setAdTaslak("");
            }}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={adTaslak}
              onChange={(e) => setAdTaslak(e.target.value)}
              placeholder={ilerleme.kullaniciAdi ?? "Ad Soyad"}
              className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-900"
              aria-label="Sertifikada görünecek ad"
              autoFocus
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Oluştur
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!kayit) return null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 print:max-w-none print:p-0">
      <div ref={sertifikaRef}>
        <SertifikaKarti
          ad={ilerleme.kullaniciAdi}
          kursSatiri={kursSatiriUret(turu)}
          tarih={kayit.tarih}
          id={kayit.displayCode}
          arkaPlan={turu.tip === "tumu" ? "/sertifika-arka-plan-tumu.png" : "/sertifika-arka-plan.png"}
          altinTema={turu.tip === "tumu"}
        />
      </div>
      <div className="print:hidden mt-5 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SertifikaIndirButonu hedefRef={sertifikaRef} dosyaAdi={`sqlcodex-sertifika-${tur}.pdf`} />
          <YazdirButonu />
          {user && <SertifikaPaylasButonlari url={`${SITE_URL}/certificate/${kayit.id}`} />}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {user && (
            <Link
              href={`/certificate/${kayit.id}`}
              className="text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              paylaşılabilir sayfa
            </Link>
          )}
          <Link
            href="/profil"
            className="text-sm text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-white"
          >
            adını değiştir
          </Link>
        </div>
      </div>
    </div>
  );
}
