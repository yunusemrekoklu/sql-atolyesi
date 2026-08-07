"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/types/content";
import { ExerciseCard } from "@/components/sql/ExerciseCard";
import { useProgress } from "@/components/progress/ProgressProvider";
import { SEVIYE_ROZET } from "@/lib/ui/seviye";

/**
 * Alıştırmaları akordeon içinde gösterir — sıradaki (ilk çözülmemiş) soru
 * varsayılan olarak açık gelir ve doğru cevap sonrası otomatik olarak
 * bir sonrakine geçer (yumuşak yönlendirme). Tüm sorular her zaman
 * tıklanabilir; kullanıcı manuel olarak istediği soruyu açabilir.
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
  const [acikId, setAcikId] = useState<string | null>(null);
  const { ilerleme } = useProgress();

  const varsayilanAcikId = useMemo(() => {
    const ilkCozulmemis = alistirmalar.find((a) => ilerleme.alistirmalar[a.id] !== "cozuldu");
    return ilkCozulmemis?.id ?? alistirmalar[alistirmalar.length - 1]?.id ?? null;
  }, [alistirmalar, ilerleme.alistirmalar]);

  const efektifAcikId = acikId ?? varsayilanAcikId;
  const varsayilanIndex = alistirmalar.findIndex((a) => a.id === varsayilanAcikId);

  // Bir alıştırma ziyaret edildikten sonra kapatılsa bile ExerciseCard'ı unmount
  // etmeyip gizli tutuyoruz — böylece kullanıcının yazdığı sorgu/sonuç, başka bir
  // alıştırmaya geçip geri döndüğünde silinmeden korunur.
  const [ziyaretEdilenler, setZiyaretEdilenler] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!efektifAcikId) return;
    setZiyaretEdilenler((onceki) =>
      onceki.has(efektifAcikId) ? onceki : new Set(onceki).add(efektifAcikId),
    );
  }, [efektifAcikId]);

  return (
    <div className="space-y-3">
      {alistirmalar.map((alistirma, i) => {
        const acik = efektifAcikId === alistirma.id;
        const durum = ilerleme.alistirmalar[alistirma.id];
        const cozuldu = durum === "cozuldu";
        const henuzGelinmedi = !acik && !cozuldu && i > varsayilanIndex;

        return (
          <div
            key={alistirma.id}
            className={`overflow-hidden rounded-xl border bg-stone-50 transition-colors dark:bg-stone-900 ${
              acik
                ? "border-blue-400 ring-1 ring-blue-400/40 dark:border-blue-500 dark:ring-blue-500/30"
                : "border-stone-200 dark:border-stone-800"
            }`}
          >
            <button
              type="button"
              onClick={() => setAcikId(acik ? null : alistirma.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-expanded={acik}
            >
              <span
                className={`flex items-center gap-2 font-medium ${
                  cozuldu
                    ? "text-stone-500 dark:text-stone-500"
                    : henuzGelinmedi
                      ? "text-stone-400 dark:text-stone-600"
                      : ""
                }`}
              >
                {cozuldu && (
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
              <span className="flex shrink-0 items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-medium ${SEVIYE_ROZET[alistirma.seviye]}`}>
                  {alistirma.seviye}
                </span>
                <span className={acik ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden="true">
                  ⌄
                </span>
              </span>
            </button>
            {(acik || ziyaretEdilenler.has(alistirma.id)) && (
              <div className={acik ? "border-t border-stone-200 p-4 dark:border-stone-800" : "hidden"}>
                <ExerciseCard
                  alistirma={alistirma}
                  databaseId={databaseId}
                  ddl={ddl}
                  onDogruCozuldu={() => setAcikId(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
