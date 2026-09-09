import { getVakalarBySeviye } from "@/content/cases";
import { VakaKarti } from "@/components/dedektif/VakaKarti";
import { HUB_BASLIK_SINIFI, KART_SINIFI } from "@/lib/ui/kart";
import type { VakaSeviyesi } from "@/types/content";

export const metadata = { title: "Dedektif Vakası" };

const SEVIYELER: VakaSeviyesi[] = ["Başlangıç", "Orta", "İleri"];

export default function DedektifPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <header className={HUB_BASLIK_SINIFI}>
        <h1 className="text-2xl font-bold tracking-tight">Dedektif Vakası</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          SQL sorgularıyla ipucu topla, şüpheliyi bul. Bir sonraki seviye, mevcut seviyedeki iki vakayı da çözünce
          açılır.
        </p>
      </header>

      {SEVIYELER.map((seviye) => (
        <section key={seviye} className={`mt-8 ${KART_SINIFI}`}>
          <h2 className="mb-3 text-sm font-semibold text-stone-500 dark:text-stone-400">{seviye}</h2>
          <ul className="space-y-3">
            {getVakalarBySeviye(seviye).map((vaka) => (
              <li key={vaka.slug}>
                <VakaKarti vaka={vaka} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
