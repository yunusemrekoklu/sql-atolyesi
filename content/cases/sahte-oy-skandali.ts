import { defineVaka } from "@/types/content";

export const sahteOySkandali = defineVaka({
  slug: "sahte-oy-skandali",
  seviye: "Başlangıç",
  xp: 25,
  baslik: "Sahte Oy Skandalı",
  ozet:
    "Öğrenci konseyi seçiminde bir öğrenci numarası birden fazla oy kullanmış görünüyor. Mükerrer oyları bulup hangi adayın kazandığını ortaya çıkar.",
  hikaye: `
Üniversite öğrenci konseyi seçiminin sonuçları açıklandığında ortalık karıştı: Kaan Aksoy, rakibi Deniz Yalçın'ı sadece birkaç oyla geçmişti.

Ama seçim gözlemcisi olan sen, oy tablosunu incelerken tuhaf bir şey fark ettin — bazı öğrenci numaraları listede bir kereden fazla görünüyor. Acaba bu bir veri girişi hatası mı, yoksa biri sandığı "dijital olarak" mı doldurdu?

SQL'ini kuşan, mükerrer oyları bul ve kimin bu işten nemalandığını ortaya çıkar.
`.trim(),
  hedefler: [
    "oylar tablosundaki tüm oyları incele.",
    "Aynı öğrenci numarasının birden fazla kez oy kullanıp kullanmadığını GROUP BY + HAVING COUNT ile kontrol et.",
    "Bu mükerrer oyların hangi adaya gittiğini bul ve adayın adını ortaya çıkar.",
  ],
  ddl: `
CREATE TABLE adaylar (id INTEGER PRIMARY KEY, ad TEXT NOT NULL);
INSERT INTO adaylar (id, ad) VALUES (1,'Kaan Aksoy'),(2,'Deniz Yalçın');

CREATE TABLE oylar (id INTEGER PRIMARY KEY, ogrenci_no TEXT NOT NULL, aday_id INTEGER NOT NULL);
INSERT INTO oylar (id, ogrenci_no, aday_id) VALUES
 (1,'2020111111',2),
 (2,'2020222222',1),
 (3,'2021123456',1),
 (4,'2020333333',2),
 (5,'2021123456',1),
 (6,'2020444444',1),
 (7,'2021123456',1),
 (8,'2020555555',2);
`.trim(),
  ipuclari: [
    "oylar tablosunu ogrenci_no'ya göre GROUP BY yap.",
    "HAVING COUNT(*) > 1 ile birden fazla oy kullanan öğrenci numaralarını filtrele.",
    "Bulduğun mükerrer numaraların hangi aday_id'ye oy verdiğini adaylar tablosuyla eşleştir.",
  ],
  cozumSql: `
SELECT ad FROM adaylar WHERE id = (
  SELECT aday_id FROM oylar GROUP BY ogrenci_no HAVING COUNT(*) > 1 LIMIT 1
);
`.trim(),
  aciklama:
    'GROUP BY ile gerçek ortaya çıkıyor: "2021123456" numaralı "öğrenci" sistemde tam 3 kez oy kullanmış görünüyor — hepsi de Kaan Aksoy için. Meğer o öğrenci numarası hiç mevcut değilmiş (fakülte kayıtlarında böyle biri yok). Kaan\'ın seçim kampanyası müdürü, "teknik bir hataydı" dese de öğrenci konseyi seçimi iptal edildi. Ders: demokrasi de, SQL de dürüstlük ister.',
  mod: "sonuc",
});
