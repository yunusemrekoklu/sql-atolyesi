import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const createTableVeKisitlar = defineLesson({
  slug: "create-table-ve-kisitlar",
  uniteId: 5,
  dersNo: "5.4",
  baslik: "CREATE TABLE ve Kısıtlar",
  veritabaniId: kargoDb.id,
  anlatim: `
Şimdiye kadar hep hazır tablolarla çalıştın. \`CREATE TABLE\`, sıfırdan yeni bir tablo tanımlamanı sağlar — sütunlarını, tiplerini ve **kısıtlarını (constraints)** belirleyerek.

## Temel söz dizimi

\`\`\`sql
CREATE TABLE complaints (
  complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
  shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id),
  subject TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Orta' CHECK (priority IN ('Düşük', 'Orta', 'Yüksek')),
  created_at TEXT NOT NULL
);
\`\`\`

## Kısıtlar (constraints)

- **\`PRIMARY KEY\`**: satırı benzersiz tanımlayan sütun (Ünite 3.1'den hatırlıyorsun).
- **\`NOT NULL\`**: bu sütun asla \`NULL\` olamaz — değer girilmeden satır eklenemez.
- **\`UNIQUE\`**: bu sütunda aynı değer birden fazla satırda tekrar edemez (PRIMARY KEY olmasa bile).
- **\`DEFAULT <değer>\`**: bu sütun için değer belirtilmezse otomatik olarak kullanılacak değer.
- **\`CHECK (<koşul>)\`**: bu sütuna yalnızca koşulu sağlayan değerlerin girilmesine izin verir — \`priority\` örneğinde sadece üç değerden birine izin veriliyor.
- **\`REFERENCES <tablo>(<kolon>)\`**: Foreign Key — bu sütunun başka bir tabloya işaret ettiğini belirtir (Ünite 3.1).

## AUTOINCREMENT

SQLite'ta \`INTEGER PRIMARY KEY\` zaten otomatik olarak artan bir değerdir (sen belirtmesen bile). \`AUTOINCREMENT\` eklemek, bu değerin **asla tekrar kullanılmamasını** garanti eder (bir satır silinse bile o ID bir daha verilmez) — çoğu senaryoda gerekli değildir ama garanti istediğinde kullanılır. Diğer veritabanlarında (MySQL) benzer işi \`AUTO_INCREMENT\` (alt çizgili) yapar — söz dizimi farklıdır ama amaç aynıdır.
`,
  ornekler: [
    { aciklama: "Şikayetleri tutan yeni bir tablo oluştur:", sql: "CREATE TABLE complaints (complaint_id INTEGER PRIMARY KEY AUTOINCREMENT, shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id), subject TEXT NOT NULL, created_at TEXT NOT NULL);" },
  ],
  onizlemeTablolari: ["shipments"],
  alistirmalar: [
    {
      id: "5-4-1",
      seviye: "Kolay",
      baslik: "Değerlendirme Tablosu",
      soru: "'reviews' adında bir tablo oluştur: review_id (INTEGER PRIMARY KEY), shipment_id (INTEGER NOT NULL), rating (INTEGER NOT NULL), comment (TEXT).",
      ipucu: "CREATE TABLE reviews (review_id INTEGER PRIMARY KEY, shipment_id INTEGER NOT NULL, rating INTEGER NOT NULL, comment TEXT); kalıbını kullanabilirsin.",
      cozumSql: "CREATE TABLE reviews (review_id INTEGER PRIMARY KEY, shipment_id INTEGER NOT NULL, rating INTEGER NOT NULL, comment TEXT);",
      mod: "tabloDurumu",
    },
    {
      id: "5-4-2",
      seviye: "Orta",
      baslik: "Şikayet Tablosu",
      soru: "'complaints' adında bir tablo oluştur: complaint_id (INTEGER PRIMARY KEY AUTOINCREMENT), shipment_id (INTEGER NOT NULL, REFERENCES shipments(shipment_id)), subject (TEXT NOT NULL), created_at (TEXT NOT NULL).",
      ipucu: "Ders anlatımındaki complaints örneğini (priority ve CHECK olmadan) temel alabilirsin.",
      cozumSql:
        "CREATE TABLE complaints (complaint_id INTEGER PRIMARY KEY AUTOINCREMENT, shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id), subject TEXT NOT NULL, created_at TEXT NOT NULL);",
      mod: "tabloDurumu",
    },
    {
      id: "5-4-3",
      seviye: "Orta",
      baslik: "DEFAULT Kullanımı",
      soru: "'vehicle_inspections' adında bir tablo oluştur: inspection_id (INTEGER PRIMARY KEY), courier_id (INTEGER NOT NULL), inspection_date (TEXT NOT NULL), passed (INTEGER NOT NULL, varsayılan değeri 1).",
      ipucu: "passed INTEGER NOT NULL DEFAULT 1 kalıbını kullanabilirsin.",
      cozumSql:
        "CREATE TABLE vehicle_inspections (inspection_id INTEGER PRIMARY KEY, courier_id INTEGER NOT NULL, inspection_date TEXT NOT NULL, passed INTEGER NOT NULL DEFAULT 1);",
      mod: "tabloDurumu",
    },
    {
      id: "5-4-4",
      seviye: "Zor",
      baslik: "CHECK Kısıtı",
      soru: "'ratings' adında bir tablo oluştur: rating_id (INTEGER PRIMARY KEY), shipment_id (INTEGER NOT NULL), score (INTEGER NOT NULL, sadece 1 ile 5 arasında değer alabilmeli).",
      ipucu: "score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5) kalıbını kullanabilirsin.",
      cozumSql: "CREATE TABLE ratings (rating_id INTEGER PRIMARY KEY, shipment_id INTEGER NOT NULL, score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5));",
      mod: "tabloDurumu",
    },
    {
      id: "5-4-5",
      seviye: "Zor",
      baslik: "UNIQUE Kısıtı",
      soru: "'branch_codes' adında bir tablo oluştur: branch_id (INTEGER NOT NULL), code (TEXT NOT NULL, benzersiz olmalı — hiçbir iki satırda aynı code değeri tekrar edemez).",
      ipucu: "code TEXT NOT NULL UNIQUE kalıbını kullanabilirsin.",
      cozumSql: "CREATE TABLE branch_codes (branch_id INTEGER NOT NULL, code TEXT NOT NULL UNIQUE);",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-4-q1",
      soru: "NOT NULL kısıtı ne yapar?",
      secenekler: [
        "Sütunun her zaman 0 olmasını sağlar",
        "O sütuna değer girilmeden satır eklenmesini engeller",
        "Sütunun benzersiz olmasını garanti eder",
        "Sütunu otomatik olarak artırır",
      ],
      dogruIndex: 1,
      aciklama: "NOT NULL, bir sütunun asla NULL (boş) olamayacağını belirtir; değer verilmeden satır eklenemez.",
    },
    {
      id: "5-4-q2",
      soru: "CHECK (score BETWEEN 1 AND 5) kısıtı ne işe yarar?",
      secenekler: [
        "score sütununun sadece 1 ile 5 arasında değer almasını zorunlu kılar",
        "score sütununu otomatik olarak 1 yapar",
        "score sütununu siler",
        "Hiçbir işlevi yoktur, sadece dokümantasyon amaçlıdır",
      ],
      dogruIndex: 0,
      aciklama: "CHECK, belirtilen koşulu sağlamayan değerlerin o sütuna girilmesini SQL seviyesinde engeller.",
    },
    {
      id: "5-4-q3",
      soru: "UNIQUE ile PRIMARY KEY arasındaki fark nedir?",
      secenekler: [
        "Aralarında hiçbir fark yoktur",
        "Bir tabloda birden fazla UNIQUE sütun olabilir, ama genelde tek bir PRIMARY KEY olur; PK ayrıca satırı tanımlamak için kullanılır",
        "UNIQUE, sadece metin sütunlarında kullanılabilir",
        "PRIMARY KEY, NULL değerlere izin verir ama UNIQUE vermez",
      ],
      dogruIndex: 1,
      aciklama: "PRIMARY KEY bir satırı benzersiz şekilde tanımlamak için kullanılan özel bir kısıttır; UNIQUE ise herhangi bir sütunun (PK olmasa bile) tekrar etmemesini sağlar ve bir tabloda birden fazla UNIQUE sütun olabilir.",
    },
    {
      id: "5-4-q4",
      soru: "SQLite'ta INTEGER PRIMARY KEY sütununa AUTOINCREMENT eklemenin farkı nedir?",
      secenekler: [
        "AUTOINCREMENT olmadan otomatik artan değer hiç çalışmaz",
        "INTEGER PRIMARY KEY zaten otomatik artar; AUTOINCREMENT ek olarak silinen ID'lerin asla tekrar kullanılmamasını garanti eder",
        "AUTOINCREMENT, sütunu TEXT tipine çevirir",
        "İkisi arasında teknik olarak hiçbir fark yoktur",
      ],
      dogruIndex: 1,
      aciklama: "SQLite'ta INTEGER PRIMARY KEY zaten otomatik artan bir rowid'dir; AUTOINCREMENT, silinen ID'lerin yeniden kullanılmamasını garanti eden ek bir güvencedir.",
    },
  ],
});
