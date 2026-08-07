import Link from "next/link";
import { UNITE_SINAVLARI } from "@/content/exams";
import { UNITE_BASLIKLARI } from "@/lib/content/uniteler";

export const metadata = { title: "Test Sınavı" };

export default function SinavPage() {
  const uniteIdleri = Object.keys(UNITE_SINAVLARI).map(Number).sort((a, b) => a - b);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Test Sınavı</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-300">
        Ünite quizleriyle konu konu pekiştir, ya da süreli Test Sınavı Simülasyonu ile gerçek bir sınav deneyimi yaşa.
      </p>

      <Link
        href="/sinav/simulasyon/"
        className="mt-6 block rounded-xl border border-blue-600 bg-blue-600 p-5 text-white transition-colors hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
      >
        <p className="text-lg font-semibold">Test Sınavı Simülasyonu</p>
        <p className="mt-1 text-sm opacity-80">Vize, Final veya Özel mod — süreli, karneli, gerçek sınav deneyimi.</p>
      </Link>

      <section className="mt-10 rounded-2xl border border-stone-200 p-5 shadow-sm dark:border-stone-800 sm:p-6">
        <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400">Ünite Quizleri</h2>
        <ul className="mt-3 space-y-3">
          {uniteIdleri.map((uniteId) => (
            <li key={uniteId}>
              <Link
                href={`/sinav/unite-${uniteId}/`}
                className="block rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-stone-400 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              >
                <p className="text-sm text-stone-500 dark:text-stone-400">Ünite {uniteId}</p>
                <p className="font-semibold">{UNITE_BASLIKLARI[uniteId]}</p>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{UNITE_SINAVLARI[uniteId].length} soru</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
