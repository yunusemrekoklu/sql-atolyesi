import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUM_MULAKAT_SORULARI, getMulakatSorusuBySlug } from "@/content/interview";
import { InterviewCard } from "@/components/interview/InterviewCard";

export function generateStaticParams() {
  return TUM_MULAKAT_SORULARI.map((soru) => ({ soruSlug: soru.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ soruSlug: string }>;
}): Promise<Metadata> {
  const { soruSlug } = await params;
  const soru = getMulakatSorusuBySlug(soruSlug);
  if (!soru) return {};
  return { title: soru.baslik };
}

export default async function MulakatSorusuPage({
  params,
}: {
  params: Promise<{ soruSlug: string }>;
}) {
  const { soruSlug } = await params;
  const soru = getMulakatSorusuBySlug(soruSlug);
  if (!soru) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 space-y-1">
        <Link
          href="/mulakat/"
          className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          ← Tüm mülakat soruları
        </Link>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {soru.sirket} · {soru.seviye}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{soru.baslik}</h1>
      </div>

      <InterviewCard soru={soru} />
    </div>
  );
}
