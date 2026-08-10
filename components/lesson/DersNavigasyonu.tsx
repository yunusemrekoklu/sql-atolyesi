"use client";

import Link from "next/link";
import type { Exercise, Lesson } from "@/types/content";
import { useProgress } from "@/components/progress/ProgressProvider";
import { ChevronIcon } from "@/components/ui/ChevronIcon";

export function DersNavigasyonu({
  dersSlug,
  alistirmalar,
  miniQuizSoruSayisi,
  onceki,
  sonraki,
}: {
  dersSlug: string;
  alistirmalar: Exercise[];
  miniQuizSoruSayisi: number;
  onceki: Lesson | null;
  sonraki: Lesson | null;
}) {
  const { ilerleme, dersiTamamlaninIsaretle } = useProgress();
  const tamamlandiMi = ilerleme.tamamlananDersler.includes(dersSlug);

  const tumAlistirmalarDenendi = alistirmalar.every(
    (a) => ilerleme.alistirmalar[a.id] !== undefined,
  );
  const miniQuizTamam =
    miniQuizSoruSayisi === 0 || ilerleme.miniQuizSonuclari[dersSlug] !== undefined;
  const tamamlanabilir = tumAlistirmalarDenendi && miniQuizTamam;

  return (
    <div className="space-y-4 border-t border-stone-200 pt-6 dark:border-stone-800">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => dersiTamamlaninIsaretle(dersSlug)}
          disabled={tamamlandiMi || !tamamlanabilir}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-70 dark:bg-green-500 dark:hover:bg-green-600"
        >
          {tamamlandiMi ? "Ders tamamlandı ✓" : "Dersi Tamamla"}
        </button>
        {!tamamlandiMi && !tamamlanabilir && (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Tüm alıştırmaları ve mini quizi tamamlamalısın.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        {onceki ? (
          <Link
            href={`/ogren/${onceki.slug}/`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <ChevronIcon direction="left" className="shrink-0" />
            <span className="truncate">
              {onceki.dersNo} {onceki.baslik}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {sonraki ? (
          <Link
            href={`/ogren/${sonraki.slug}/`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-right text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <span className="truncate">
              {sonraki.dersNo} {sonraki.baslik}
            </span>
            <ChevronIcon direction="right" className="shrink-0" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
