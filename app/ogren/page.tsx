import type { Lesson } from "@/types/content";
import { TUM_DERSLER } from "@/content/lessons";
import { UniteListesi } from "@/components/lesson/UniteListesi";

export const metadata = { title: "Öğren" };

export default function OgrenPage() {
  const dersleriUniteyeGore = TUM_DERSLER.reduce<Record<number, Lesson[]>>((acc, ders) => {
    (acc[ders.uniteId] ??= []).push(ders);
    return acc;
  }, {});

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Öğren</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-300">
        5 ünite, 35 ders — SELECT&apos;ten pencere fonksiyonlarına ve veri yönetimine kadar SQL&apos;i sıfırdan öğren.
      </p>

      <UniteListesi dersleriUniteyeGore={dersleriUniteyeGore} />
    </div>
  );
}
