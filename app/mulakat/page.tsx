import Link from "next/link";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { SEVIYE_ROZET, SEVIYE_KENAR } from "@/lib/ui/seviye";

export const metadata = { title: "Mülakat" };

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
              className={`block rounded-xl border border-l-4 border-stone-200 bg-stone-50 p-4 shadow-sm transition-all hover:bg-stone-100 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800 ${SEVIYE_KENAR[soru.seviye]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {soru.sirket}
                </p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVIYE_ROZET[soru.seviye]}`}>
                  {soru.seviye}
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold">{soru.baslik}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
