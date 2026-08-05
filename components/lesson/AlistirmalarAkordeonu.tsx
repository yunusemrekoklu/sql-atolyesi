"use client";

import { useState } from "react";
import type { Exercise } from "@/types/content";
import { ExerciseCard } from "@/components/sql/ExerciseCard";
import { useProgress } from "@/components/progress/ProgressProvider";

/**
 * Alıştırmaları tek-açık akordeon içinde gösterir — sayfada aynı anda
 * yalnızca bir CodeMirror editörü canlı olur (mobil performans + odak).
 */
export function AlistirmalarAkordeonu({
  alistirmalar,
  databaseId,
  ddl,
}: {
  alistirmalar: Exercise[];
  databaseId: string;
  ddl: string;
}) {
  const [acikId, setAcikId] = useState<string | null>(alistirmalar[0]?.id ?? null);
  const { ilerleme } = useProgress();

  return (
    <div className="space-y-3">
      {alistirmalar.map((alistirma) => {
        const acik = acikId === alistirma.id;
        const durum = ilerleme.alistirmalar[alistirma.id];

        return (
          <div key={alistirma.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setAcikId(acik ? null : alistirma.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              aria-expanded={acik}
            >
              <span className="flex items-center gap-2 font-medium">
                {durum === "cozuldu" && (
                  <span className="text-green-600 dark:text-green-400" title="Çözüldü" aria-hidden="true">
                    ✓
                  </span>
                )}
                {durum === "cozumGoruldu" && (
                  <span className="text-amber-500" title="Çözüm görüldü" aria-hidden="true">
                    ◐
                  </span>
                )}
                {alistirma.baslik}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {alistirma.seviye}
                <span className={acik ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden="true">
                  ⌄
                </span>
              </span>
            </button>
            {acik && (
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <ExerciseCard alistirma={alistirma} databaseId={databaseId} ddl={ddl} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
