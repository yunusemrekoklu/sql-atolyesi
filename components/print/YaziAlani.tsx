/** Yazdırmada elle çözüm yazmak için boş çizgili alan. */
export function YaziAlani({ satirSayisi = 5 }: { satirSayisi?: number }) {
  return (
    <div className="mt-3 space-y-8" aria-hidden="true">
      {Array.from({ length: satirSayisi }, (_, i) => (
        <div key={i} className="h-0 border-b border-stone-400" />
      ))}
    </div>
  );
}
