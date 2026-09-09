import { defineVaka } from "@/types/content";

export const finalSinaviSizintisi = defineVaka({
  slug: "final-sinavi-sizintisi",
  seviye: "Orta",
  xp: 40,
  baslik: "Final Sınavı Sızıntısı",
  ozet:
    "Bir öğrenci finalden 99 aldı ama dönem boyu derse hiç girmedi. Sınav dosyası erişim loglarıyla sonuçları birleştirip sızıntıyı kimin yaptığını bul.",
  hikaye: `
Veritabanı Sistemleri dersinin finali bittikten sonra hoca dikkat çekici bir şey fark etti: sınıfın genel ortalaması her zamankinden düşükken, bir öğrenci tam **99** almıştı — üstelik dönem boyunca derse neredeyse hiç girmemiş biri.

Bölüm, üniversitenin sınav dosya sunucusunun erişim loglarını sana açtı. Sızıntı gerçek mi, yoksa bu öğrenci gerçekten dahi mi? Erişim zamanlarını, dosya adlarını ve sonuçları birleştirerek gerçeği bul.
`.trim(),
  hedefler: [
    "sinav_sistemi_erisimleri tablosunda kim, hangi dosyaya, ne zaman erişmiş incele.",
    "Sınav başlamadan ÖNCE asıl soru dosyasına (Final_Sorulari.docx) erişen var mı bul.",
    "Bu kişinin sinav_sonuclari'ndaki notunu kontrol et — sıra dışı yüksek mi?",
    "Üç ipucunu (erişim dosyası, erişim zamanı, sonuç) birleştirip suçluyu SQL ile ortaya çıkar.",
  ],
  ddl: `
CREATE TABLE ogrenciler (id INTEGER PRIMARY KEY, ad_soyad TEXT NOT NULL, ogrenci_no TEXT NOT NULL);
INSERT INTO ogrenciler (id, ad_soyad, ogrenci_no) VALUES
 (1,'Cem Aktürk','20190001'),
 (2,'Selin Kara','20190002'),
 (3,'Burcu Er','20190003'),
 (4,'Kerem Tan','20190004'),
 (5,'Nazlı Öz','20190005');

CREATE TABLE sinav_sistemi_erisimleri (id INTEGER PRIMARY KEY, ogrenci_id INTEGER NOT NULL, erisim_zamani TEXT NOT NULL, dosya_adi TEXT NOT NULL);
INSERT INTO sinav_sistemi_erisimleri (id, ogrenci_id, erisim_zamani, dosya_adi) VALUES
 (1,1,'2026-01-10 16:00:00','Ders_Notlari.pdf'),
 (2,4,'2026-01-14 23:47:00','Final_Sorulari.docx'),
 (3,2,'2026-01-15 11:00:00','Final_Cevap_Anahtari.pdf'),
 (4,3,'2026-01-12 09:00:00','Ders_Notlari.pdf'),
 (5,5,'2026-01-09 20:00:00','Onceki_Yillarin_Sinavlari.pdf');

CREATE TABLE sinav_sonuclari (id INTEGER PRIMARY KEY, ogrenci_id INTEGER NOT NULL, puan INTEGER NOT NULL);
INSERT INTO sinav_sonuclari (id, ogrenci_id, puan) VALUES
 (1,1,72),(2,2,85),(3,3,78),(4,4,99),(5,5,90);
`.trim(),
  ipuclari: [
    "sinav_sistemi_erisimleri tablosunda dosya_adi = 'Final_Sorulari.docx' olan kayıtlara odaklan.",
    "erisim_zamani'nın sınav başlangıcından (2026-01-15 09:00:00) önce olup olmadığını karşılaştır.",
    "Bulduğun kişiyi sinav_sonuclari ile JOIN'leyip notunun gerçekten şüpheli derecede yüksek olduğunu doğrula.",
  ],
  cozumSql: `
SELECT o.ad_soyad
FROM ogrenciler o
JOIN sinav_sistemi_erisimleri e ON e.ogrenci_id = o.id
JOIN sinav_sonuclari s ON s.ogrenci_id = o.id
WHERE e.dosya_adi = 'Final_Sorulari.docx'
  AND e.erisim_zamani < '2026-01-15 09:00:00'
  AND s.puan >= 95;
`.trim(),
  aciklama:
    'Erişim logları acımasız: Kerem Tan, sınav başlamadan tam 9 saat 13 dakika önce "Final_Sorulari.docx" dosyasını açmış. Aynı gece bir arkadaşının bilgisayarından giriş yapıldığı da ortaya çıktı ama bu senin vakan değil — bölüm disiplin kuruluna kaldı. Senin işin bitti: SQL, bir kez daha adaleti sağladı.',
  mod: "sonuc",
});
