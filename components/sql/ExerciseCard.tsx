"use client";

import { useState } from "react";
import type { QueryExecResult } from "sql.js";
import type { Exercise } from "@/types/content";
import { openFreshDb } from "@/lib/sql/db";
import { getFullState } from "@/lib/sql/schema";
import { degerlendir, type GradeSonucu } from "@/lib/sql/grader";
import { SqlEditor } from "./SqlEditor";
import { ResultTable } from "./ResultTable";
import { QueryError } from "./QueryError";

export function ExerciseCard({
  alistirma,
  databaseId,
  ddl,
}: {
  alistirma: Exercise;
  databaseId: string;
  ddl: string;
}) {
  const [sorgu, setSorgu] = useState("");
  const [calisiyor, setCalisiyor] = useState(false);
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [degerlendirme, setDegerlendirme] = useState<GradeSonucu | null>(null);
  const [ipucuGoster, setIpucuGoster] = useState(false);
  const [cozumGoster, setCozumGoster] = useState(false);

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

        setDegerlendirme(
          degerlendir({
            mod: "sonuc",
            kullanici: kullaniciSonuc,
            cozum: cozumSonuc,
            siralamaOnemli: alistirma.siralamaOnemli,
            kolonAdiOnemli: alistirma.kolonAdiOnemli,
          }),
        );
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

        setDegerlendirme(degerlendir({ mod: "tabloDurumu", kullanici: kullaniciDurum, cozum: cozumDurum }));
      }
    } catch (err) {
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{alistirma.baslik}</h3>
        <span className="whitespace-nowrap rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          {alistirma.seviye}
        </span>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-300">{alistirma.soru}</p>

      <SqlEditor value={sorgu} onChange={setSorgu} onRunRequest={kontrolEt} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={kontrolEt}
          disabled={calisiyor || sorgu.trim() === ""}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {calisiyor ? "Kontrol ediliyor…" : "Kontrol Et"}
        </button>
        <button
          type="button"
          onClick={() => setIpucuGoster((v) => !v)}
          className="text-sm text-zinc-500 underline decoration-dotted underline-offset-2 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {ipucuGoster ? "İpucunu gizle" : "İpucu göster"}
        </button>
        <button
          type="button"
          onClick={() => setCozumGoster((v) => !v)}
          className="text-sm text-zinc-500 underline decoration-dotted underline-offset-2 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {cozumGoster ? "Çözümü gizle" : "Çözümü göster"}
        </button>
      </div>

      {ipucuGoster && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {alistirma.ipucu}
        </p>
      )}
      {cozumGoster && (
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-sm text-zinc-100">
          <code>{alistirma.cozumSql}</code>
        </pre>
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
          {degerlendirme.mesaj}
        </div>
      )}

      {!hata && alistirma.mod === "sonuc" && sonuc !== null && <ResultTable sonuc={sonuc} />}
    </div>
  );
}
