"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Database, QueryExecResult } from "sql.js";
import { getSqlJs } from "@/lib/sql/engine";
import { getTableSchema, type TabloSemasi } from "@/lib/sql/schema";
import { TUM_VERITABANLARI } from "@/content/databases";
import { SqlEditor } from "@/components/sql/SqlEditor";
import { ResultTable } from "@/components/sql/ResultTable";
import { QueryError } from "@/components/sql/QueryError";
import { SchemaList } from "@/components/sql/SchemaPanel";

const OYNANABILIR_VERITABANLARI = TUM_VERITABANLARI.filter((db) => db.id !== "bos");

/**
 * Diğer tüm SQL çalıştırma yüzeylerinin (ExerciseCard, RunnableExample, ...)
 * aksine, Playground her "Çalıştır"ta TAZE bir DB açmaz — tek bir DB örneği
 * oturum (bu sayfada kalma süresi) boyunca yaşar, böylece INSERT/UPDATE/
 * CREATE gibi değişiklikler bir sonraki sorguda da görünür kalır. Sadece
 * "Sıfırla" butonu veritabanını DDL'den yeniden kurar (bkz. PROJE_PLANI.md
 * "Playground istisna" notu).
 */
export function Playground() {
  const [veritabaniId, setVeritabaniId] = useState(OYNANABILIR_VERITABANLARI[0].id);
  const [sorgu, setSorgu] = useState("");
  const [sonuc, setSonuc] = useState<QueryExecResult | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [sema, setSema] = useState<TabloSemasi[] | null>(null);
  const [calisiyor, setCalisiyor] = useState(false);
  const [calistirildiMi, setCalistirildiMi] = useState(false);
  const dbRef = useRef<Database | null>(null);

  const veritabani = OYNANABILIR_VERITABANLARI.find((db) => db.id === veritabaniId) ?? OYNANABILIR_VERITABANLARI[0];

  const veritabaniniKur = useCallback(async (ddl: string) => {
    const SQL = await getSqlJs();
    dbRef.current?.close();
    const db = new SQL.Database();
    db.run(ddl);
    dbRef.current = db;
    setSema(getTableSchema(db));
    setSonuc(null);
    setHata(null);
    setCalistirildiMi(false);
    setSorgu("");
  }, []);

  useEffect(() => {
    veritabaniniKur(veritabani.ddl);
    return () => {
      dbRef.current?.close();
      dbRef.current = null;
    };
    // veritabani nesnesi her render'da yeniden oluşturulduğu için sadece id'ye göre tetiklenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [veritabaniId, veritabaniniKur]);

  function calistir() {
    if (!dbRef.current || sorgu.trim() === "") return;
    setCalisiyor(true);
    setHata(null);
    try {
      setSonuc(dbRef.current.exec(sorgu)[0] ?? null);
      setSema(getTableSchema(dbRef.current));
    } catch (err) {
      setSonuc(null);
      setHata(err instanceof Error ? err.message : String(err));
    } finally {
      setCalistirildiMi(true);
      setCalisiyor(false);
    }
  }

  function sifirla() {
    veritabaniniKur(veritabani.ddl);
  }

  return (
    <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            Veritabanı:
            <select
              value={veritabaniId}
              onChange={(e) => setVeritabaniId(e.target.value)}
              className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {OYNANABILIR_VERITABANLARI.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.ad}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={sifirla}
            className="text-sm text-zinc-500 underline decoration-dotted underline-offset-2 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Sıfırla
          </button>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{veritabani.aciklama}</p>

        <SqlEditor value={sorgu} onChange={setSorgu} onRunRequest={calistir} />

        <button
          type="button"
          onClick={calistir}
          disabled={calisiyor || sorgu.trim() === ""}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {calisiyor ? "Çalışıyor…" : "Çalıştır"}
        </button>

        {hata && <QueryError mesaj={hata} />}
        {!hata && calistirildiMi && <ResultTable sonuc={sonuc} />}
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <h2 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">Veritabanı Şeması — {veritabani.ad}</h2>
        {sema ? <SchemaList sema={sema} /> : <p className="text-sm text-zinc-400">Yükleniyor…</p>}
      </aside>
    </div>
  );
}
