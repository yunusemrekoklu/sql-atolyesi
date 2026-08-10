import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TUM_DERSLER, getDersBySlug, getOncekiSonraki } from "@/content/lessons";
import { getSampleDatabase } from "@/content/databases";
import { RunnableExample } from "@/components/sql/RunnableExample";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { DataPreviewTable } from "@/components/sql/DataPreviewTable";
import { AlistirmalarAkordeonu } from "@/components/lesson/AlistirmalarAkordeonu";
import { DersNavigasyonu } from "@/components/lesson/DersNavigasyonu";
import { MiniQuiz } from "@/components/quiz/MiniQuiz";
import { MarkdownIcerik } from "@/components/markdown/MarkdownIcerik";
import { KART_SINIFI } from "@/lib/ui/kart";
import { AlistirmaYazdirListesi } from "@/components/print/AlistirmaYazdirListesi";
import { CoktanSecmeliYazdirListesi } from "@/components/print/CoktanSecmeliYazdirListesi";

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
        <header className={KART_SINIFI}>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Ünite {ders.uniteId} · Ders {ders.dersNo}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{ders.baslik}</h1>
        </header>

        <section className={KART_SINIFI}>
          <MarkdownIcerik sqlBloklariVar>{ders.anlatim}</MarkdownIcerik>
        </section>

        {ders.ornekler.length > 0 && (
          <section className={`print:hidden space-y-4 ${KART_SINIFI}`}>
            <h2 className="border-l-2 border-blue-400 pl-3 text-lg font-semibold dark:border-blue-500">Örnekler</h2>
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
          <section className={`space-y-4 ${KART_SINIFI}`}>
            <h2 className="border-l-2 border-blue-400 pl-3 text-lg font-semibold dark:border-blue-500">Örnek Veri</h2>
            <DataPreviewTable
              databaseId={veritabani.id}
              ddl={veritabani.ddl}
              tablolar={ders.onizlemeTablolari}
            />
          </section>
        )}

        <section className={`space-y-4 ${KART_SINIFI}`}>
          <h2 className="border-l-2 border-blue-400 pl-3 text-lg font-semibold dark:border-blue-500">Alıştırmalar</h2>
          <div className="print:hidden">
            <AlistirmalarAkordeonu
              alistirmalar={ders.alistirmalar}
              databaseId={veritabani.id}
              ddl={veritabani.ddl}
            />
          </div>
          <div className="hidden print:block">
            <AlistirmaYazdirListesi alistirmalar={ders.alistirmalar} />
          </div>
        </section>

        <section className={`space-y-4 ${KART_SINIFI}`}>
          <h2 className="border-l-2 border-blue-400 pl-3 text-lg font-semibold dark:border-blue-500">Mini Quiz</h2>
          <div className="print:hidden">
            <MiniQuiz dersSlug={ders.slug} sorular={ders.miniQuiz} />
          </div>
          <div className="hidden print:block">
            <CoktanSecmeliYazdirListesi sorular={ders.miniQuiz} />
          </div>
        </section>

        <div className="print:hidden">
          <DersNavigasyonu
            dersSlug={ders.slug}
            alistirmalar={ders.alistirmalar}
            miniQuizSoruSayisi={ders.miniQuiz.length}
            onceki={onceki}
            sonraki={sonraki}
          />
        </div>
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
