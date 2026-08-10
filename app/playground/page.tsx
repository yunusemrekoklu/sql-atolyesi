import { Playground } from "@/components/playground/Playground";
import { HUB_BASLIK_SINIFI, KART_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className={`mb-6 ${HUB_BASLIK_SINIFI}`}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Playground</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          Serbest sorgu alanı — örnek veritabanları arasında geçiş yap, istediğin gibi INSERT/UPDATE/CREATE dene.
          Değişikliklerin sayfada kaldığın sürece kalıcıdır; baştan başlamak için Sıfırla&apos;ya bas.
        </p>
      </header>

      <section className={KART_SINIFI}>
        <Playground />
      </section>
    </div>
  );
}
