import type { Database, SqlValue } from "sql.js";

export interface TabloAnlikGorunum {
  ad: string;
  kolonlar: string[];
  satirlar: SqlValue[][];
}

export interface KolonSemasi {
  ad: string;
  tip: string;
  notNull: boolean;
  pk: boolean;
}

export interface TabloSemasi {
  ad: string;
  kolonlar: KolonSemasi[];
}

function kullanicininTablolari(db: Database): string[] {
  const sonuc = db.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;",
  );
  if (sonuc.length === 0) return [];
  return sonuc[0].values.map((satir) => String(satir[0]));
}

/**
 * Bir veritabanının tüm tablolarının tam içeriğini (grader'ın `tabloDurumu`
 * modunda kullanıcı/çözüm DB'lerini karşılaştırmak için) döndürür.
 */
export function getFullState(db: Database): TabloAnlikGorunum[] {
  return kullanicininTablolari(db).map((ad) => {
    const sonuc = db.exec(`SELECT * FROM "${ad}";`);
    const { columns, values } = sonuc[0] ?? { columns: [], values: [] };
    return { ad, kolonlar: columns, satirlar: values };
  });
}

/**
 * SchemaPanel için tabloların sütun bilgilerini (PRAGMA table_info) döndürür.
 */
export function getTableSchema(db: Database): TabloSemasi[] {
  return kullanicininTablolari(db).map((ad) => {
    const sonuc = db.exec(`PRAGMA table_info("${ad}");`);
    const { columns, values } = sonuc[0] ?? { columns: [], values: [] };
    const adIdx = columns.indexOf("name");
    const tipIdx = columns.indexOf("type");
    const notNullIdx = columns.indexOf("notnull");
    const pkIdx = columns.indexOf("pk");

    const kolonlar: KolonSemasi[] = values.map((satir) => ({
      ad: String(satir[adIdx]),
      tip: String(satir[tipIdx]),
      notNull: Number(satir[notNullIdx]) === 1,
      pk: Number(satir[pkIdx]) > 0,
    }));

    return { ad, kolonlar };
  });
}
