import { defineInterviewQuestion } from "@/types/content";

export const ucGunlukYuruyenOrtalama = defineInterviewQuestion({
  slug: "uc-gunluk-yuruyen-ortalama",
  seviye: "Zor",
  sirket: "Bir perakende zinciri",
  baslik: "3 Günlük Yürüyen Ortalama Satış",
  senaryo: `
Bir perakende zincirinin satış ekibindesin. Günlük satış rakamlarındaki dalgalanmayı yumuşatmak için, her günün kendisi dahil son 3 günün ortalama satışını (yürüyen ortalama) görmek istiyorlar.

**Görev:** Her günün \`sale_date\` ve \`revenue\`'sunu, o gün dahil son 3 günün ortalama satışını (\`yuruyen_ortalama\` olarak) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE daily_sales (
  sale_date TEXT PRIMARY KEY,
  revenue REAL NOT NULL
);

INSERT INTO daily_sales (sale_date, revenue) VALUES
  ('2025-04-01', 1200),
  ('2025-04-02', 1500),
  ('2025-04-03', 1100),
  ('2025-04-04', 1800),
  ('2025-04-05', 1300),
  ('2025-04-06', 1600),
  ('2025-04-07', 1400),
  ('2025-04-08', 1700),
  ('2025-04-09', 1250),
  ('2025-04-10', 1900);
`.trim(),
  onizlemeTablolari: ["daily_sales"],
  ipuclari: [
    "Varsayılan pencere çerçevesi 'baştan şu ana kadar' işler ama sen sadece SON 3 günü istiyorsun — bunun için pencere çerçevesini açıkça belirtmen gerekir.",
    "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW, mevcut satır dahil son 3 satırı kapsayan bir çerçeve tanımlar.",
    "AVG(revenue) OVER (ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) kalıbını dene.",
  ],
  cozumSql:
    "SELECT sale_date, revenue, AVG(revenue) OVER (ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS yuruyen_ortalama FROM daily_sales;",
  aciklama:
    "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW, pencereyi 'kendisi dahil önceki 2 satır' ile sınırlar — bu, tam olarak 3 günlük yürüyen ortalamayı verir. Belirtilmezse varsayılan çerçeve 'baştan şu ana kadar' olur, yani tüm geçmişi kapsayan bir ortalama elde edilirdi.",
  mod: "sonuc",
  takipSorusu: "Peki ilk iki gün için (henüz 3 gün birikmediği için) ne olur?",
  takipCevabi:
    "SQLite, çerçevede istenen kadar önceki satır yoksa mevcut olanlarla hesaplama yapar — yani ilk gün sadece kendi değerinin ortalamasını (kendisini), ikinci gün ilk iki günün ortalamasını alır; hata vermez ya da NULL döndürmez.",
});
