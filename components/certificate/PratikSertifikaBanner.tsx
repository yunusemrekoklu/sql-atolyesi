"use client";

import Link from "next/link";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { pratikTamamlandiMi } from "@/lib/progress/sertifika";
import { useProgress } from "@/components/progress/ProgressProvider";

export function PratikSertifikaBanner() {
  const { ilerleme } = useProgress();
  if (!pratikTamamlandiMi(TUM_PRATIK_SETLERI, ilerleme.alistirmalar)) return null;

  return (
    <Link
      href="/sertifika/pratik/"
      className="mt-4 block rounded-lg border border-accent bg-orange-50 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50"
    >
      🎓 Tüm pratik setlerini bitirdin — sertifikanı gör
    </Link>
  );
}
