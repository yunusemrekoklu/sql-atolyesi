import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNITE_SINAVLARI, getUniteSinavi } from "@/content/exams";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { ChevronIcon } from "@/components/ui/ChevronIcon";
import { OncekiSonrakiGezinme } from "@/components/ui/OncekiSonrakiGezinme";
import { CoktanSecmeliYazdirListesi } from "@/components/print/CoktanSecmeliYazdirListesi";
import { YazdirButonu } from "@/components/print/YazdirButonu";
import { KART_SINIFI } from "@/lib/ui/kart";

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
      <div className="mb-8 space-y-3">
        <Link
          href="/sinav/"
          className="print:hidden inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <ChevronIcon direction="left" /> Tüm sınavlar
        </Link>
        <header className={`flex items-start justify-between gap-4 ${KART_SINIFI}`}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{UNITE_BASLIKLARI[uniteId]}</h1>
            <p className="text-stone-600 dark:text-stone-300">{sorular.length} çoktan seçmeli soru — süre sınırı yok.</p>
          </div>
          <YazdirButonu />
        </header>
      </div>

      <div className="print:hidden">
        <QuizRunner uniteId={uniteId} sorular={sorular} />
      </div>
      <div className="hidden print:block">
        <CoktanSecmeliYazdirListesi sorular={sorular} />
      </div>

      <div className="mt-8">
        <OncekiSonrakiGezinme
          onceki={uniteId > 1 ? { href: `/sinav/unite-${uniteId - 1}/`, baslik: UNITE_BASLIKLARI[uniteId - 1] } : null}
          sonraki={uniteId < 5 ? { href: `/sinav/unite-${uniteId + 1}/`, baslik: UNITE_BASLIKLARI[uniteId + 1] } : null}
        />
      </div>
    </div>
  );
}
