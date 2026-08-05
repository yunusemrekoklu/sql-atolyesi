"use client";

import { useState } from "react";
import type { QueryExecResult } from "sql.js";
import { openFreshDb } from "@/lib/sql/db";
import { ResultTable } from "./ResultTable";
import { QueryError } from "./QueryError";

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
      {aciklama && <p className="text-sm text-zinc-600 dark:text-zinc-300">{aciklama}</p>}
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-sm text-zinc-100">
        <code>{sql}</code>
      </pre>
      <button
        type="button"
        onClick={calistir}
        disabled={calisiyor}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {calisiyor ? "Çalışıyor…" : "Çalıştır"}
      </button>
      {hata && <QueryError mesaj={hata} />}
      {!hata && calistirildi && <ResultTable sonuc={sonuc} />}
    </div>
  );
}
