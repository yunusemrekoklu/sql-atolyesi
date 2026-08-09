import Link from "next/link";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { KART_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Pratik" };

export default function PratikPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Pratik</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-300">
        Konu bazlı bağımsız soru setleri — her set kendi veritabanıyla gelir, Kolay/Orta/Zor karışık.
      </p>

      <section className={`mt-8 ${KART_SINIFI}`}>
        <ul className="space-y-3">
          {TUM_PRATIK_SETLERI.map((set) => (
            <li key={set.slug}>
              <Link
                href={`/pratik/${set.slug}/`}
                className="block rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-stone-400 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              >
                <p className="font-semibold">{set.baslik}</p>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{set.aciklama}</p>
                <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">{set.sorular.length} soru</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
