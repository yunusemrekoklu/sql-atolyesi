import type { Database } from "sql.js";
import { getSqlJs } from "./engine";

const anlikGoruntuOnbellegi = new Map<string, Promise<Uint8Array>>();

async function anlikGoruntuOlustur(ddl: string): Promise<Uint8Array> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();
  try {
    db.run(ddl);
    return db.export();
  } finally {
    db.close();
  }
}

/**
 * Bir veritabanının DDL'ini bir kez kurup dışa aktarılmış (Uint8Array)
 * anlık görüntüsünü önbellekte tutar. `databaseId` başına tek kurulum.
 */
function getAnlikGoruntu(databaseId: string, ddl: string): Promise<Uint8Array> {
  let anlikGoruntu = anlikGoruntuOnbellegi.get(databaseId);
  if (!anlikGoruntu) {
    anlikGoruntu = anlikGoruntuOlustur(ddl);
    anlikGoruntuOnbellegi.set(databaseId, anlikGoruntu);
  }
  return anlikGoruntu;
}

/**
 * Önbellekteki anlık görüntüden taze, bağımsız bir Database kopyası açar.
 * Kullanan taraf işi bitince `db.close()` çağırmalı (wasm heap sızıntısını
 * önlemek için) — bkz. `withFreshDb`.
 */
export async function openFreshDb(databaseId: string, ddl: string): Promise<Database> {
  const SQL = await getSqlJs();
  const anlikGoruntu = await getAnlikGoruntu(databaseId, ddl);
  return new SQL.Database(anlikGoruntu);
}

/**
 * Taze bir DB kopyası açar, `fn` içinde kullanılmasını sağlar ve iş bitince
 * (hata olsa da) veritabanını kapatır.
 */
export async function withFreshDb<T>(
  databaseId: string,
  ddl: string,
  fn: (db: Database) => T | Promise<T>,
): Promise<T> {
  const db = await openFreshDb(databaseId, ddl);
  try {
    return await fn(db);
  } finally {
    db.close();
  }
}
