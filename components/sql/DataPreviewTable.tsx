"use client";

import { useEffect, useState } from "react";
import type { QueryExecResult } from "sql.js";
import { openFreshDb } from "@/lib/sql/db";
import { ResultTable } from "./ResultTable";

function TekTabloOnizleme({
  databaseId,
  ddl,
  tablo,
}: {
  databaseId: string;
  ddl: string;
  tablo: string;
}) {
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let iptalEdildi = false;

    openFreshDb(databaseId, ddl)
      .then((db) => {
        try {
          if (!iptalEdildi) setSonuc(db.exec(`SELECT * FROM "${tablo}";`)[0] ?? null);
        } finally {
          db.close();
        }
      })
      .catch((err: unknown) => {
        if (!iptalEdildi) setHata(err instanceof Error ? err.message : String(err));
      });

    return () => {
      iptalEdildi = true;
    };
  }, [databaseId, ddl, tablo]);

  return (
    <div className="space-y-2">
      <p className="font-mono text-sm font-semibold text-stone-700 dark:text-stone-300">Tablo: {tablo}</p>
      {hata ? (
        <p className="text-sm text-red-600 dark:text-red-400">Veri yüklenemedi: {hata}</p>
      ) : sonuc ? (
        <ResultTable sonuc={sonuc} />
      ) : (
        <p className="text-sm text-stone-400">Yükleniyor…</p>
      )}
    </div>
  );
}

/**
 * Alıştırmalardan önce örnek verinin tamamını gösteren önizleme —
 * SchemaPanel yalnızca kolon adlarını gösterirken bu, gerçek satırları
 * gösterir (bkz. PROJE_PLANI.md "önizleme tablosu").
 */
export function DataPreviewTable({
  databaseId,
  ddl,
  tablolar,
}: {
  databaseId: string;
  ddl: string;
  tablolar: string[];
}) {
  return (
    <div className="space-y-6">
      {tablolar.map((tablo) => (
        <TekTabloOnizleme key={tablo} databaseId={databaseId} ddl={ddl} tablo={tablo} />
      ))}
    </div>
  );
}
