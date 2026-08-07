import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUM_PRATIK_SETLERI, getPratikSetBySlug } from "@/content/practice";
import { getSampleDatabase } from "@/content/databases";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { AlistirmalarAkordeonu } from "@/components/lesson/AlistirmalarAkordeonu";

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

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0 space-y-8">
        <header className="space-y-1">
          <Link
            href="/pratik/"
            className="text-sm text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
          >
            ← Tüm pratik setleri
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{set.baslik}</h1>
          <p className="text-stone-600 dark:text-stone-300">{set.aciklama}</p>
        </header>

        <section className="space-y-4">
          <AlistirmalarAkordeonu alistirmalar={set.sorular} databaseId={veritabani.id} ddl={veritabani.ddl} />
        </section>
      </article>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <h2 className="mb-2 text-sm font-semibold text-stone-500 dark:text-stone-400">
          Veritabanı Şeması — {veritabani.ad}
        </h2>
        <SchemaPanel databaseId={veritabani.id} ddl={veritabani.ddl} />
      </aside>
    </div>
  );
}
