import type { SampleDatabase } from "@/types/content";
import { eticaretDb } from "./eticaret";

const TUM_VERITABANLARI: SampleDatabase[] = [eticaretDb];

export function getSampleDatabase(id: string): SampleDatabase {
  const db = TUM_VERITABANLARI.find((v) => v.id === id);
  if (!db) {
    throw new Error(`"${id}" adında bir örnek veritabanı bulunamadı.`);
  }
  return db;
}
