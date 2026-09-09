import { defineVaka } from "@/types/content";

export const kuyumcuSoygunu = defineVaka({
  slug: "kuyumcu-soygunu",
  seviye: "İleri",
  xp: 60,
  baslik: "Kuyumcu Soygunu",
  ozet:
    "Sahil kasabasındaki kuyumcu soyuldu, dört şüpheli de alibi uyduruyor. Telefon baz istasyonu kayıtlarıyla iddiaları çürüt.",
  hikaye: `
Sahil kasabasının en eski kuyumcusu, bir gece yarısı vitrinindeki tüm altınlarla birlikte soyuldu. Jandarma dört şüpheliyi sorguya çekti, hepsi de o saatte "başka bir yerde" olduğunu iddia etti.

Ama telefon operatöründen gelen baz istasyonu kayıtları, telefonların gerçekte nerede olduğunu gösteriyor — ve yalanlar, sinyallerle çürütülebilir. Her şüphelinin iddiasını, telefonunun gerçekte bağlandığı baz istasyonuyla karşılaştır. Biri, tam da soygun anında, olması gerektiği yerde değildi.
`.trim(),
  hedefler: [
    "Her şüphelinin iddia ettiği konumu (iddia_edilen_baz_istasyon_id) not al.",
    "telefon_sinyalleri tablosunda olay saatindeki (03:00–03:30) gerçek baz istasyonu bağlantılarını bul.",
    "İddia edilen konum ile gerçek sinyal konumunun UYUŞMADIĞI şüpheliyi ortaya çıkar.",
  ],
  ddl: `
CREATE TABLE baz_istasyonlari (id INTEGER PRIMARY KEY, ad TEXT NOT NULL, konum TEXT NOT NULL);
INSERT INTO baz_istasyonlari (id, ad, konum) VALUES
 (1,'BTS-Merkez','Kuyumcu Yakını'),
 (2,'BTS-Sahil','Sahil Yolu'),
 (3,'BTS-Ev','Evler Bölgesi'),
 (4,'BTS-Sanayi','İşyerleri / Sanayi Sitesi'),
 (5,'BTS-Eczane','Nöbetçi Eczane Bölgesi');

CREATE TABLE supheliler (id INTEGER PRIMARY KEY, ad TEXT NOT NULL, iddia_edilen_konum TEXT NOT NULL, iddia_edilen_baz_istasyon_id INTEGER NOT NULL);
INSERT INTO supheliler (id, ad, iddia_edilen_konum, iddia_edilen_baz_istasyon_id) VALUES
 (1,'Hakan Ersoy','Evde uyuyordum',3),
 (2,'Melis Tunç','Nöbetçi eczanedeydim',5),
 (3,'Orkun Baytar','Sahilde balık tutuyorduk',2),
 (4,'Ferda Güneş','İşyerinde çalışıyordum',4);

CREATE TABLE telefon_sinyalleri (id INTEGER PRIMARY KEY, supheli_id INTEGER NOT NULL, baz_istasyon_id INTEGER NOT NULL, zaman TEXT NOT NULL);
INSERT INTO telefon_sinyalleri (id, supheli_id, baz_istasyon_id, zaman) VALUES
 (1,1,3,'2026-02-20 00:30:00'),
 (2,1,1,'2026-02-20 03:12:00'),
 (3,2,5,'2026-02-20 03:00:00'),
 (4,2,5,'2026-02-20 03:20:00'),
 (5,3,2,'2026-02-20 02:50:00'),
 (6,3,2,'2026-02-20 03:25:00'),
 (7,4,4,'2026-02-20 03:10:00'),
 (8,4,4,'2026-02-20 03:30:00');
`.trim(),
  ipuclari: [
    "supheliler.iddia_edilen_baz_istasyon_id, her şüphelinin 'olması gerektiği yeri' gösteriyor.",
    "telefon_sinyalleri tablosunu olay saatine (03:00–03:30) göre filtrele.",
    "İki tabloyu supheli_id üzerinden JOIN'le ve baz_istasyon_id'lerin BİRBİRİNE EŞİT OLMADIĞI satırı bul.",
  ],
  cozumSql: `
SELECT s.ad
FROM supheliler s
JOIN telefon_sinyalleri t ON t.supheli_id = s.id
WHERE t.zaman BETWEEN '2026-02-20 03:00:00' AND '2026-02-20 03:30:00'
  AND t.baz_istasyon_id != s.iddia_edilen_baz_istasyon_id;
`.trim(),
  aciklama:
    "Hakan Ersoy 'evde uyuyordum' dedi, ama telefonu tam saat 03:12'de kuyumcuya 200 metre mesafedeki BTS-Merkez istasyonuna bağlanmıştı — evinin bulunduğu BTS-Ev'e değil. Diğer üç şüphelinin sinyalleri iddialarıyla birebir örtüşüyordu. Jandarma, Hakan'ın evini aradığında altınların bir kısmını bulacaktı bile. Telefonlar susmaz, sinyaller unutmaz.",
  mod: "sonuc",
});
