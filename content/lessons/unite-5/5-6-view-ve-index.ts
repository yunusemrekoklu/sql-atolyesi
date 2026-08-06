import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const viewVeIndex = defineLesson({
  slug: "view-ve-index",
  uniteId: 5,
  dersNo: "5.6",
  baslik: "VIEW ve INDEX",
  veritabaniId: kargoDb.id,
  anlatim: `
Bu derste iki farklı amaca hizmet eden iki yapıyı tanıyacaksın: \`VIEW\` (sorguları kolaylaştırır) ve \`INDEX\` (sorguları hızlandırır).

## VIEW: kalıcı isimli bir sorgu

\`\`\`sql
CREATE VIEW active_shipments AS
SELECT * FROM shipments WHERE status IN ('Yolda', 'Beklemede');
\`\`\`

\`VIEW\`, bir \`SELECT\` sorgusuna kalıcı bir isim veren **sanal bir tablo**dur — veriyi kopyalamaz; \`active_shipments\`'ı her sorguladığında, altındaki \`SELECT\` o an yeniden çalışır. Sık kullandığın ya da karmaşık bir sorguyu bir kez yazıp, sonrasında sanki bir tabloymuş gibi kullanmanı sağlar:

\`\`\`sql
SELECT * FROM active_shipments WHERE weight_kg > 3;
\`\`\`

## INDEX: arama hızlandırıcı

\`\`\`sql
CREATE INDEX idx_shipments_courier ON shipments(courier_id);
\`\`\`

\`INDEX\`, bir kitabın sonundaki dizin gibi düşünülebilir — belirli bir sütunda arama, filtreleme ya da \`JOIN\` yaparken veritabanının tüm tabloyu satır satır taramak yerine doğrudan ilgili satırlara atlamasını sağlar. Sık \`WHERE\`'lenen ya da \`JOIN\` koşullarında kullanılan sütunlara index eklemek performansı ciddi şekilde artırabilir.

**Ama bedelsiz değil**: her \`INSERT\`/\`UPDATE\`/\`DELETE\`'te index'in de güncellenmesi gerekir, bu da yazma işlemlerini biraz yavaşlatır ve ekstra disk alanı kaplar. Bu yüzden her sütuna değil, gerçekten sık sorgulanan sütunlara index eklenir.

Bir index'in var olup olmadığını \`PRAGMA index_list('tablo_adi');\` ile kontrol edebilirsin.
`,
  ornekler: [
    { aciklama: "Aktif gönderileri gösteren bir view oluştur ve sorgula:", sql: "CREATE VIEW active_shipments AS SELECT * FROM shipments WHERE status IN ('Yolda', 'Beklemede'); SELECT * FROM active_shipments;" },
  ],
  onizlemeTablolari: ["shipments", "couriers"],
  alistirmalar: [
    {
      id: "5-6-1",
      seviye: "Kolay",
      baslik: "Aktif Gönderiler View'i",
      soru: "status'ü 'Yolda' veya 'Beklemede' olan gönderileri gösteren active_shipments adında bir VIEW oluştur, sonra bu view'den SELECT * ile tüm satırları getir (iki ifadeyi aynı sorguda, noktalı virgülle ayırarak yaz).",
      ipucu: "Önce CREATE VIEW active_shipments AS SELECT * FROM shipments WHERE status IN ('Yolda', 'Beklemede'); sonra SELECT * FROM active_shipments; yaz.",
      cozumSql: "CREATE VIEW active_shipments AS SELECT * FROM shipments WHERE status IN ('Yolda', 'Beklemede'); SELECT * FROM active_shipments;",
      mod: "sonuc",
    },
    {
      id: "5-6-2",
      seviye: "Orta",
      baslik: "Kurye Özet View'i",
      soru: "Her kuryenin full_name'ini ve toplam gönderi sayısını (gonderi_sayisi olarak) gösteren courier_summary adında bir VIEW oluştur, sonra bu view'den SELECT * ile sonucu getir.",
      ipucu: "VIEW'in içindeki SELECT'te couriers'ı shipments'a LEFT JOIN'le, GROUP BY ile grupla, COUNT ile say.",
      cozumSql:
        "CREATE VIEW courier_summary AS SELECT c.full_name, COUNT(s.shipment_id) AS gonderi_sayisi FROM couriers c LEFT JOIN shipments s ON c.courier_id = s.courier_id GROUP BY c.courier_id; SELECT * FROM courier_summary;",
      mod: "sonuc",
    },
    {
      id: "5-6-3",
      seviye: "Orta",
      baslik: "Şehir İndeksi",
      soru: "branches tablosunda city sütunu üzerinde idx_branches_city adında bir INDEX oluştur, sonra PRAGMA index_list('branches'); ile var olduğunu doğrula (iki ifadeyi aynı sorguda yaz).",
      ipucu: "CREATE INDEX idx_branches_city ON branches(city); sonra PRAGMA index_list('branches'); yaz.",
      cozumSql: "CREATE INDEX idx_branches_city ON branches(city); PRAGMA index_list('branches');",
      mod: "sonuc",
    },
    {
      id: "5-6-4",
      seviye: "Zor",
      baslik: "Kurye İndeksi",
      soru: "shipments tablosunda courier_id sütunu üzerinde idx_shipments_courier adında bir INDEX oluştur, sonra PRAGMA index_list('shipments'); ile kontrol et.",
      ipucu: "CREATE INDEX idx_shipments_courier ON shipments(courier_id); sonra PRAGMA index_list('shipments'); yaz.",
      cozumSql: "CREATE INDEX idx_shipments_courier ON shipments(courier_id); PRAGMA index_list('shipments');",
      mod: "sonuc",
    },
    {
      id: "5-6-5",
      seviye: "Zor",
      baslik: "Ağır Gönderiler View'i",
      soru: "weight_kg'si 4'ten büyük olan gönderileri gösteren high_weight_shipments adında bir VIEW oluştur; sonra bu view'i sanki normal bir tabloymuş gibi sorgulayıp, sadece status'ü 'Teslim Edildi' olanları getir.",
      ipucu: "Önce CREATE VIEW high_weight_shipments AS SELECT * FROM shipments WHERE weight_kg > 4; sonra SELECT * FROM high_weight_shipments WHERE status = 'Teslim Edildi'; yaz.",
      cozumSql:
        "CREATE VIEW high_weight_shipments AS SELECT * FROM shipments WHERE weight_kg > 4; SELECT * FROM high_weight_shipments WHERE status = 'Teslim Edildi';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "5-6-q1",
      soru: "Bir VIEW, verideki değişiklikleri anlık olarak yansıtır mı?",
      secenekler: [
        "Hayır, VIEW oluşturulduğu andaki veriyi donmuş halde saklar",
        "Evet — VIEW veriyi kopyalamaz, sorgulandığında altındaki SELECT her seferinde yeniden çalışır",
        "Sadece günde bir kez günceller",
        "VIEW'ler hiçbir zaman güncel veri göstermez",
      ],
      dogruIndex: 1,
      aciklama: "VIEW, bir sorguya verilen kalıcı bir isimdir; veri kopyalamaz, her sorgulandığında altındaki SELECT anlık olarak yeniden çalışır.",
    },
    {
      id: "5-6-q2",
      soru: "INDEX'in temel amacı nedir?",
      secenekler: [
        "Veriyi yedeklemek",
        "Belirli sütunlarda arama/filtreleme/JOIN işlemlerini hızlandırmak",
        "Tabloya yeni sütun eklemek",
        "Verileri şifrelemek",
      ],
      dogruIndex: 1,
      aciklama: "INDEX, bir kitabın dizini gibi çalışarak veritabanının ilgili satırlara doğrudan atlamasını sağlar ve sorgu performansını artırır.",
    },
    {
      id: "5-6-q3",
      soru: "Her sütuna INDEX eklemek neden iyi bir fikir değildir?",
      secenekler: [
        "SQLite, birden fazla index'e izin vermez",
        "Her INDEX, INSERT/UPDATE/DELETE işlemlerini yavaşlatır ve ekstra disk alanı kaplar",
        "INDEX'ler otomatik olarak 24 saat sonra silinir",
        "INDEX eklemek SELECT sorgularını yavaşlatır",
      ],
      dogruIndex: 1,
      aciklama: "Her INDEX'in bir bakım maliyeti vardır — yazma işlemlerinde index de güncellenmesi gerekir; bu yüzden sadece sık sorgulanan sütunlara eklenir.",
    },
    {
      id: "5-6-q4",
      soru: "Bir tabloda hangi INDEX'lerin tanımlı olduğunu nasıl kontrol edebilirsin?",
      secenekler: [
        "SELECT * FROM indexes; ile",
        "PRAGMA index_list('tablo_adi'); ile",
        "SHOW INDEXES; ile",
        "Bunu kontrol etmenin bir yolu yoktur",
      ],
      dogruIndex: 1,
      aciklama: "SQLite'ta PRAGMA index_list('tablo_adi'); komutu, o tabloda tanımlı index'leri listeler.",
    },
  ],
});
