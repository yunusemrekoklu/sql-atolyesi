import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const tekrarKargoOperasyonu = defineLesson({
  slug: "tekrar-kargo-operasyonu",
  uniteId: 5,
  dersNo: "5.T",
  baslik: "Tekrar: Kargo Operasyonu",
  veritabaniId: kargoDb.id,
  anlatim: `
Ünite 5'i tamamladın! \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`CREATE TABLE\`, \`ALTER TABLE\` — hepsini \`kargo\` veritabanı üzerinde, karma bir operasyon senaryosunda pekiştireceksin.

## Hatırlatma: her zaman WHERE'ini kontrol et

\`UPDATE\` ve \`DELETE\`'te \`WHERE\` unutulursa tüm tablo etkilenir. Aşağıdaki alıştırmaları çözerken, her \`WHERE\` koşulunu yazmadan önce "bu koşulu sağlayan satırlar hangileri?" diye kendine sor.
`,
  ornekler: [
    { aciklama: "Yeni bir şube ekle:", sql: "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01');" },
  ],
  onizlemeTablolari: ["branches", "couriers", "shipments"],
  alistirmalar: [
    {
      id: "5-t-1",
      seviye: "Kolay",
      baslik: "Yeni Şube (Tekrar)",
      soru: "branches tablosuna branch_id=7, branch_name='Yıldırım Şube', city='Bursa', opening_date='2025-05-01' değerleriyle yeni bir satır ekle.",
      ipucu: "INSERT INTO branches (...) VALUES (...); kalıbını kullanabilirsin (Ders 5.1).",
      cozumSql: "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-2",
      seviye: "Kolay",
      baslik: "Araç Güncelleme (Tekrar)",
      soru: "courier_id'si 1 olan kuryenin vehicle_type'ını 'Kamyonet' yap.",
      ipucu: "UPDATE couriers SET vehicle_type = 'Kamyonet' WHERE courier_id = 1; kalıbını kullanabilirsin (Ders 5.2).",
      cozumSql: "UPDATE couriers SET vehicle_type = 'Kamyonet' WHERE courier_id = 1;",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-3",
      seviye: "Orta",
      baslik: "İptalleri Temizle (Tekrar)",
      soru: "status'ü 'İptal' olan tüm gönderileri sil.",
      ipucu: "DELETE FROM shipments WHERE status = 'İptal'; kalıbını kullanabilirsin (Ders 5.3).",
      cozumSql: "DELETE FROM shipments WHERE status = 'İptal';",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-4",
      seviye: "Orta",
      baslik: "Not Sütunu Ekle",
      soru: "shipments tablosuna 'notes' adında TEXT tipinde yeni bir sütun ekle.",
      ipucu: "ALTER TABLE shipments ADD COLUMN notes TEXT; kalıbını kullanabilirsin (Ders 5.5).",
      cozumSql: "ALTER TABLE shipments ADD COLUMN notes TEXT;",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-5",
      seviye: "Zor",
      baslik: "Gönderi Kaydı Tablosu",
      soru: "'shipment_logs' adında bir tablo oluştur: log_id (INTEGER PRIMARY KEY AUTOINCREMENT), shipment_id (INTEGER NOT NULL, REFERENCES shipments(shipment_id)), note (TEXT NOT NULL), logged_at (TEXT NOT NULL).",
      ipucu: "Ders 5.4'teki complaints örneğine benzer bir CREATE TABLE yaz.",
      cozumSql:
        "CREATE TABLE shipment_logs (log_id INTEGER PRIMARY KEY AUTOINCREMENT, shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id), note TEXT NOT NULL, logged_at TEXT NOT NULL);",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-6",
      seviye: "Zor",
      baslik: "Yeni Şube ve İlk Kuryesi",
      soru: "Aynı sorguda iki INSERT yaz: önce branch_id=7, branch_name='Yıldırım Şube', city='Bursa', opening_date='2025-05-01' değerleriyle yeni bir şube ekle; sonra courier_id=13, full_name='Deniz Aydın', branch_id=7, vehicle_type='Motosiklet', hire_date='2025-06-01' değerleriyle bu şubeye bir kurye ekle.",
      ipucu: "İki INSERT ifadesini noktalı virgülle ayırarak yaz.",
      cozumSql:
        "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01'); INSERT INTO couriers (courier_id, full_name, branch_id, vehicle_type, hire_date) VALUES (13, 'Deniz Aydın', 7, 'Motosiklet', '2025-06-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-t-7",
      seviye: "Zor",
      baslik: "Bekleyenleri Ağırlıkla Güncelle",
      soru: "status'ü 'Beklemede' olan tüm gönderilerin status'ünü 'Yolda' yap VE weight_kg değerlerini 0.1 artır (tek UPDATE'te iki kolonu birden güncelle).",
      ipucu: "SET status = 'Yolda', weight_kg = weight_kg + 0.1 WHERE status = 'Beklemede'; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE shipments SET status = 'Yolda', weight_kg = weight_kg + 0.1 WHERE status = 'Beklemede';",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-t-q1",
      soru: "INSERT, UPDATE ve DELETE arasında en sık yapılan ve en tehlikeli hata hangisidir?",
      secenekler: [
        "INSERT'te kolon listesi yazmayı unutmak",
        "UPDATE veya DELETE'te WHERE koşulunu unutmak — bu tüm tabloyu etkiler",
        "DELETE'te WHERE koşulu eklemek",
        "CREATE TABLE'da PRIMARY KEY tanımlamak",
      ],
      dogruIndex: 1,
      aciklama: "WHERE'siz bir UPDATE ya da DELETE, tablodaki her satırı etkiler — bu, gerçek dünyada en yıkıcı SQL hatalarından biridir.",
    },
    {
      id: "5-t-q2",
      soru: "DROP TABLE ile DELETE FROM tablo; arasındaki fark nedir?",
      secenekler: [
        "Aralarında fark yoktur",
        "DROP TABLE tabloyu yapısıyla tamamen siler; DELETE FROM sadece satırları siler, tablo yapısı kalır",
        "DELETE FROM her zaman daha hızlıdır",
        "DROP TABLE sadece görünümleri (VIEW) siler",
      ],
      dogruIndex: 1,
      aciklama: "DROP TABLE, tabloyu (sütunları, kısıtları) tamamen ortadan kaldırır; DELETE FROM sadece satırları siler ve tablo yapısını korur.",
    },
    {
      id: "5-t-q3",
      soru: "Bir VIEW ile bir INDEX'in amacı arasındaki temel fark nedir?",
      secenekler: [
        "İkisi de aynı işi yapar",
        "VIEW bir sorguya kalıcı isim verir (kolaylık); INDEX arama/filtreleme performansını artırır (hız)",
        "VIEW veriyi hızlandırır, INDEX sorguları kolaylaştırır",
        "İkisi de sadece CREATE TABLE ile birlikte kullanılabilir",
      ],
      dogruIndex: 1,
      aciklama: "VIEW, karmaşık ya da sık kullanılan bir sorguyu isimlendirip yeniden kullanmanı sağlar; INDEX ise belirli sütunlardaki aramaları hızlandırmaya yöneliktir.",
    },
    {
      id: "5-t-q4",
      soru: "Kullanıcı girdisini doğrudan SQL metnine birleştirmek neden tehlikelidir?",
      secenekler: [
        "Tehlikeli değildir, yaygın ve güvenli bir uygulamadır",
        "Kullanıcı, ' OR '1'='1 gibi bir girdiyle sorgunun mantığını değiştirip yetkisiz veriye erişebilir (SQL injection)",
        "Sadece sorguyu yavaşlatır",
        "Sadece sayısal sütunlarda sorun yaratır",
      ],
      dogruIndex: 1,
      aciklama: "Bu, SQL injection'ın temelidir — kullanıcı girdisi, parametreli sorgular yerine ham metin olarak birleştirilirse SQL kodu gibi yorumlanabilir.",
    },
    {
      id: "5-t-q5",
      soru: "CREATE TABLE'da bir sütuna DEFAULT değeri vermenin faydası nedir?",
      secenekler: [
        "O sütun için değer belirtilmediğinde otomatik olarak kullanılacak bir değer tanımlar",
        "Sütunun asla NULL olamayacağını garanti eder (NOT NULL ile aynıdır)",
        "Sütunun benzersiz olmasını sağlar (UNIQUE ile aynıdır)",
        "Hiçbir pratik faydası yoktur",
      ],
      dogruIndex: 0,
      aciklama: "DEFAULT, INSERT sırasında o sütun için açıkça bir değer verilmediğinde kullanılacak varsayılan değeri belirler.",
    },
  ],
});
