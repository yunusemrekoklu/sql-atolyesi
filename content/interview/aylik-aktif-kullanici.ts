import { defineInterviewQuestion } from "@/types/content";

export const aylikAktifKullanici = defineInterviewQuestion({
  slug: "aylik-aktif-kullanici",
  seviye: "Orta",
  sirket: "Bir mobil uygulama şirketi",
  baslik: "Aylık Aktif Kullanıcı Sayısı",
  senaryo: `
Bir mobil uygulama şirketinde büyüme (growth) ekibindesin. Her ay kaç FARKLI kullanıcının uygulamayı açtığını (aylık aktif kullanıcı — MAU) görmek istiyorlar.

**Görev:** Her ay (\`YYYY-MM\` formatında) kaç farklı kullanıcının uygulamayı açtığını (\`ay\`, \`aktif_kullanici_sayisi\`) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE app_opens (
  open_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  opened_at TEXT NOT NULL
);

INSERT INTO app_opens (open_id, user_id, opened_at) VALUES
  (1, 1, '2025-01-05'),
  (2, 2, '2025-01-06'),
  (3, 1, '2025-01-20'),
  (4, 3, '2025-01-25'),
  (5, 1, '2025-02-02'),
  (6, 2, '2025-02-03'),
  (7, 4, '2025-02-10'),
  (8, 2, '2025-02-15'),
  (9, 5, '2025-02-20'),
  (10, 1, '2025-03-01'),
  (11, 3, '2025-03-05'),
  (12, 6, '2025-03-10'),
  (13, 6, '2025-03-15'),
  (14, 7, '2025-03-20');
`.trim(),
  onizlemeTablolari: ["app_opens"],
  ipuclari: [
    "Tarihten sadece yıl-ay kısmını almak için strftime('%Y-%m', opened_at) kullanabilirsin.",
    "Bu ifadeye göre GROUP BY yap.",
    "Aynı kullanıcının bir ayda birden çok kez açması iki kez sayılmasın diye COUNT(DISTINCT user_id) kullan (COUNT(*) değil).",
  ],
  cozumSql: "SELECT strftime('%Y-%m', opened_at) AS ay, COUNT(DISTINCT user_id) AS aktif_kullanici_sayisi FROM app_opens GROUP BY ay;",
  aciklama:
    "strftime('%Y-%m', opened_at), her tarihi ay bazında bir etikete indirger; GROUP BY ay ile aylara ayrılır, COUNT(DISTINCT user_id) ile her ayda kaç FARKLI kullanıcı olduğu (tekrar sayımı önlenerek) hesaplanır.",
  mod: "sonuc",
  takipSorusu: "Peki ya bir önceki aya göre aktif kullanıcı sayısındaki değişimi (artış/azalış) de göstermen istenseydi?",
  takipCevabi:
    "Önce bu sorguyu bir alt sorguda (ay, aktif_kullanici_sayisi) hesaplayıp, sonra LAG(aktif_kullanici_sayisi) OVER (ORDER BY ay) ile bir önceki ayın değerine erişip fark alabilirdin.",
});
