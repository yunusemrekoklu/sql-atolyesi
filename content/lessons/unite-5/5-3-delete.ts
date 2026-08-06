import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const deleteLesson = defineLesson({
  slug: "delete",
  uniteId: 5,
  dersNo: "5.3",
  baslik: "DELETE",
  veritabaniId: kargoDb.id,
  anlatim: `
\`DELETE\`, tablodan satır siler. Mantığı \`UPDATE\`'e çok benzer — ama bir kolonu değiştirmek yerine **tüm satırı** kaldırır.

## Temel söz dizimi

\`\`\`sql
DELETE FROM shipments WHERE status = 'İptal';
\`\`\`

- \`DELETE FROM <tablo> WHERE <koşul>;\` — sadece koşulu sağlayan satırlar silinir.
- Aynı \`UPDATE\`'teki gibi: \`WHERE\` yazmazsan, tablodaki **her satır** silinir. Çalıştırmadan önce mutlaka aynı \`WHERE\` ile bir \`SELECT\` deneyerek hangi satırların etkileneceğini gör.

## DELETE, DROP TABLE ve TRUNCATE farkı

Üçü de "veriyi kaldırma" ile ilgili ama çok farklı şeyler yaparlar:

- **\`DELETE FROM tablo WHERE ...\`**: sadece koşulu sağlayan **satırları** siler. Tablo, yapısıyla birlikte olduğu gibi kalır.
- **\`DELETE FROM tablo;\`** (WHERE'siz): tablodaki **tüm satırları** siler ama tablonun kendisi (sütunları, kısıtları) yerinde durur.
- **\`DROP TABLE tablo;\`**: tabloyu **yapısıyla birlikte tamamen** siler — bir sonraki derste (5.5) göreceksin. Geri dönüşü yoktur.
- **\`TRUNCATE TABLE\`**: MySQL ve PostgreSQL gibi veritabanlarında tüm satırları hızlıca silmek için kullanılan ayrı bir komuttur. **SQLite'ta \`TRUNCATE\` yoktur** — aynı işi \`WHERE\`'siz \`DELETE FROM tablo;\` görür.
`,
  ornekler: [
    { aciklama: "İptal edilmiş gönderileri sil:", sql: "DELETE FROM shipments WHERE status = 'İptal';" },
  ],
  onizlemeTablolari: ["shipments", "couriers"],
  alistirmalar: [
    {
      id: "5-3-1",
      seviye: "Kolay",
      baslik: "İptalleri Temizle",
      soru: "status'ü 'İptal' olan tüm gönderileri silen bir sorgu yaz.",
      ipucu: "DELETE FROM shipments WHERE status = 'İptal'; kalıbını kullanabilirsin.",
      cozumSql: "DELETE FROM shipments WHERE status = 'İptal';",
      mod: "tabloDurumu",
    },
    {
      id: "5-3-2",
      seviye: "Kolay",
      baslik: "Bir Kuryeyi Sil",
      soru: "courier_id'si 12 olan kuryeyi (hiç gönderisi olmayan Nur Gündüz) silen bir sorgu yaz.",
      ipucu: "DELETE FROM couriers WHERE courier_id = 12; kalıbını kullanabilirsin.",
      cozumSql: "DELETE FROM couriers WHERE courier_id = 12;",
      mod: "tabloDurumu",
    },
    {
      id: "5-3-3",
      seviye: "Orta",
      baslik: "Hafif Gönderileri Sil",
      soru: "weight_kg'si 1'den küçük olan gönderileri silen bir sorgu yaz.",
      ipucu: "DELETE FROM shipments WHERE weight_kg < 1; kalıbını kullanabilirsin.",
      cozumSql: "DELETE FROM shipments WHERE weight_kg < 1;",
      mod: "tabloDurumu",
    },
    {
      id: "5-3-4",
      seviye: "Orta",
      baslik: "Eski Kuryeleri Sil",
      soru: "hire_date'i '2022-01-01' tarihinden ÖNCE olan kuryeleri silen bir sorgu yaz.",
      ipucu: "DELETE FROM couriers WHERE hire_date < '2022-01-01'; kalıbını kullanabilirsin — ISO tarih metinleri alfabetik olarak da doğru sıralanır.",
      cozumSql: "DELETE FROM couriers WHERE hire_date < '2022-01-01';",
      mod: "tabloDurumu",
    },
    {
      id: "5-3-5",
      seviye: "Zor",
      baslik: "Ağır ve Teslim Edilmemiş Gönderiler",
      soru: "status'ü 'Teslim Edildi' OLMAYAN VE weight_kg'si 4'ten büyük olan gönderileri silen bir sorgu yaz.",
      ipucu: "WHERE status != 'Teslim Edildi' AND weight_kg > 4; kalıbını kullanabilirsin.",
      cozumSql: "DELETE FROM shipments WHERE status != 'Teslim Edildi' AND weight_kg > 4;",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-3-q1",
      soru: "DELETE FROM shipments; (WHERE'siz) çalıştırırsan ne olur?",
      secenekler: [
        "Hiçbir şey silinmez",
        "shipments tablosundaki tüm satırlar silinir ama tablonun kendisi (sütunları) kalır",
        "shipments tablosu, yapısıyla birlikte tamamen silinir",
        "Sadece bir satır silinir",
      ],
      dogruIndex: 1,
      aciklama: "WHERE'siz DELETE, tüm satırları siler ama tablo tanımı (sütunlar, kısıtlar) yerinde kalır — DROP TABLE'dan farkı budur.",
    },
    {
      id: "5-3-q2",
      soru: "DELETE FROM tablo WHERE koşul; ile DROP TABLE tablo; arasındaki temel fark nedir?",
      secenekler: [
        "Aralarında fark yoktur, ikisi de aynı şeyi yapar",
        "DELETE sadece koşulu sağlayan satırları siler (tablo kalır); DROP TABLE tüm tabloyu yapısıyla siler",
        "DROP TABLE sadece verileri siler, tabloyu korur",
        "DELETE, WHERE olmadan hiç çalışmaz",
      ],
      dogruIndex: 1,
      aciklama: "DELETE satır düzeyinde çalışır ve tablo yapısını korur; DROP TABLE ise tabloyu (sütunları ve verisiyle) tamamen ortadan kaldırır.",
    },
    {
      id: "5-3-q3",
      soru: "SQLite'ta TRUNCATE TABLE komutu var mıdır?",
      secenekler: [
        "Evet, MySQL ile birebir aynı şekilde çalışır",
        "Hayır — SQLite'ta bu komut yoktur; aynı işi WHERE'siz DELETE FROM tablo; görür",
        "Evet ama sadece INTEGER PRIMARY KEY olan tablolarda",
        "Hayır, SQLite'ta hiçbir veri silinemez",
      ],
      dogruIndex: 1,
      aciklama: "TRUNCATE, MySQL/PostgreSQL gibi veritabanlarına özgüdür; SQLite'ta yoktur, WHERE'siz DELETE aynı sonucu verir.",
    },
    {
      id: "5-3-q4",
      soru: "Bir DELETE çalıştırmadan önce en güvenli alışkanlık nedir?",
      secenekler: [
        "Doğrudan çalıştırıp sonucu umursamamak",
        "Aynı WHERE koşuluyla önce bir SELECT çalıştırıp hangi satırların silineceğini görmek",
        "Her zaman WHERE'i atlamak",
        "Tabloyu önce DROP edip yeniden oluşturmak",
      ],
      dogruIndex: 1,
      aciklama: "Aynı WHERE koşuluyla SELECT çalıştırmak, DELETE'in tam olarak hangi satırları etkileyeceğini geri dönüşü olmayan bir işlemden önce görmeni sağlar.",
    },
  ],
});
