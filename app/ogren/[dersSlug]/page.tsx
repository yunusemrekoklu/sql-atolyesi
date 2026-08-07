import type { Metadata } from "next";
import { isValidElement } from "react";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { TUM_DERSLER, getDersBySlug, getOncekiSonraki } from "@/content/lessons";
import { getSampleDatabase } from "@/content/databases";
import { RunnableExample } from "@/components/sql/RunnableExample";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { DataPreviewTable } from "@/components/sql/DataPreviewTable";
import { AlistirmalarAkordeonu } from "@/components/lesson/AlistirmalarAkordeonu";
import { DersNavigasyonu } from "@/components/lesson/DersNavigasyonu";
import { MiniQuiz } from "@/components/quiz/MiniQuiz";
import { SqlCodeBlock } from "@/components/sql/SqlCodeBlock";

const anlatimBilesenleri: Components = {
  pre({ children }) {
    const kod = Array.isArray(children) ? children[0] : children;
    if (
      isValidElement<{ className?: string; children?: unknown }>(kod) &&
      /language-sql/.test(kod.props.className ?? "")
    ) {
      return <SqlCodeBlock sql={String(kod.props.children ?? "").replace(/\n$/, "")} />;
    }
    return <pre>{children}</pre>;
  },
};

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
  const { onceki, sonraki } = getOncekiSonraki(ders.slug);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <article className="min-w-0 space-y-8">
        <header className="space-y-1">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Ünite {ders.uniteId} · Ders {ders.dersNo}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{ders.baslik}</h1>
        </header>

        <div className="prose prose-stone max-w-none dark:prose-invert prose-pre:bg-stone-900 prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={anlatimBilesenleri}>
            {ders.anlatim}
          </ReactMarkdown>
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

        {ders.onizlemeTablolari && ders.onizlemeTablolari.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Örnek Veri</h2>
            <DataPreviewTable
              databaseId={veritabani.id}
              ddl={veritabani.ddl}
              tablolar={ders.onizlemeTablolari}
            />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Alıştırmalar</h2>
          <AlistirmalarAkordeonu
            alistirmalar={ders.alistirmalar}
            databaseId={veritabani.id}
            ddl={veritabani.ddl}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Mini Quiz</h2>
          <MiniQuiz dersSlug={ders.slug} sorular={ders.miniQuiz} />
        </section>

        <DersNavigasyonu dersSlug={ders.slug} onceki={onceki} sonraki={sonraki} />
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
