import { defineInterviewQuestion } from "@/types/content";

export const teslimEdilmemisSiparisler = defineInterviewQuestion({
  slug: "teslim-edilmemis-siparisler",
  seviye: "Kolay",
  sirket: "Bir hızlı kargo girişimi",
  baslik: "Teslim Edilmemiş Gönderiler",
  senaryo: `
Bir hızlı kargo girişiminde operasyon ekibi, teslim tarihi henüz girilmemiş (yani hâlâ yolda olan) gönderileri her sabah takip etmek istiyor.

**Görev:** \`delivered_at\`'i henüz girilmemiş (teslim edilmemiş) gönderilerin \`delivery_id\`, \`customer_name\` ve \`city\`'sini getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE deliveries (
  delivery_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  city TEXT NOT NULL,
  dispatched_at TEXT NOT NULL,
  delivered_at TEXT
);

INSERT INTO deliveries (delivery_id, customer_name, city, dispatched_at, delivered_at) VALUES
  (1, 'Ahmet Yıldız', 'İstanbul', '2025-03-01', '2025-03-03'),
  (2, 'Zeynep Kaya', 'Ankara', '2025-03-02', NULL),
  (3, 'Mehmet Demir', 'İzmir', '2025-03-02', '2025-03-04'),
  (4, 'Ayşe Şahin', 'Bursa', '2025-03-03', NULL),
  (5, 'Fatma Çelik', 'Antalya', '2025-03-03', '2025-03-05'),
  (6, 'Ali Aydın', 'Konya', '2025-03-04', NULL),
  (7, 'Elif Arslan', 'Adana', '2025-03-04', '2025-03-06'),
  (8, 'Mustafa Koç', 'Gaziantep', '2025-03-05', '2025-03-07'),
  (9, 'Hatice Er', 'Kayseri', '2025-03-05', NULL),
  (10, 'Hüseyin Bulut', 'Mersin', '2025-03-06', '2025-03-08'),
  (11, 'Emine Yavuz', 'Diyarbakır', '2025-03-06', NULL),
  (12, 'İbrahim Öz', 'Eskişehir', '2025-03-07', '2025-03-09');
`.trim(),
  onizlemeTablolari: ["deliveries"],
  ipuclari: [
    "NULL değerleri = operatörüyle karşılaştıramazsın, sonuç her zaman UNKNOWN olur.",
    "NULL kontrolü için özel bir operatör kullanman gerekiyor.",
    "WHERE delivered_at IS NULL kalıbını dene.",
  ],
  cozumSql: "SELECT delivery_id, customer_name, city FROM deliveries WHERE delivered_at IS NULL;",
  aciklama: "delivered_at NULL olan satırlar, henüz teslim edilmemiş gönderileri temsil eder; bunları bulmak için IS NULL kullanılır.",
  mod: "sonuc",
  takipSorusu: "Peki ya 5 günden uzun süredir teslim edilmemiş gönderileri bulman istenseydi?",
  takipCevabi:
    "dispatched_at ile bugünün tarihi arasındaki farkı hesaplaman gerekirdi, ör. julianday('now') - julianday(dispatched_at) > 5, delivered_at IS NULL koşuluyla birlikte AND ile kullanılırdı.",
});
