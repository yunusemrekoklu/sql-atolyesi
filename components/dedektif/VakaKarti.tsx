"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { Vaka, VakaSeviyesi } from "@/types/content";
import { TUM_VAKALAR } from "@/content/cases";
import { useProgress } from "@/components/progress/ProgressProvider";
import { seviyeAcikMi, vakaCozuldu } from "@/lib/progress/vaka";
import { VAKA_SEVIYE_ROZET } from "@/lib/ui/vaka-seviye";

function oncekiSeviye(seviye: VakaSeviyesi): VakaSeviyesi {
  return seviye === "Orta" ? "Başlangıç" : "Orta";
}

export function VakaKarti({ vaka }: { vaka: Vaka }) {
  const { ilerleme } = useProgress();
  const acik = seviyeAcikMi(vaka.seviye, TUM_VAKALAR, ilerleme.cozulenVakalar);
  const cozuldu = vakaCozuldu(ilerleme.cozulenVakalar, vaka.slug);

  const icerik = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold">
          {vaka.baslik}
          {cozuldu && <span className="ml-1.5 text-green-600 dark:text-green-400">✓</span>}
        </p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${VAKA_SEVIYE_ROZET[vaka.seviye]}`}
        >
          {vaka.xp} XP
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{vaka.ozet}</p>
    </>
  );

  if (!acik) {
    return (
      <div
        className="relative cursor-not-allowed overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-4 opacity-70 dark:border-stone-800 dark:bg-stone-900"
        aria-disabled="true"
      >
        {icerik}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-stone-900/70 p-4 text-center dark:bg-stone-950/80">
          <Lock className="h-5 w-5 text-white" aria-hidden="true" />
          <p className="text-xs font-medium text-white">
            Bu seviyeyi açmak için {oncekiSeviye(vaka.seviye)}&apos;taki 2 vakayı da çöz
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/dedektif/${vaka.slug}/`}
      className="block rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-stone-400 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600 dark:hover:bg-stone-800"
    >
      {icerik}
    </Link>
  );
}
