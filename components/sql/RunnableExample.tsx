"use client";

import { useState } from "react";
import type { QueryExecResult } from "sql.js";
import { openFreshDb } from "@/lib/sql/db";
import { ResultTable } from "./ResultTable";
import { QueryError } from "./QueryError";
import { SqlCodeBlock } from "./SqlCodeBlock";

export function RunnableExample({
  databaseId,
  ddl,
  sql,
  aciklama,
}: {
  databaseId: string;
  ddl: string;
  sql: string;
  aciklama?: string;
}) {
  const [calisiyor, setCalisiyor] = useState(false);
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [calistirildi, setCalistirildi] = useState(false);

  async function calistir() {
    setCalisiyor(true);
    setHata(null);
    try {
      const db = await openFreshDb(databaseId, ddl);
      try {
        setSonuc(db.exec(sql)[0] ?? null);
      } finally {
        db.close();
      }
    } catch (err) {
      setSonuc(null);
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalistirildi(true);
      setCalisiyor(false);
    }
  }

  return (
    <div className="my-4 space-y-2">
      {aciklama && <p className="text-sm text-stone-600 dark:text-stone-300">{aciklama}</p>}
      <SqlCodeBlock sql={sql} />
      <button
        type="button"
        onClick={calistir}
        disabled={calisiyor}
        className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-400"
      >
        {calisiyor ? "Çalışıyor…" : "Çalıştır"}
      </button>
      {hata && <QueryError mesaj={hata} />}
      {!hata && calistirildi && <ResultTable sonuc={sonuc} />}
    </div>
  );
}
