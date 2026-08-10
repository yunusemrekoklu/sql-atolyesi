"use client";

import Link from "next/link";
import { TUM_DERSLER } from "@/content/lessons";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { uniteTamamlandiMi, pratikTamamlandiMi, mulakatTamamlandiMi } from "@/lib/progress/sertifika";
import { useProgress } from "@/components/progress/ProgressProvider";

export function TumSertifikalarBanner() {
  const { ilerleme } = useProgress();

  const tamamlandiMi =
    [1, 2, 3, 4, 5].every((uniteId) => uniteTamamlandiMi(uniteId, TUM_DERSLER, ilerleme.tamamlananDersler)) &&
    pratikTamamlandiMi(TUM_PRATIK_SETLERI, ilerleme.alistirmalar) &&
    mulakatTamamlandiMi(TUM_MULAKAT_SORULARI, ilerleme.cozulenMulakatSorulari);

  if (!tamamlandiMi) return null;

  return (
    <Link
      href="/sertifika/tumu/"
      className="inline-flex items-center gap-2 rounded-full border-2 border-accent bg-orange-50 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50"
    >
      🏆 SQLCODEX'i baştan sona bitirdin — büyük sertifikanı gör
    </Link>
  );
}
