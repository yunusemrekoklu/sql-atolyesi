import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TUM_DERSLER, getDersBySlug } from "@/content/lessons";
import { getSampleDatabase } from "@/content/databases";
import { RunnableExample } from "@/components/sql/RunnableExample";
import { ExerciseCard } from "@/components/sql/ExerciseCard";
import { SchemaPanel } from "@/components/sql/SchemaPanel";

export function generateStaticParams() {
  return TUM_DERSLER.map((ders) => ({ dersSlug: ders.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dersSlug: string }>;
}): Promise<Metadata> {
  const { dersSlug } = await params;
  const ders = getDersBySlug(dersSlug);
  if (!ders) return {};
  return { title: `${ders.dersNo} ${ders.baslik}` };
}

export default async function DersPage({
  params,
}: {
  params: Promise<{ dersSlug: string }>;
}) {
  const { dersSlug } = await params;
  const ders = getDersBySlug(dersSlug);
  if (!ders) notFound();

  const veritabani = getSampleDatabase(ders.veritabaniId);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0 space-y-8">
        <header className="space-y-1">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Ünite {ders.uniteId} · Ders {ders.dersNo}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{ders.baslik}</h1>
        </header>

        <div className="prose prose-zinc max-w-none dark:prose-invert prose-pre:bg-zinc-900 prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{ders.anlatim}</ReactMarkdown>
        </div>

        {ders.ornekler.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Örnekler</h2>
            {ders.ornekler.map((ornek, i) => (
              <RunnableExample
                key={i}
                databaseId={veritabani.id}
                ddl={veritabani.ddl}
                sql={ornek.sql}
                aciklama={ornek.aciklama}
              />
            ))}
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Alıştırmalar</h2>
          {ders.alistirmalar.map((alistirma) => (
            <ExerciseCard
              key={alistirma.id}
              alistirma={alistirma}
              databaseId={veritabani.id}
              ddl={veritabani.ddl}
            />
          ))}
        </section>
      </article>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <h2 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          Veritabanı Şeması — {veritabani.ad}
        </h2>
        <SchemaPanel databaseId={veritabani.id} ddl={veritabani.ddl} />
      </aside>
    </div>
  );
}
