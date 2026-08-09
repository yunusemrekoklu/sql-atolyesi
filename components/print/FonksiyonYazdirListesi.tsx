import type { FunctionRef } from "@/types/content";

export function FonksiyonYazdirListesi({ fonksiyonlar }: { fonksiyonlar: FunctionRef[] }) {
  return (
    <div className="space-y-5">
      {fonksiyonlar.map((fn) => (
        <div
          key={fn.slug}
          className="break-inside-avoid-page border-b border-stone-300 pb-4 last:border-b-0 last:pb-0"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-base font-semibold">{fn.ad}</h3>
            {fn.oncelikli && (
              <span className="rounded-full border border-stone-400 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                Öncelikli
              </span>
            )}
            <span className="ml-auto text-xs text-stone-500">{fn.kategori}</span>
          </div>
          <p className="mt-1 font-mono text-sm text-stone-600">{fn.sozDizimi}</p>
          <p className="mt-1.5 text-sm text-stone-700">{fn.aciklama}</p>
          {fn.digerVeritabanlari && <p className="mt-1.5 text-xs text-stone-500">{fn.digerVeritabanlari}</p>}
          {fn.ornekAciklama && <p className="mt-2 text-xs italic text-stone-500">{fn.ornekAciklama}</p>}
          <pre className="mt-1 overflow-x-auto rounded-lg border border-stone-300 p-2 font-mono text-xs text-stone-800">
            {fn.ornekSql}
          </pre>
        </div>
      ))}
    </div>
  );
}
