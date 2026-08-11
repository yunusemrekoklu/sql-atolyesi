import Link from "next/link";
import { ChevronIcon } from "@/components/ui/ChevronIcon";

interface GezinmeOgesi {
  href: string;
  baslik: string;
}

/**
 * Pratik setleri ve sınav üniteleri arasında geçiş — DersNavigasyonu.tsx'in
 * alt kısmındaki önceki/sonraki desenini paylaşan, "dersi tamamla" butonu
 * olmayan bağımsız sürüm.
 */
export function OncekiSonrakiGezinme({
  onceki,
  sonraki,
}: {
  onceki: GezinmeOgesi | null;
  sonraki: GezinmeOgesi | null;
}) {
  return (
    <div className="print:hidden flex items-center justify-between gap-4 border-t border-stone-200 pt-6 text-sm dark:border-stone-800">
      {onceki ? (
        <Link
          href={onceki.href}
          className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <ChevronIcon direction="left" className="shrink-0" />
          <span className="truncate">{onceki.baslik}</span>
        </Link>
      ) : (
        <span />
      )}
      {sonraki ? (
        <Link
          href={sonraki.href}
          className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-right text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <span className="truncate">{sonraki.baslik}</span>
          <ChevronIcon direction="right" className="shrink-0" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
