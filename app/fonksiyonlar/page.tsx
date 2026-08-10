import { TUM_FONKSIYONLAR } from "@/content/functions";
import { FunctionExplorer } from "@/components/functions/FunctionExplorer";
import { HUB_BASLIK_SINIFI } from "@/lib/ui/kart";
import { YazdirButonu } from "@/components/print/YazdirButonu";

export const metadata = { title: "Fonksiyonlar" };

export default function FonksiyonlarPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <header className={`flex items-start justify-between gap-4 ${HUB_BASLIK_SINIFI}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fonksiyonlar</h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            {TUM_FONKSIYONLAR.length} SQL fonksiyonu — aranabilir, kategorilere ayrılmış, her biri çalıştırılabilir mini
            örnekli. Sınavda/mülakatta en çok çıkanlar <span className="font-medium text-amber-700 dark:text-amber-400">Öncelikli</span> rozetiyle işaretli.
          </p>
        </div>
        <YazdirButonu />
      </header>

      <div className="mt-8">
        <FunctionExplorer fonksiyonlar={TUM_FONKSIYONLAR} />
      </div>
    </div>
  );
}
