"use client";

import { useMemo, useState } from "react";
import type { FonksiyonKategorisi, FunctionRef } from "@/types/content";
import { getSampleDatabase } from "@/content/databases";
import { RunnableExample } from "@/components/sql/RunnableExample";
import { turkceIcerir } from "@/lib/search/turkce";

const KATEGORILER: readonly ("Tümü" | FonksiyonKategorisi)[] = [
  "Tümü",
  "Metin",
  "Sayısal",
  "Tarih",
  "NULL/Koşul",
  "Toplulaştırma",
];

export function FunctionExplorer({ fonksiyonlar }: { fonksiyonlar: FunctionRef[] }) {
  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState<(typeof KATEGORILER)[number]>("Tümü");

  const filtrelenmis = useMemo(() => {
    return fonksiyonlar.filter((fn) => {
      if (kategori !== "Tümü" && fn.kategori !== kategori) return false;
      return turkceIcerir(fn.ad, arama) || turkceIcerir(fn.aciklama, arama);
    });
  }, [fonksiyonlar, arama, kategori]);

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        placeholder="Fonksiyon ara… (ör. tarih, yuvarlama, birleştirme)"
        className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
        aria-label="Fonksiyon ara"
      />

      <div className="flex flex-wrap gap-2">
        {KATEGORILER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKategori(k)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              kategori === k
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">{filtrelenmis.length} fonksiyon</p>

      <div className="space-y-4">
        {filtrelenmis.map((fn) => {
          const veritabani = getSampleDatabase(fn.veritabaniId);
          return (
            <div key={fn.slug} id={fn.slug} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-lg font-semibold">{fn.ad}</h3>
                  {fn.oncelikli && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                      Öncelikli
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">{fn.kategori}</span>
              </div>
              <p className="mt-1 font-mono text-sm text-zinc-500 dark:text-zinc-400">{fn.sozDizimi}</p>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{fn.aciklama}</p>
              {fn.digerVeritabanlari && (
                <p className="mt-2 rounded-lg bg-blue-50 p-2 text-xs text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  {fn.digerVeritabanlari}
                </p>
              )}
              <div className="mt-3">
                <RunnableExample
                  databaseId={veritabani.id}
                  ddl={veritabani.ddl}
                  sql={fn.ornekSql}
                  aciklama={fn.ornekAciklama}
                />
              </div>
            </div>
          );
        })}
        {filtrelenmis.length === 0 && <p className="text-sm text-zinc-400">Eşleşen fonksiyon bulunamadı.</p>}
      </div>
    </div>
  );
}
