import { defineInterviewQuestion } from "@/types/content";

export const departmanOrtalamasiUstuMaas = defineInterviewQuestion({
  slug: "departman-ortalamasi-ustu-maas",
  seviye: "Orta",
  sirket: "Bir teknoloji şirketi",
  baslik: "Departman Ortalamasının Üzerinde Maaş Alanlar",
  senaryo: `
Bir teknoloji şirketinde İK ekibindesin. Yıllık ücret değerlendirmesi için, her departmanda KENDİ departman ortalamasının üzerinde maaş alan çalışanların listelenmesi isteniyor.

**Görev:** Kendi departmanının ortalama maaşından fazla kazanan çalışanların \`full_name\`, \`department\` ve \`salary\`'sini getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary INTEGER NOT NULL
);

INSERT INTO employees (employee_id, full_name, department, salary) VALUES
  (1, 'Ahmet Yıldız', 'Mühendislik', 45000),
  (2, 'Zeynep Kaya', 'Mühendislik', 52000),
  (3, 'Mehmet Demir', 'Mühendislik', 38000),
  (4, 'Ayşe Şahin', 'Mühendislik', 61000),
  (5, 'Fatma Çelik', 'Satış', 32000),
  (6, 'Ali Aydın', 'Satış', 40000),
  (7, 'Elif Arslan', 'Satış', 28000),
  (8, 'Mustafa Koç', 'Pazarlama', 35000),
  (9, 'Hatice Er', 'Pazarlama', 42000),
  (10, 'Hüseyin Bulut', 'Pazarlama', 30000),
  (11, 'Emine Yavuz', 'Mühendislik', 47000),
  (12, 'İbrahim Öz', 'Satış', 36000);
`.trim(),
  onizlemeTablolari: ["employees"],
  ipuclari: [
    "Her çalışanı kendi departmanının ortalamasıyla karşılaştırman gerekiyor — bu bir ilişkili (correlated) alt sorgu gerektirir.",
    "İç sorguda WHERE e2.department = e.department ile dış sorgudaki departmana bağlan.",
    "AVG(salary) ile o departmanın ortalamasını hesapla ve dış sorguda salary > (...) ile karşılaştır.",
  ],
  cozumSql:
    "SELECT full_name, department, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e.department);",
  aciklama:
    "İlişkili alt sorgu, her çalışan satırı için KENDİ departmanının ortalamasını yeniden hesaplar (e2.department = e.department bağıyla); dış WHERE bu ortalamanın üzerindekileri filtreler.",
  mod: "sonuc",
  takipSorusu: "Peki ya bu sorguyu pencere fonksiyonlarıyla (correlated subquery kullanmadan) yazsaydın nasıl olurdu?",
  takipCevabi:
    "SELECT full_name, department, salary FROM (SELECT *, AVG(salary) OVER (PARTITION BY department) AS dept_avg FROM employees) WHERE salary > dept_avg; — AVG(...) OVER (PARTITION BY department) her satıra kendi departmanının ortalamasını ekler, bu da correlated subquery'nin pencere fonksiyonuyla eşdeğeridir.",
});
