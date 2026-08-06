import { defineInterviewQuestion } from "@/types/content";

export const ikinciEnYuksekMaas = defineInterviewQuestion({
  slug: "ikinci-en-yuksek-maas",
  seviye: "Orta",
  sirket: "Bir finans şirketi",
  baslik: "İkinci En Yüksek Maaş",
  senaryo: `
Bir finans şirketinde çalışıyorsun. Bu, mülakatlarda en çok sorulan klasiklerden biri: şirketteki en yüksek İKİNCİ maaşı (en yükseği değil) bulman isteniyor. Dikkat: iki farklı çalışan aynı en yüksek maaşı alıyor olabilir — cevabın yine de TEK bir değer olmalı.

**Görev:** Şirketteki ikinci en yüksek (distinct) maaşı (\`ikinci_en_yuksek_maas\` olarak) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE staff (
  staff_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  salary INTEGER NOT NULL
);

INSERT INTO staff (staff_id, full_name, salary) VALUES
  (1, 'Ahmet Yıldız', 95000),
  (2, 'Zeynep Kaya', 110000),
  (3, 'Mehmet Demir', 110000),
  (4, 'Ayşe Şahin', 87000),
  (5, 'Fatma Çelik', 102000),
  (6, 'Ali Aydın', 76000),
  (7, 'Elif Arslan', 99000),
  (8, 'Mustafa Koç', 65000),
  (9, 'Hatice Er', 82000),
  (10, 'Hüseyin Bulut', 91000);
`.trim(),
  onizlemeTablolari: ["staff"],
  ipuclari: [
    "Önce en yüksek maaşı bir alt sorguyla bul: (SELECT MAX(salary) FROM staff).",
    "Sonra bu değerden KÜÇÜK olan maaşlar arasında yeniden MAX() al — bu, 'bir sonraki farklı en yüksek değeri' verir.",
    "WHERE salary < (SELECT MAX(salary) FROM staff) filtresini dış MAX(salary) ile birlikte kullan.",
  ],
  cozumSql: "SELECT MAX(salary) AS ikinci_en_yuksek_maas FROM staff WHERE salary < (SELECT MAX(salary) FROM staff);",
  aciklama:
    "En yüksek maaşı (110000) iki kişi paylaştığı için basitçe 'ikinci satır' almak yanlış olurdu. Bunun yerine, en yüksek değerden KÜÇÜK olan maaşlar arasında yeniden MAX() alınır — bu, en yüksek değer tekrar etse bile doğru şekilde bir sonraki farklı değeri (102000) verir.",
  mod: "sonuc",
  takipSorusu: "Peki ya N'inci en yüksek maaşı (ör. üçüncü) bulman istenseydi, bu yaklaşım nasıl genelleşirdi?",
  takipCevabi:
    "Bu MAX+WHERE deseni N arttıkça iç içe alt sorgularla çirkinleşir; onun yerine DENSE_RANK() OVER (ORDER BY salary DESC) ile her maaşa bir sıra verip WHERE sira = N ile istediğin sırayı seçebilirsin — DENSE_RANK eşit maaşlara aynı sırayı verdiği için 'tekrarlanan en yüksek' sorununu da otomatik çözer.",
});
