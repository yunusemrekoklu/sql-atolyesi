"use client";

import Link from "next/link";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { mulakatTamamlandiMi } from "@/lib/progress/sertifika";
import { useProgress } from "@/components/progress/ProgressProvider";

export function MulakatSertifikaBanner() {
  const { ilerleme } = useProgress();
  if (!mulakatTamamlandiMi(TUM_MULAKAT_SORULARI, ilerleme.cozulenMulakatSorulari)) return null;

  return (
    <Link
      href="/sertifika/mulakat/"
      className="mt-4 block rounded-lg border border-accent bg-orange-50 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50"
    >
      🎓 Tüm mülakat sorularını bitirdin — sertifikanı gör
    </Link>
  );
}
