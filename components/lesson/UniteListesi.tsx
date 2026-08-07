"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/types/content";
import { UNITE_BASLIKLARI } from "@/lib/content/uniteler";
import { useProgress } from "@/components/progress/ProgressProvider";

/**
 * /ogren sayfasındaki 5 ünite kutusu — tıklanan kutu aynı sayfada
 * (URL değişmeden) genişler ve altında o ünitenin dersleri listelenir.
 */
export function UniteListesi({
  dersleriUniteyeGore,
}: {
  dersleriUniteyeGore: Record<number, Lesson[]>;
}) {
  const [acikUniteId, setAcikUniteId] = useState<number | null>(null);
  const { ilerleme } = useProgress();
  const uniteIdleri = Object.keys(dersleriUniteyeGore).map(Number).sort((a, b) => a - b);

  return (
    <div className="mt-8 space-y-3">
      {uniteIdleri.map((uniteId) => {
        const dersler = dersleriUniteyeGore[uniteId];
        const acik = acikUniteId === uniteId;
        const tamamlanan = dersler.filter((d) => ilerleme.tamamlananDersler.includes(d.slug)).length;

        return (
          <div key={uniteId} className="rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setAcikUniteId(acik ? null : uniteId)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={acik}
            >
              <span>
                <p className="text-sm text-stone-500 dark:text-stone-400">Ünite {uniteId}</p>
                <p className="text-lg font-semibold">{UNITE_BASLIKLARI[uniteId]}</p>
              </span>
              <span className="flex shrink-0 items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                {tamamlanan}/{dersler.length} tamamlandı
                <span className={acik ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden="true">
                  ⌄
                </span>
              </span>
            </button>
            {acik && (
              <ul className="space-y-2 border-t border-stone-200 p-4 dark:border-stone-800">
                {dersler.map((ders) => (
                  <li key={ders.slug}>
                    <Link
                      href={`/ogren/${ders.slug}/`}
                      className="flex items-center gap-2 rounded-lg border border-stone-200 p-3 transition-colors hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600"
                    >
                      {ilerleme.tamamlananDersler.includes(ders.slug) && (
                        <span className="text-green-600 dark:text-green-400" aria-hidden="true">
                          ✓
                        </span>
                      )}
                      <span>
                        <span className="text-sm text-stone-500 dark:text-stone-400">Ders {ders.dersNo}</span>{" "}
                        <span className="font-medium">{ders.baslik}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
