import Link from "next/link";
import type { ExamQuestion } from "@/types/content";
import type { SinavSonucu } from "@/lib/exam/types";
import { MOD_BASLIKLARI } from "@/lib/exam/labels";

function barRengi(oran: number): string {
  if (oran >= 70) return "bg-green-500";
  if (oran >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function ReportCard({
  sonuc,
  yanlisSorular,
  onYenidenBasla,
}: {
  sonuc: SinavSonucu;
  yanlisSorular: ExamQuestion[];
  onYenidenBasla: () => void;
}) {
  const yuzde = sonuc.toplamSoru > 0 ? Math.round((sonuc.dogruSayisi / sonuc.toplamSoru) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{MOD_BASLIKLARI[sonuc.mod]}</p>
        <p className="mt-2 text-4xl font-bold">
          {sonuc.dogruSayisi} / {sonuc.toplamSoru}
        </p>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">%{yuzde} doğru</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Konu Kırılımı</h3>
        {Object.entries(sonuc.konuKirilimi).map(([konu, k]) => {
          const oran = k.toplam > 0 ? Math.round((k.dogru / k.toplam) * 100) : 0;
          return (
            <div key={konu} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{konu}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {k.dogru} / {k.toplam}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className={`h-full rounded-full ${barRengi(oran)}`} style={{ width: `${oran}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {yanlisSorular.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Yanlış Analizi</h3>
          {yanlisSorular.map((soru) => (
            <div
              key={soru.id}
              className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950"
            >
              <p className="font-medium text-amber-900 dark:text-amber-100">{soru.soru}</p>
              <p className="mt-1 text-amber-800 dark:text-amber-200">
                Doğru cevap: {soru.secenekler[soru.dogruIndex]}
              </p>
              <p className="mt-1 text-amber-800/80 dark:text-amber-200/80">{soru.aciklama}</p>
              <Link
                href={`/ogren/${soru.dersSlug}/`}
                className="mt-2 inline-block text-amber-700 underline decoration-dotted underline-offset-2 dark:text-amber-300"
              >
                Bu konuyu tekrar et →
              </Link>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onYenidenBasla}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Yeni Sınav Başlat
      </button>
    </div>
  );
}
