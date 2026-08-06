import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const alterVeDrop = defineLesson({
  slug: "alter-ve-drop",
  uniteId: 5,
  dersNo: "5.5",
  baslik: "ALTER ve DROP",
  veritabaniId: kargoDb.id,
  anlatim: `
Bir tablo zaten oluşturulduktan sonra bile yapısını değiştirebilirsin — sütun ekleyebilir, silebilir, tabloyu yeniden adlandırabilir ya da tamamen kaldırabilirsin.

## Sütun ekleme

\`\`\`sql
ALTER TABLE couriers ADD COLUMN phone TEXT;
\`\`\`

Yeni eklenen sütun, tablodaki **var olan tüm satırlar** için \`NULL\` (ya da bir \`DEFAULT\` belirttiysen o değer) ile başlar.

## Sütun silme

\`\`\`sql
ALTER TABLE shipments DROP COLUMN destination_city;
\`\`\`

Bu, sütunu ve içindeki tüm veriyi kalıcı olarak kaldırır.

## Tabloyu yeniden adlandırma

\`\`\`sql
ALTER TABLE couriers RENAME TO delivery_staff;
\`\`\`

## DROP TABLE: geri dönüşü olmayan işlem

\`\`\`sql
DROP TABLE shipments;
\`\`\`

\`DROP TABLE\`, tabloyu **yapısıyla ve tüm verisiyle birlikte** tamamen siler. Bir önceki derste gördüğün \`DELETE FROM tablo;\` sadece satırları siler, tablo boş da olsa yapısı kalır — \`DROP TABLE\`'dan sonra ise tablo diye bir şey **hiç yokmuş** gibi olur. Gerçek bir veritabanında bu komutu çalıştırmadan önce mutlaka bir kez daha düşün.
`,
  ornekler: [
    { aciklama: "couriers tablosuna telefon sütunu ekle:", sql: "ALTER TABLE couriers ADD COLUMN phone TEXT;" },
  ],
  onizlemeTablolari: ["couriers", "branches"],
  alistirmalar: [
    {
      id: "5-5-1",
      seviye: "Kolay",
      baslik: "Telefon Sütunu Ekle",
      soru: "couriers tablosuna 'phone' adında TEXT tipinde yeni bir sütun ekleyen bir sorgu yaz.",
      ipucu: "ALTER TABLE couriers ADD COLUMN phone TEXT; kalıbını kullanabilirsin.",
      cozumSql: "ALTER TABLE couriers ADD COLUMN phone TEXT;",
      mod: "tabloDurumu",
    },
    {
      id: "5-5-2",
      seviye: "Kolay",
      baslik: "Bölge Sütunu Ekle",
      soru: "branches tablosuna 'region' adında TEXT tipinde yeni bir sütun ekleyen bir sorgu yaz.",
      ipucu: "ALTER TABLE branches ADD COLUMN region TEXT; kalıbını kullanabilirsin.",
      cozumSql: "ALTER TABLE branches ADD COLUMN region TEXT;",
      mod: "tabloDurumu",
    },
    {
      id: "5-5-3",
      seviye: "Orta",
      baslik: "Gereksiz Sütunu Sil",
      soru: "shipments tablosundan 'destination_city' sütununu kaldıran bir sorgu yaz.",
      ipucu: "ALTER TABLE shipments DROP COLUMN destination_city; kalıbını kullanabilirsin.",
      cozumSql: "ALTER TABLE shipments DROP COLUMN destination_city;",
      mod: "tabloDurumu",
    },
    {
      id: "5-5-4",
      seviye: "Orta",
      baslik: "Tabloyu Yeniden Adlandır",
      soru: "couriers tablosunun adını 'delivery_staff' olarak değiştiren bir sorgu yaz.",
      ipucu: "ALTER TABLE couriers RENAME TO delivery_staff; kalıbını kullanabilirsin.",
      cozumSql: "ALTER TABLE couriers RENAME TO delivery_staff;",
      mod: "tabloDurumu",
    },
    {
      id: "5-5-5",
      seviye: "Zor",
      baslik: "Ekle ve Doldur",
      soru: "branches tablosuna 'phone' adında TEXT bir sütun ekle, SONRA tüm satırlarda bu sütunu '0212 000 00 00' değeriyle doldur (iki ayrı ifade, aynı sorguda).",
      ipucu: "Önce ALTER TABLE branches ADD COLUMN phone TEXT; sonra UPDATE branches SET phone = '0212 000 00 00'; yaz — ikisini noktalı virgülle ayır.",
      cozumSql: "ALTER TABLE branches ADD COLUMN phone TEXT; UPDATE branches SET phone = '0212 000 00 00';",
      mod: "tabloDurumu",
    },
    {
      id: "5-5-6",
      seviye: "Zor",
      baslik: "Tabloyu Tamamen Sil",
      soru: "shipments tablosunu yapısıyla ve tüm verisiyle birlikte tamamen silen bir sorgu yaz.",
      ipucu: "DROP TABLE shipments; kalıbını kullanabilirsin.",
      cozumSql: "DROP TABLE shipments;",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-5-q1",
      soru: "ALTER TABLE couriers ADD COLUMN phone TEXT; çalıştırdığında, var olan satırlardaki phone değeri ne olur?",
      secenekler: [
        "Boş metin ('')",
        "NULL (bir DEFAULT belirtilmediyse)",
        "0",
        "Sorgu hata verir, var olan satırlar güncellenemez",
      ],
      dogruIndex: 1,
      aciklama: "Yeni eklenen bir sütun, DEFAULT belirtilmediyse var olan tüm satırlarda NULL değeriyle başlar.",
    },
    {
      id: "5-5-q2",
      soru: "DROP TABLE ile DELETE FROM tablo; (WHERE'siz) arasındaki fark nedir?",
      secenekler: [
        "Aralarında fark yoktur",
        "DROP TABLE, tabloyu yapısıyla birlikte tamamen siler; DELETE FROM sadece satırları siler, tablo yapısı kalır",
        "DELETE FROM, tabloyu tamamen siler; DROP TABLE sadece satırları siler",
        "DROP TABLE, geri alınabilir; DELETE FROM geri alınamaz",
      ],
      dogruIndex: 1,
      aciklama: "DROP TABLE tabloyu (sütunlar, kısıtlar dahil) tamamen ortadan kaldırır; DELETE FROM ise sadece satırları siler, boş da olsa tablo yapısı kalır.",
    },
    {
      id: "5-5-q3",
      soru: "Bir tabloyu yeniden adlandırmak için hangi komut kullanılır?",
      secenekler: [
        "RENAME TABLE eski_ad TO yeni_ad;",
        "ALTER TABLE eski_ad RENAME TO yeni_ad;",
        "UPDATE TABLE eski_ad SET name = yeni_ad;",
        "DROP TABLE eski_ad CREATE yeni_ad;",
      ],
      dogruIndex: 1,
      aciklama: "SQLite'ta bir tabloyu yeniden adlandırmak için ALTER TABLE eski_ad RENAME TO yeni_ad; kullanılır.",
    },
    {
      id: "5-5-q4",
      soru: "DROP TABLE çalıştırmadan önce neden dikkatli olunmalıdır?",
      secenekler: [
        "Çünkü bu işlem geri alınamaz — tablo, yapısı ve tüm verisiyle birlikte kalıcı olarak kaybolur",
        "Çünkü DROP TABLE her zaman hata verir",
        "Hiçbir özel dikkat gerekmez, DROP TABLE tamamen güvenlidir",
        "Çünkü DROP TABLE sadece test ortamlarında çalışır",
      ],
      dogruIndex: 0,
      aciklama: "DROP TABLE geri dönüşü olmayan bir işlemdir; gerçek bir veritabanında yanlışlıkla çalıştırmak, telafisi zor veri kayıplarına yol açabilir.",
    },
  ],
});
