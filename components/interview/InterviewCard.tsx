"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { QueryExecResult } from "sql.js";
import type { InterviewQuestion } from "@/types/content";
import { openFreshDb } from "@/lib/sql/db";
import { getFullState } from "@/lib/sql/schema";
import { degerlendir, type GradeSonucu } from "@/lib/sql/grader";
import { SqlEditor } from "@/components/sql/SqlEditor";
import { ResultTable } from "@/components/sql/ResultTable";
import { QueryError } from "@/components/sql/QueryError";
import { SchemaPanel } from "@/components/sql/SchemaPanel";
import { DataPreviewTable } from "@/components/sql/DataPreviewTable";
import { SqlCodeBlock } from "@/components/sql/SqlCodeBlock";

/**
 * Mülakat sorusu kartı — ExerciseCard'a benzer bir autograder akışı
 * kullanır, ama her soru paylaşılan örnek veritabanlarından değil kendi
 * özgün mini şemasından (soru.slug'ı databaseId olarak kullanılır) gelir
 * ve kademeli ipuçları + takip sorusu bölümü ekler.
 */
export function InterviewCard({ soru }: { soru: InterviewQuestion }) {
  const [sorgu, setSorgu] = useState("");
  const [calisiyor, setCalisiyor] = useState(false);
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [degerlendirme, setDegerlendirme] = useState<GradeSonucu | null>(null);
  const [ipucuSayisi, setIpucuSayisi] = useState(0);
  const [cozumGoster, setCozumGoster] = useState(false);
  const [takipGoster, setTakipGoster] = useState(false);

  async function kontrolEt() {
    if (sorgu.trim() === "") return;
    setCalisiyor(true);
    setHata(null);
    setDegerlendirme(null);
    setSonuc(null);

    try {
      if (soru.mod === "sonuc") {
        const kullaniciSonuc = await (async () => {
          const db = await openFreshDb(soru.slug, soru.ddl);
          try {
            return db.exec(sorgu)[0] ?? null;
          } finally {
            db.close();
          }
        })();
        setSonuc(kullaniciSonuc);

        const cozumSonuc = await (async () => {
          const db = await openFreshDb(soru.slug, soru.ddl);
          try {
            return db.exec(soru.cozumSql)[0];
          } finally {
            db.close();
          }
        })();

        setDegerlendirme(
          degerlendir({
            mod: "sonuc",
            kullanici: kullaniciSonuc,
            cozum: cozumSonuc,
            siralamaOnemli: soru.siralamaOnemli,
            kolonAdiOnemli: soru.kolonAdiOnemli,
          }),
        );
      } else {
        const kullaniciDurum = await (async () => {
          const db = await openFreshDb(soru.slug, soru.ddl);
          try {
            db.exec(sorgu);
            return getFullState(db);
          } finally {
            db.close();
          }
        })();

        const cozumDurum = await (async () => {
          const db = await openFreshDb(soru.slug, soru.ddl);
          try {
            db.exec(soru.cozumSql);
            return getFullState(db);
          } finally {
            db.close();
          }
        })();

        setDegerlendirme(degerlendir({ mod: "tabloDurumu", kullanici: kullaniciDurum, cozum: cozumDurum }));
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0 space-y-6">
        <div className="prose prose-stone max-w-none dark:prose-invert prose-pre:bg-stone-900 prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{soru.senaryo}</ReactMarkdown>
        </div>

        {soru.onizlemeTablolari && soru.onizlemeTablolari.length > 0 && (
          <DataPreviewTable databaseId={soru.slug} ddl={soru.ddl} tablolar={soru.onizlemeTablolari} />
        )}

        <SqlEditor value={sorgu} onChange={setSorgu} onRunRequest={kontrolEt} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={kontrolEt}
            disabled={calisiyor || sorgu.trim() === ""}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
          >
            {calisiyor ? "Kontrol ediliyor…" : "Kontrol Et"}
          </button>
          <button
            type="button"
            onClick={() => setIpucuSayisi((n) => Math.min(soru.ipuclari.length, n + 1))}
            disabled={ipucuSayisi >= soru.ipuclari.length}
            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900"
          >
            İpucu Göster ({ipucuSayisi}/{soru.ipuclari.length})
          </button>
          <button
            type="button"
            onClick={() => setCozumGoster((v) => !v)}
            className="rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900"
          >
            {cozumGoster ? "Çözümü gizle" : "Çözümü göster"}
          </button>
        </div>

        {ipucuSayisi > 0 && (
          <ol className="list-decimal space-y-1.5 rounded-lg border border-orange-200 bg-orange-50 p-4 pl-8 text-sm text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200">
            {soru.ipuclari.slice(0, ipucuSayisi).map((ipucu, i) => (
              <li key={i}>{ipucu}</li>
            ))}
          </ol>
        )}

        {cozumGoster && <SqlCodeBlock sql={soru.cozumSql} cozum />}

        {hata && <QueryError mesaj={hata} />}

        {!hata && degerlendirme && (
          <div
            className={
              degerlendirme.dogru
                ? "rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                : "rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }
          >
            {degerlendirme.mesaj}
          </div>
        )}

        {!hata && soru.mod === "sonuc" && sonuc !== null && <ResultTable sonuc={sonuc} />}

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
          <button
            type="button"
            onClick={() => setTakipGoster((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-medium transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-expanded={takipGoster}
          >
            <span>🎤 Takip Sorusu: {soru.takipSorusu}</span>
            <span className={takipGoster ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden="true">
              ⌄
            </span>
          </button>
          {takipGoster && (
            <p className="border-t border-stone-200 p-4 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-300">
              {soru.takipCevabi}
            </p>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <h2 className="mb-2 text-sm font-semibold text-stone-500 dark:text-stone-400">Şema</h2>
        <SchemaPanel databaseId={soru.slug} ddl={soru.ddl} />
      </aside>
    </div>
  );
}
