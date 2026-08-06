"use client";

import { useEffect, useState } from "react";
import { openFreshDb } from "@/lib/sql/db";
import { getTableSchema, type TabloSemasi } from "@/lib/sql/schema";

/**
 * Şema listesinin salt-render kısmı — SchemaPanel'in kendi ddl'inden veri
 * çekmesinin yanı sıra, canlı bir DB örneğinden (ör. Playground) önceden
 * alınmış şema verisini de göstermek için ayrı bir bileşen olarak dışa
 * açılır.
 */
export function SchemaList({ sema }: { sema: TabloSemasi[] }) {
  return (
    <div className="space-y-3">
      {sema.map((tablo) => (
        <div key={tablo.ad} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="mb-1.5 font-mono text-sm font-semibold">{tablo.ad}</p>
          <ul className="space-y-0.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {tablo.kolonlar.map((kolon) => (
              <li key={kolon.ad}>
                {kolon.ad}{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  {kolon.tip}
                  {kolon.pk ? " · PK" : ""}
                  {kolon.notNull ? " · NOT NULL" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SchemaPanel({ databaseId, ddl }: { databaseId: string; ddl: string }) {
  const [sema, setSema] = useState<TabloSemasi[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let iptalEdildi = false;

    openFreshDb(databaseId, ddl)
      .then((db) => {
        try {
          if (!iptalEdildi) setSema(getTableSchema(db));
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
  }, [databaseId, ddl]);

  if (hata) {
    return <p className="text-sm text-red-600 dark:text-red-400">Şema yüklenemedi: {hata}</p>;
  }

  if (!sema) {
    return <p className="text-sm text-zinc-400">Şema yükleniyor…</p>;
  }

  return <SchemaList sema={sema} />;
}
