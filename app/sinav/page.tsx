import Link from "next/link";
import { UNITE_SINAVLARI } from "@/content/exams";

export const metadata = { title: "Sınav" };

const UNITE_BASLIKLARI: Record<number, string> = {
  1: "SQL'e Giriş ve Temel Sorgulama",
  2: "Hesaplama, Özetleme, Gruplama",
  3: "Çoklu Tablolar: JOIN'ler",
  4: "Alt Sorgular ve İleri Sorgulama",
  5: "Veri ve Tablo Yönetimi",
};

export default function SinavPage() {
  const uniteIdleri = Object.keys(UNITE_SINAVLARI).map(Number).sort((a, b) => a - b);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Sınav</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-300">
        Ünite quizleriyle konu konu pekiştir, ya da süreli Sınav Simülasyonu ile gerçek bir sınav deneyimi yaşa.
      </p>

      <Link
        href="/sinav/simulasyon/"
        className="mt-6 block rounded-xl border border-blue-600 bg-blue-600 p-5 text-white transition-colors hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
      >
        <p className="text-lg font-semibold">Sınav Simülasyonu</p>
        <p className="mt-1 text-sm opacity-80">Vize, Final veya Özel mod — süreli, karneli, gerçek sınav deneyimi.</p>
      </Link>

      <h2 className="mt-10 text-sm font-semibold text-stone-500 dark:text-stone-400">Ünite Quizleri</h2>
      <ul className="mt-3 space-y-3">
        {uniteIdleri.map((uniteId) => (
          <li key={uniteId}>
            <Link
              href={`/sinav/unite-${uniteId}/`}
              className="block rounded-xl border border-stone-200 p-4 transition-colors hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600"
            >
              <p className="text-sm text-stone-500 dark:text-stone-400">Ünite {uniteId}</p>
              <p className="font-semibold">{UNITE_BASLIKLARI[uniteId]}</p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{UNITE_SINAVLARI[uniteId].length} soru</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
