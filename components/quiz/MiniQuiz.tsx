"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/content";
import { useProgress } from "@/components/progress/ProgressProvider";

export function MiniQuiz({ dersSlug, sorular }: { dersSlug: string; sorular: QuizQuestion[] }) {
  const [cevaplar, setCevaplar] = useState<Record<string, number>>({});
  const [gonderildi, setGonderildi] = useState(false);
  const { miniQuizSonucunuKaydet } = useProgress();

  const dogruSayisi = sorular.filter((s) => cevaplar[s.id] === s.dogruIndex).length;
  const tumuCevaplandi = sorular.every((s) => cevaplar[s.id] !== undefined);

  function gonder() {
    setGonderildi(true);
    miniQuizSonucunuKaydet(dersSlug, dogruSayisi, sorular.length);
  }

  return (
    <div className="space-y-6">
      {sorular.map((soru, i) => {
        const secilen = cevaplar[soru.id];
        return (
          <div key={soru.id} className="space-y-2">
            <p className="font-medium">
              {i + 1}. {soru.soru}
            </p>
            <div className="space-y-1.5">
              {soru.secenekler.map((secenek, j) => {
                const seciliMi = secilen === j;
                let sinif = "border-stone-200 dark:border-stone-800";
                if (gonderildi) {
                  if (j === soru.dogruIndex) {
                    sinif = "border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950";
                  } else if (seciliMi) {
                    sinif = "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950";
                  }
                } else if (seciliMi) {
                  sinif = "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40";
                }
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={gonderildi}
                    onClick={() => setCevaplar((onceki) => ({ ...onceki, [soru.id]: j }))}
                    className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${sinif}`}
                  >
                    {secenek}
                  </button>
                );
              })}
            </div>
            {gonderildi && <p className="text-sm text-stone-600 dark:text-stone-300">{soru.aciklama}</p>}
          </div>
        );
      })}

      {!gonderildi ? (
        <button
          type="button"
          onClick={gonder}
          disabled={!tumuCevaplandi}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
        >
          Quizi Bitir
        </button>
      ) : (
        <p className="font-semibold">
          Sonuç: {dogruSayisi} / {sorular.length} doğru
        </p>
      )}
    </div>
  );
}
