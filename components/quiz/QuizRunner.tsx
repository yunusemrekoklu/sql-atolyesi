"use client";

import { useState } from "react";
import type { ExamQuestion } from "@/types/content";
import { useProgress } from "@/components/progress/ProgressProvider";

/**
 * Ünite sınav havuzunu (10-15 soru) süresiz olarak çözdüren bileşen —
 * MiniQuiz ile aynı etkileşim mantığını kullanır, ama ders içi mini quiz
 * yerine bağımsız bir "anahtar" (ör. "unite-3-sinavi") altında ilerleme
 * kaydeder (bkz. lib/progress).
 */
export function QuizRunner({ anahtar, sorular }: { anahtar: string; sorular: ExamQuestion[] }) {
  const [cevaplar, setCevaplar] = useState<Record<string, number>>({});
  const [gonderildi, setGonderildi] = useState(false);
  const { miniQuizSonucunuKaydet } = useProgress();

  const dogruSayisi = sorular.filter((s) => cevaplar[s.id] === s.dogruIndex).length;
  const tumuCevaplandi = sorular.every((s) => cevaplar[s.id] !== undefined);

  function gonder() {
    setGonderildi(true);
    miniQuizSonucunuKaydet(anahtar, dogruSayisi, sorular.length);
  }

  function yenidenDene() {
    setCevaplar({});
    setGonderildi(false);
  }

  return (
    <div className="space-y-6">
      {sorular.map((soru, i) => {
        const secilen = cevaplar[soru.id];
        return (
          <div key={soru.id} className="space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900">
            <p className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>{soru.konu}</span>
            </p>
            <p className="font-medium">
              {i + 1}. {soru.soru}
            </p>
            <div className="space-y-1.5">
              {soru.secenekler.map((secenek, j) => {
                const seciliMi = secilen === j;
                let sinif =
                  "border-stone-200 bg-stone-50 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800";
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
        <div className="flex items-center gap-4">
          <p className="font-semibold">
            Sonuç: {dogruSayisi} / {sorular.length} doğru
          </p>
          <button
            type="button"
            onClick={yenidenDene}
            className="text-sm text-stone-500 underline decoration-dotted underline-offset-2 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Yeniden dene
          </button>
        </div>
      )}
    </div>
  );
}
