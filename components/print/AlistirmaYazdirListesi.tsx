import type { Exercise } from "@/types/content";
import { YaziAlani } from "./YaziAlani";

const SATIR_SAYISI: Record<Exercise["seviye"], number> = {
  Kolay: 4,
  Orta: 6,
  Zor: 8,
};

export function AlistirmaYazdirListesi({ alistirmalar }: { alistirmalar: Exercise[] }) {
  return (
    <ol className="space-y-6">
      {alistirmalar.map((alistirma, i) => (
        <li
          key={alistirma.id}
          className="break-inside-avoid-page border-b border-stone-300 pb-5 last:border-b-0 last:pb-0"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">
              {i + 1}. {alistirma.baslik}
            </p>
            <span className="shrink-0 rounded-full border border-stone-400 px-2 py-0.5 text-xs font-medium text-stone-600">
              {alistirma.seviye}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-700">{alistirma.soru}</p>
          <YaziAlani satirSayisi={SATIR_SAYISI[alistirma.seviye]} />
        </li>
      ))}
    </ol>
  );
}
