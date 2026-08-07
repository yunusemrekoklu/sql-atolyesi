import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITE_SINAVLARI, getUniteSinavi } from "@/content/exams";
import { QuizRunner } from "@/components/quiz/QuizRunner";

const UNITE_BASLIKLARI: Record<number, string> = {
  1: "Ünite 1 — SQL'e Giriş ve Temel Sorgulama",
  2: "Ünite 2 — Hesaplama, Özetleme, Gruplama",
  3: "Ünite 3 — Çoklu Tablolar: JOIN'ler",
  4: "Ünite 4 — Alt Sorgular ve İleri Sorgulama",
  5: "Ünite 5 — Veri ve Tablo Yönetimi",
};

function konuSlugToUniteId(konuSlug: string): number | null {
  const eslesme = /^unite-(\d)$/.exec(konuSlug);
  if (!eslesme) return null;
  return Number(eslesme[1]);
}

export function generateStaticParams() {
  return Object.keys(UNITE_SINAVLARI).map((uniteId) => ({ konuSlug: `unite-${uniteId}` }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ konuSlug: string }>;
}): Promise<Metadata> {
  const { konuSlug } = await params;
  const uniteId = konuSlugToUniteId(konuSlug);
  if (uniteId === null) return {};
  return { title: `${UNITE_BASLIKLARI[uniteId]} Sınavı` };
}

export default async function UniteSinaviPage({
  params,
}: {
  params: Promise<{ konuSlug: string }>;
}) {
  const { konuSlug } = await params;
  const uniteId = konuSlugToUniteId(konuSlug);
  if (uniteId === null) notFound();

  const sorular = getUniteSinavi(uniteId);
  if (!sorular) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-1">
        <Link
          href="/sinav/"
          className="text-sm text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ← Tüm sınavlar
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{UNITE_BASLIKLARI[uniteId]}</h1>
        <p className="text-stone-600 dark:text-stone-300">{sorular.length} çoktan seçmeli soru — süre sınırı yok.</p>
      </div>

      <QuizRunner anahtar={`unite-${uniteId}-sinavi`} sorular={sorular} />
    </div>
  );
}
