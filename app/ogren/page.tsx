import Link from "next/link";
import { TUM_DERSLER } from "@/content/lessons";

export const metadata = { title: "Öğren" };

export default function OgrenPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Öğren</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">
        5 ünite, 35 ders — SELECT&apos;ten pencere fonksiyonlarına ve veri yönetimine kadar SQL&apos;i sıfırdan öğren.
      </p>

      <ul className="mt-8 space-y-3">
        {TUM_DERSLER.map((ders) => (
          <li key={ders.slug}>
            <Link
              href={`/ogren/${ders.slug}/`}
              className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Ünite {ders.uniteId} · Ders {ders.dersNo}
              </p>
              <p className="font-semibold">{ders.baslik}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
