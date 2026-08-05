import type { SampleDatabase } from "@/types/content";
import { eticaretDb } from "./eticaret";
import { filmlerDb } from "./filmler";
import { sehirlerDb } from "./sehirler";

const TUM_VERITABANLARI: SampleDatabase[] = [eticaretDb, filmlerDb, sehirlerDb];

export function getSampleDatabase(id: string): SampleDatabase {
  const db = TUM_VERITABANLARI.find((v) => v.id === id);
  if (!db) {
    throw new Error(`"${id}" adında bir örnek veritabanı bulunamadı.`);
  }
  return db;
}
