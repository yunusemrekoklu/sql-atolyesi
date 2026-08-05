import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Ücretsiz · Kayıt gerektirmez
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Kurulum yok. Tarayıcında gerçek SQL çalıştır.
      </h1>
      <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
        SQL Atölyesi — Türkiye&apos;deki üniversite öğrencileri ve junior&apos;lar için
        tamamen Türkçe, sunucusuz SQL öğrenme platformu. Vize/final sınavlarına
        hazırlan, gerçek mülakat sorularını çöz.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/ogren"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Öğrenmeye başla
        </Link>
        <Link
          href="/playground"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Playground&apos;u dene
        </Link>
      </div>
    </div>
  );
}
