import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-500 dark:border-stone-800 dark:text-stone-400">
        Ücretsiz · Kayıt gerektirmez
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Kurulum yok. Tarayıcında gerçek SQL çalıştır.
      </h1>
      <p className="max-w-2xl text-lg text-stone-600 dark:text-stone-300">
        SQL Atölyesi — Türkiye&apos;deki üniversite öğrencileri ve junior&apos;lar için
        tamamen Türkçe, sunucusuz SQL öğrenme platformu. Vize/final sınavlarına
        hazırlan, gerçek mülakat sorularını çöz.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/ogren"
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
        >
          Öğrenmeye başla
        </Link>
        <Link
          href="/playground"
          className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          Playground&apos;u dene
        </Link>
      </div>
    </div>
  );
}
