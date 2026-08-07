import Link from "next/link";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";

export const metadata = { title: "Mülakat" };

const SEVIYE_RENK: Record<string, string> = {
  Kolay: "text-green-700 dark:text-green-400",
  Orta: "text-amber-700 dark:text-amber-400",
  Zor: "text-red-700 dark:text-red-400",
};

export default function MulakatPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Mülakat</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-300">
        Gerçek mülakat sorusu tarzında, kurgusal Türk şirket senaryolarıyla SQL soruları — her biri kendi mini şemasıyla gelir.
      </p>

      <ul className="mt-8 space-y-3">
        {TUM_MULAKAT_SORULARI.map((soru) => (
          <li key={soru.slug}>
            <Link
              href={`/mulakat/${soru.slug}/`}
              className="block rounded-xl border border-stone-200 p-4 transition-colors hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-stone-500 dark:text-stone-400">{soru.sirket}</p>
                <span className={`text-xs font-medium ${SEVIYE_RENK[soru.seviye]}`}>{soru.seviye}</span>
              </div>
              <p className="font-semibold">{soru.baslik}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
