"use client";

import Link from "next/link";
import type { Lesson } from "@/types/content";
import { useProgress } from "@/components/progress/ProgressProvider";

export function DersNavigasyonu({
  dersSlug,
  onceki,
  sonraki,
}: {
  dersSlug: string;
  onceki: Lesson | null;
  sonraki: Lesson | null;
}) {
  const { ilerleme, dersiTamamlaninIsaretle } = useProgress();
  const tamamlandiMi = ilerleme.tamamlananDersler.includes(dersSlug);

  return (
    <div className="space-y-4 border-t border-stone-200 pt-6 dark:border-stone-800">
      <button
        type="button"
        onClick={() => dersiTamamlaninIsaretle(dersSlug)}
        disabled={tamamlandiMi}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-70 dark:bg-green-500 dark:hover:bg-green-600"
      >
        {tamamlandiMi ? "Ders tamamlandı ✓" : "Dersi Tamamla"}
      </button>

      <div className="flex items-center justify-between gap-4 text-sm">
        {onceki ? (
          <Link
            href={`/ogren/${onceki.slug}/`}
            className="text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
          >
            ← {onceki.dersNo} {onceki.baslik}
          </Link>
        ) : (
          <span />
        )}
        {sonraki ? (
          <Link
            href={`/ogren/${sonraki.slug}/`}
            className="text-right text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-white"
          >
            {sonraki.dersNo} {sonraki.baslik} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
