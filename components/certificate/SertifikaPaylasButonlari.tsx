"use client";

import { useState } from "react";

/**
 * LinkedIn paylaşım + genel link kopyalama — kazanılan bir sertifikanın
 * gösterildiği her yerde (sertifika sayfası, Sertifikalarım listesi)
 * aynı davranışı sağlamak için paylaşılan tek bileşen.
 */
export function SertifikaPaylasButonlari({ url }: { url: string }) {
  const [kopyaDurumu, setKopyaDurumu] = useState<"bosta" | "kopyalandi" | "basarisiz">("bosta");

  async function linkiKopyala() {
    try {
      await navigator.clipboard.writeText(url);
      setKopyaDurumu("kopyalandi");
      setTimeout(() => setKopyaDurumu("bosta"), 2000);
    } catch {
      // Clipboard API izni reddedebilir (ör. Safari, kısıtlı tarayıcı
      // politikaları) — kullanıcıyı sessizce bırakmak yerine linki elle
      // seçip kopyalayabileceği bir alan gösterelim.
      setKopyaDurumu("basarisiz");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
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
          value={url}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Sertifika linki — kopyalamak için seç"
          className="w-full min-w-0 rounded-md border border-stone-300 bg-stone-50 px-2 py-1 text-xs text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
        />
      )}
    </div>
  );
}
