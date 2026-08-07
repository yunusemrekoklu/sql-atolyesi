"use client";

import { useState } from "react";
import type { QueryExecResult } from "sql.js";
import type { Exercise } from "@/types/content";
import { openFreshDb } from "@/lib/sql/db";
import { getFullState } from "@/lib/sql/schema";
import { degerlendir, type GradeSonucu } from "@/lib/sql/grader";
import { useProgress } from "@/components/progress/ProgressProvider";
import { SqlEditor } from "./SqlEditor";
import { ResultTable } from "./ResultTable";
import { QueryError } from "./QueryError";
import { SqlCodeBlock } from "./SqlCodeBlock";

export function ExerciseCard({
  alistirma,
  databaseId,
  ddl,
  onDogruCozuldu,
}: {
  alistirma: Exercise;
  databaseId: string;
  ddl: string;
  onDogruCozuldu?: () => void;
}) {
  const [sorgu, setSorgu] = useState("");
  const [calisiyor, setCalisiyor] = useState(false);
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [degerlendirme, setDegerlendirme] = useState<GradeSonucu | null>(null);
  const [ipucuGoster, setIpucuGoster] = useState(false);
  const [cozumGoster, setCozumGoster] = useState(false);
  const { alistirmaDurumunuAyarla } = useProgress();

  function cozumuGosterVeIsaretle() {
    setCozumGoster((v) => !v);
    alistirmaDurumunuAyarla(alistirma.id, "cozumGoruldu");
  }

  async function kontrolEt() {
    if (sorgu.trim() === "") return;
    setCalisiyor(true);
    setHata(null);
    setDegerlendirme(null);
    setSonuc(null);

    try {
      if (alistirma.mod === "sonuc") {
        const kullaniciSonuc = await (async () => {
          const db = await openFreshDb(databaseId, ddl);
          try {
            return db.exec(sorgu)[0] ?? null;
          } finally {
            db.close();
          }
        })();
        setSonuc(kullaniciSonuc);

        const cozumSonuc = await (async () => {
          const db = await openFreshDb(databaseId, ddl);
          try {
            return db.exec(alistirma.cozumSql)[0];
          } finally {
            db.close();
          }
        })();

        const sonucDegerlendirme = degerlendir({
          mod: "sonuc",
          kullanici: kullaniciSonuc,
          cozum: cozumSonuc,
          siralamaOnemli: alistirma.siralamaOnemli,
          kolonAdiOnemli: alistirma.kolonAdiOnemli,
        });
        setDegerlendirme(sonucDegerlendirme);
        if (sonucDegerlendirme.dogru) {
          alistirmaDurumunuAyarla(alistirma.id, "cozuldu");
          onDogruCozuldu?.();
        }
      } else {
        const kullaniciDurum = await (async () => {
          const db = await openFreshDb(databaseId, ddl);
          try {
            db.exec(sorgu);
            return getFullState(db);
          } finally {
            db.close();
          }
        })();

        const cozumDurum = await (async () => {
          const db = await openFreshDb(databaseId, ddl);
          try {
            db.exec(alistirma.cozumSql);
            return getFullState(db);
          } finally {
            db.close();
          }
        })();

        const tabloDegerlendirme = degerlendir({ mod: "tabloDurumu", kullanici: kullaniciDurum, cozum: cozumDurum });
        setDegerlendirme(tabloDegerlendirme);
        if (tabloDegerlendirme.dogru) {
          alistirmaDurumunuAyarla(alistirma.id, "cozuldu");
          onDogruCozuldu?.();
        }
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600 dark:text-stone-300">{alistirma.soru}</p>

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
          onClick={() => setIpucuGoster((v) => !v)}
          className="text-sm text-stone-500 underline decoration-dotted underline-offset-2 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          {ipucuGoster ? "İpucunu gizle" : "İpucu göster"}
        </button>
        <button
          type="button"
          onClick={cozumuGosterVeIsaretle}
          className="text-sm text-stone-500 underline decoration-dotted underline-offset-2 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          {cozumGoster ? "Çözümü gizle" : "Çözümü göster"}
        </button>
      </div>

      {ipucuGoster && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {alistirma.ipucu}
        </p>
      )}
      {cozumGoster && <SqlCodeBlock sql={alistirma.cozumSql} />}

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

      {!hata && alistirma.mod === "sonuc" && sonuc !== null && <ResultTable sonuc={sonuc} />}
    </div>
  );
}
