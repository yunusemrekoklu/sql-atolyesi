import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUM_VAKALAR, getVakaBySlug } from "@/content/cases";
import { VakaIcerik } from "@/components/dedektif/VakaIcerik";
import { ChevronIcon } from "@/components/ui/ChevronIcon";
import { KART_SINIFI } from "@/lib/ui/kart";
import { VAKA_SEVIYE_ROZET } from "@/lib/ui/vaka-seviye";

export function generateStaticParams() {
  return TUM_VAKALAR.map((vaka) => ({ vakaSlug: vaka.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vakaSlug: string }>;
}): Promise<Metadata> {
  const { vakaSlug } = await params;
  const vaka = getVakaBySlug(vakaSlug);
  if (!vaka) return {};
  return { title: vaka.baslik };
}

export default async function VakaPage({
  params,
}: {
  params: Promise<{ vakaSlug: string }>;
}) {
  const { vakaSlug } = await params;
  const vaka = getVakaBySlug(vakaSlug);
  if (!vaka) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 space-y-3">
        <Link
          href="/dedektif/"
          className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <ChevronIcon direction="left" /> Tüm vakalar
        </Link>
        <header className={KART_SINIFI}>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${VAKA_SEVIYE_ROZET[vaka.seviye]}`}>
              {vaka.seviye}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{vaka.xp} XP</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{vaka.baslik}</h1>
        </header>
      </div>

      <VakaIcerik vaka={vaka} />
    </div>
  );
}
