"use client";

import { useState } from "react";
import Link from "next/link";
import type { QueryExecResult } from "sql.js";
import type { Vaka } from "@/types/content";
import { TUM_VAKALAR } from "@/content/cases";
import { openFreshDb } from "@/lib/sql/db";
import { degerlendir, type GradeSonucu } from "@/lib/sql/grader";
import { useProgress } from "@/components/progress/ProgressProvider";
import { seviyeAcikMi } from "@/lib/progress/vaka";
import { VAKA_SEVIYE_ROZET, VAKA_TIER_KODU } from "@/lib/ui/vaka-seviye";
import { KART_SINIFI } from "@/lib/ui/kart";
import { SqlEditor } from "@/components/sql/SqlEditor";
import { ResultTable } from "@/components/sql/ResultTable";
import { QueryError } from "@/components/sql/QueryError";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { MarkdownIcerik } from "@/components/markdown/MarkdownIcerik";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * ExerciseCard/InterviewCard'daki kontrolEt() akışının birebir aynısı —
 * tek fark, vakanın kendi ddl'i + slug'ı databaseId olarak kullanılıyor ve
 * doğru çıkınca vakayiCozulduIsaretle çağrılıyor. Sekmelere bölünmüş hâli.
 */
export function VakaIcerik({ vaka }: { vaka: Vaka }) {
  const { ilerleme, vakayiCozulduIsaretle } = useProgress();
  const acik = seviyeAcikMi(vaka.seviye, TUM_VAKALAR, ilerleme.cozulenVakalar);

  const [sorgu, setSorgu] = useState("");
  const [calisiyor, setCalisiyor] = useState(false);
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [degerlendirme, setDegerlendirme] = useState<GradeSonucu | null>(null);
  const [ipucuSayisi, setIpucuSayisi] = useState(0);

  async function kontrolEt() {
    if (sorgu.trim() === "") return;
    setCalisiyor(true);
    setHata(null);
    setDegerlendirme(null);
    setSonuc(null);

    try {
      const kullaniciSonuc = await (async () => {
        const db = await openFreshDb(vaka.slug, vaka.ddl);
        try {
          return db.exec(sorgu)[0] ?? null;
        } finally {
          db.close();
        }
      })();
      setSonuc(kullaniciSonuc);

      const cozumSonuc = await (async () => {
        const db = await openFreshDb(vaka.slug, vaka.ddl);
        try {
          return db.exec(vaka.cozumSql)[0];
        } finally {
          db.close();
        }
      })();

      const sonucDegerlendirme = degerlendir({
        mod: "sonuc",
        kullanici: kullaniciSonuc,
        cozum: cozumSonuc,
        siralamaOnemli: vaka.siralamaOnemli,
        kolonAdiOnemli: vaka.kolonAdiOnemli,
      });
      setDegerlendirme(sonucDegerlendirme);
      if (sonucDegerlendirme.dogru) {
        vakayiCozulduIsaretle(vaka.slug, VAKA_TIER_KODU[vaka.seviye]);
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalisiyor(false);
    }
  }

  if (!acik) {
    return (
      <div className={KART_SINIFI}>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Bu vaka henüz kilitli — açmak için bir önceki seviyedeki 2 vakayı da çözmelisin.
        </p>
        <Link
          href="/dedektif/"
          className="mt-4 inline-block rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover"
        >
          Vaka listesine dön
        </Link>
      </div>
    );
  }

  return (
    <Tabs defaultValue="dosya">
      <TabsList>
        <TabsTrigger value="dosya">Vaka Dosyası</TabsTrigger>
        <TabsTrigger value="workspace">SQL Çalışma Alanı</TabsTrigger>
        <TabsTrigger value="sema">Şema</TabsTrigger>
      </TabsList>

      <TabsContent value="dosya" className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${VAKA_SEVIYE_ROZET[vaka.seviye]}`}>
            {vaka.seviye}
          </span>
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{vaka.xp} XP</span>
        </div>
        <MarkdownIcerik>{vaka.hikaye}</MarkdownIcerik>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-stone-500 dark:text-stone-400">Hedefler</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {vaka.hedefler.map((hedef, i) => (
              <li key={i}>{hedef}</li>
            ))}
          </ol>
        </div>
      </TabsContent>

      <TabsContent value="workspace" className="space-y-4 pt-4">
        <SqlEditor value={sorgu} onChange={setSorgu} onRunRequest={kontrolEt} otomatikOdaklan />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={kontrolEt}
            disabled={calisiyor || sorgu.trim() === ""}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
          >
            {calisiyor ? "Kontrol ediliyor…" : "Vakayı Çöz"}
          </button>
          <button
            type="button"
            onClick={() => setIpucuSayisi((n) => Math.min(vaka.ipuclari.length, n + 1))}
            disabled={ipucuSayisi >= vaka.ipuclari.length}
            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
          >
            İpucu Göster ({ipucuSayisi}/{vaka.ipuclari.length})
          </button>
        </div>

        {ipucuSayisi > 0 && (
          <ol className="list-decimal space-y-1.5 rounded-lg border border-orange-200 bg-orange-50 p-4 pl-8 text-sm text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200">
            {vaka.ipuclari.slice(0, ipucuSayisi).map((ipucu, i) => (
              <li key={i}>{ipucu}</li>
            ))}
          </ol>
        )}

        {hata && <QueryError mesaj={hata} />}

        {!hata && degerlendirme && (
          <div
            className={
              degerlendirme.dogru
                ? "rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                : "rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }
          >
            {degerlendirme.dogru ? `Vaka çözüldü! ${vaka.aciklama}` : degerlendirme.mesaj}
          </div>
        )}

        {!hata && sonuc !== null && <ResultTable sonuc={sonuc} />}
      </TabsContent>

      <TabsContent value="sema" className="pt-4">
        <SchemaPanel databaseId={vaka.slug} ddl={vaka.ddl} />
      </TabsContent>
    </Tabs>
  );
}
