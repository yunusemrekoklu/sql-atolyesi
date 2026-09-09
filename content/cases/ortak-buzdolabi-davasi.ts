import { defineVaka } from "@/types/content";

export const ortakBuzdolabiDavasi = defineVaka({
  slug: "ortak-buzdolabi-davasi",
  seviye: "Başlangıç",
  xp: 25,
  baslik: "Ortak Buzdolabı Davası",
  ozet:
    "Yurtta ortak buzdolabından biri Ayşe'nin köftesini çaldı. Mutfak kapı kartı loglarını incele, olay saatinde içeri gireni bul.",
  hikaye: `
Yurdun 2. katındaki ortak buzdolabı, öğrenciler arası bir güven meselesi hâline gelmişti — ta ki o gece Ayşe'nin özenle hazırlayıp üzerine adını yazdığı köfte kabı gizemli bir şekilde kayıplara karışana kadar.

Ayşe saat **22:10**'da köfteyi buzdolabına koyduğuna yemin ediyor, **22:25**'te geri döndüğünde ise ortada ne köfte ne de bir açıklama var. Yurt yönetimi, bu "düşük profilli ama yüksek öfkeli" vakayı çözmen için mutfağın kapı kartı giriş sistemindeki logları sana açtı.

Kim, o 15 dakikalık kritik pencerede mutfağa girdi?
`.trim(),
  hedefler: [
    "mutfak_giris_kayitlari tablosundaki tüm kayıtları incele.",
    "Olay saatinin (22:10–22:25) hangi girişle çakıştığını bul.",
    "O sakinin adını ortaya çıkar ve vakayı çöz.",
  ],
  ddl: `
CREATE TABLE sakinler (id INTEGER PRIMARY KEY, ad_soyad TEXT NOT NULL, oda_no INTEGER NOT NULL);
INSERT INTO sakinler (id, ad_soyad, oda_no) VALUES
 (1,'Ayşe Yıldız',204),
 (2,'Mert Kaya',101),
 (3,'Zeynep Demir',305),
 (4,'Burak Şahin',210),
 (5,'Elif Aydın',112);

CREATE TABLE mutfak_giris_kayitlari (id INTEGER PRIMARY KEY, sakin_id INTEGER NOT NULL, giris_zamani TEXT NOT NULL);
INSERT INTO mutfak_giris_kayitlari (id, sakin_id, giris_zamani) VALUES
 (1,2,'2026-03-02 21:45:00'),
 (2,4,'2026-03-02 22:17:00'),
 (3,3,'2026-03-02 23:05:00'),
 (4,5,'2026-03-02 20:30:00'),
 (5,2,'2026-03-02 22:40:00');
`.trim(),
  ipuclari: [
    "Olay saatini tam not al: 22:10–22:25.",
    "mutfak_giris_kayitlari tablosunu WHERE giris_zamani BETWEEN ... ile filtrele.",
    "Bulduğun sakin_id'yi sakinler tablosuyla eşleştir.",
  ],
  cozumSql: `
SELECT ad_soyad FROM sakinler WHERE id = (
  SELECT sakin_id FROM mutfak_giris_kayitlari
  WHERE giris_zamani BETWEEN '2026-03-02 22:10:00' AND '2026-03-02 22:25:00'
);
`.trim(),
  aciklama:
    'Kayıtlar yalan söylemez: saat 22:17\'de mutfağa giren tek kişi Burak Şahin\'di. Sorgulandığında "aslında kendi köftemi arıyordum" savunması pek inandırıcı gelmedi — özellikle de üzerinde bariz şekilde "AYŞE" yazan bir kaptan bahsederken. Vaka kapandı, köfte davası tarihe karıştı (dostluk onarımı ayrı bir dava).',
  mod: "sonuc",
});
