import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUM_PRATIK_SETLERI, getPratikSetBySlug, getOncekiSonrakiPratik } from "@/content/practice";
import { getSampleDatabase } from "@/content/databases";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { AlistirmalarAkordeonu } from "@/components/lesson/AlistirmalarAkordeonu";
import { ChevronIcon } from "@/components/ui/ChevronIcon";
import { OncekiSonrakiGezinme } from "@/components/ui/OncekiSonrakiGezinme";
import { KART_SINIFI } from "@/lib/ui/kart";
import { AlistirmaYazdirListesi } from "@/components/print/AlistirmaYazdirListesi";
import { YazdirButonu } from "@/components/print/YazdirButonu";

export function generateStaticParams() {
  return TUM_PRATIK_SETLERI.map((set) => ({ setSlug: set.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setSlug: string }>;
}): Promise<Metadata> {
  const { setSlug } = await params;
  const set = getPratikSetBySlug(setSlug);
  if (!set) return {};
  return { title: set.baslik };
}

export default async function PratikSetPage({
  params,
}: {
  params: Promise<{ setSlug: string }>;
}) {
  const { setSlug } = await params;
  const set = getPratikSetBySlug(setSlug);
  if (!set) notFound();

  const veritabani = getSampleDatabase(set.veritabaniId);
  const { onceki, sonraki } = getOncekiSonrakiPratik(set.slug);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0 space-y-8">
        <div className="space-y-3">
          <Link
            href="/pratik/"
            className="print:hidden inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <ChevronIcon direction="left" /> Tüm pratik setleri
          </Link>
          <header className={KART_SINIFI}>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{set.baslik}</h1>
            <p className="text-stone-600 dark:text-stone-300">{set.aciklama}</p>
          </header>
        </div>

        <section className={`space-y-4 ${KART_SINIFI}`}>
          <h2 className="border-l-2 border-blue-400 pl-3 text-lg font-semibold dark:border-blue-500">Sorular</h2>
          <div className="print:hidden">
            <AlistirmalarAkordeonu alistirmalar={set.sorular} databaseId={veritabani.id} ddl={veritabani.ddl} />
          </div>
          <div className="hidden print:block">
            <AlistirmaYazdirListesi alistirmalar={set.sorular} />
          </div>
        </section>

        <OncekiSonrakiGezinme
          onceki={onceki && { href: `/pratik/${onceki.slug}/`, baslik: onceki.baslik }}
          sonraki={sonraki && { href: `/pratik/${sonraki.slug}/`, baslik: sonraki.baslik }}
        />
      </article>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <h2 className="mb-2 text-sm font-semibold text-stone-500 dark:text-stone-400">
          Veritabanı Şeması — {veritabani.ad}
        </h2>
        <SchemaPanel databaseId={veritabani.id} ddl={veritabani.ddl} />
        <div className="mt-4">
          <YazdirButonu />
        </div>
      </aside>
    </div>
  );
}
