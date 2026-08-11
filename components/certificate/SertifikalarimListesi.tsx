"use client";

import { useState } from "react";
import Link from "next/link";
import { TUM_DERSLER } from "@/content/lessons";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { UNITE_BASLIKLARI } from "@/lib/content/uniteler";
import {
  uniteIlerlemesi,
  pratikIlerlemesi,
  mulakatIlerlemesi,
  type IlerlemeKesri,
} from "@/lib/progress/sertifika";
import { useProgress } from "@/components/progress/ProgressProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import type { KazanilanSertifika } from "@/lib/progress/types";
import { KART_SINIFI } from "@/lib/ui/kart";
import { SITE_URL } from "@/lib/site";

interface SertifikaTanimi {
  anahtar: string;
  baslik: string;
  ilerleme: IlerlemeKesri;
}

export function SertifikalarimListesi() {
  const { ilerleme } = useProgress();
  const { user } = useAuth();

  const uniteTanimlari: SertifikaTanimi[] = [1, 2, 3, 4, 5].map((uniteId) => ({
    anahtar: `unite-${uniteId}`,
    baslik: `Ünite ${uniteId} — ${UNITE_BASLIKLARI[uniteId]}`,
    ilerleme: uniteIlerlemesi(uniteId, TUM_DERSLER, ilerleme.tamamlananDersler),
  }));

  const pratikTanimi: SertifikaTanimi = {
    anahtar: "pratik",
    baslik: "Pratik",
    ilerleme: pratikIlerlemesi(TUM_PRATIK_SETLERI, ilerleme.alistirmalar),
  };

  const mulakatTanimi: SertifikaTanimi = {
    anahtar: "mulakat",
    baslik: "Mülakat",
    ilerleme: mulakatIlerlemesi(TUM_MULAKAT_SORULARI, ilerleme.cozulenMulakatSorulari),
  };

  const digerTanimlar = [...uniteTanimlari, pratikTanimi, mulakatTanimi];
  const tumuTanimi: SertifikaTanimi = {
    anahtar: "tumu",
    baslik: "Büyük Sertifika — Tüm Müfredat",
    ilerleme: {
      tamamlanan: digerTanimlar.reduce((t, d) => t + d.ilerleme.tamamlanan, 0),
      toplam: digerTanimlar.reduce((t, d) => t + d.ilerleme.toplam, 0),
    },
  };

  const tumTanimlar = [...digerTanimlar, tumuTanimi];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tumTanimlar.map((tanim) => (
        <SertifikaKart
          key={tanim.anahtar}
          tanim={tanim}
          kayit={ilerleme.kazanilanSertifikalar[tanim.anahtar]}
          girisYapilmis={!!user}
        />
      ))}
    </div>
  );
}

function SertifikaKart({
  tanim,
  kayit,
  girisYapilmis,
}: {
  tanim: SertifikaTanimi;
  kayit?: KazanilanSertifika;
  girisYapilmis: boolean;
}) {
  const [kopyaDurumu, setKopyaDurumu] = useState<"bosta" | "kopyalandi" | "basarisiz">("bosta");
  const yuzde =
    tanim.ilerleme.toplam === 0 ? 0 : Math.round((tanim.ilerleme.tamamlanan / tanim.ilerleme.toplam) * 100);
  const genelUrl = kayit ? `${SITE_URL}/certificate/${kayit.id}` : null;

  async function linkiKopyala() {
    if (!genelUrl) return;
    try {
      await navigator.clipboard.writeText(genelUrl);
      setKopyaDurumu("kopyalandi");
      setTimeout(() => setKopyaDurumu("bosta"), 2000);
    } catch {
      // Clipboard API izni reddedebilir (ör. Safari, kısıtlı tarayıcı
      // politikaları) — kullanıcıyı sessizce bırakmak yerine linki elle
      // seçip kopyalayabileceği bir alan gösterelim (basarisiz durumu
      // kalıcı kalır, otomatik kapanmaz).
      setKopyaDurumu("basarisiz");
    }
  }

  return (
    <div className={KART_SINIFI}>
      <p className="font-semibold">{tanim.baslik}</p>

      {kayit ? (
        <>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{kayit.tarih} tarihinde kazanıldı</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/sertifika/${tanim.anahtar}/`}
              className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Görüntüle / Yazdır
            </Link>
            {girisYapilmis && genelUrl ? (
              <>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(genelUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#0a66c2] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#004182]"
                >
                  LinkedIn&apos;de paylaş
                </a>
                <button
                  type="button"
                  onClick={linkiKopyala}
                  className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  {kopyaDurumu === "kopyalandi" ? "Kopyalandı ✓" : "Genel linki kopyala"}
                </button>
                {kopyaDurumu === "basarisiz" && (
                  <input
                    type="text"
                    readOnly
                    value={genelUrl}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="Sertifika linki — kopyalamak için seç"
                    className="w-full min-w-0 rounded-md border border-stone-300 bg-stone-50 px-2 py-1 text-xs text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                  />
                )}
              </>
            ) : (
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Paylaşılabilir hale getirmek için{" "}
                <Link href="/kayit" className="font-medium text-accent hover:underline">
                  kayıt ol
                </Link>
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${yuzde}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
            {tanim.ilerleme.tamamlanan}/{tanim.ilerleme.toplam} tamamlandı — %{yuzde}
          </p>
        </div>
      )}
    </div>
  );
}
