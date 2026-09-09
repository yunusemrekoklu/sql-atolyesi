import { defineVaka } from "@/types/content";

export const kulupKasasiAcigi = defineVaka({
  slug: "kulup-kasasi-acigi",
  seviye: "İleri",
  xp: 60,
  baslik: "Kulüp Kasası Açığı",
  ozet:
    "Öğrenci kulübünün kasasında 45.000 TL açık çıktı. Anormal büyüklükteki işlemi bulup parayı kimin çektiğini ortaya çıkar.",
  hikaye: `
Öğrenci kulübünün kasası ay sonu sayıldığında 45.000 TL açık çıktı. Kulüp üç kişi tarafından yönetiliyor ve hepsinin kasaya erişimi var. Kayıtlarda her şey "normal" görünüyor — küçük gelir-gider hareketleri, tipik bir öğrenci kulübü bütçesi.

Ama bir işlem, diğerlerinin çok üzerinde duruyor gibi hissettiriyor. Ortalamanın kaç katı büyüklüğünde bir hareket olması gerektiğine sen karar ver, anomaliyi bul, parayı kimin çektiğini ortaya çıkar.
`.trim(),
  hedefler: [
    "kasa_hareketleri tablosundaki tüm işlemlerin büyüklüğünü (mutlak değerini) karşılaştır.",
    "Ortalama işlem büyüklüğünü hesapla (AVG + ABS) ve bunun çok üzerinde kalan işlemi bul.",
    "Bu anormal işlemi yapan çalışanı calisanlar tablosuyla eşleştir.",
  ],
  ddl: `
CREATE TABLE calisanlar (id INTEGER PRIMARY KEY, ad TEXT NOT NULL);
INSERT INTO calisanlar (id, ad) VALUES (1,'Tuncay Erman'),(2,'Gizem Aksu'),(3,'Barış Koç');

CREATE TABLE kasa_hareketleri (id INTEGER PRIMARY KEY, calisan_id INTEGER NOT NULL, tarih TEXT NOT NULL, tutar INTEGER NOT NULL, aciklama TEXT NOT NULL);
INSERT INTO kasa_hareketleri (id, calisan_id, tarih, tutar, aciklama) VALUES
 (1,1,'2026-01-05',1500,'Kırtasiye alımı'),
 (2,2,'2026-01-08',-800,'Temizlik gideri'),
 (3,3,'2026-01-12',2000,'Üye aidatı toplama'),
 (4,1,'2026-01-20',-1200,'Etkinlik organizasyonu'),
 (5,2,'2026-01-25',900,'Sponsorluk geliri'),
 (6,3,'2026-02-01',-45000,'Ofis gideri'),
 (7,1,'2026-02-10',-700,'Kargo ücreti'),
 (8,2,'2026-02-15',1100,'Bağış geliri');
`.trim(),
  ipuclari: [
    "kasa_hareketleri tablosunda ABS(tutar) ile işlem büyüklüklerine bak (tutar hem + hem - olabilir).",
    "Alt sorgu ile tüm işlemlerin ortalama büyüklüğünü (AVG) hesapla.",
    "Ortalamanın belirgin şekilde üzerinde kalan (örneğin 5 katından fazla) işlemi WHERE ile filtrele, sonra calisanlar ile JOIN'le.",
  ],
  cozumSql: `
SELECT c.ad
FROM calisanlar c
JOIN kasa_hareketleri k ON k.calisan_id = c.id
WHERE ABS(k.tutar) > (SELECT AVG(ABS(tutar)) * 5 FROM kasa_hareketleri);
`.trim(),
  aciklama:
    "Sayılar acımasız: '−45.000 TL, Ofis gideri' açıklamasıyla geçen işlem, kulübün ortalama işlem büyüklüğünün 6 kattan fazlasıydı — ve böylesi bir 'ofis gideri' için hiçbir fatura ibraz edilemedi. Barış Koç, kulüp yönetiminden istifa etti (etmek zorunda kaldı). Kasa defterleri, iyi bir SQL sorgusuna asla yalan söyleyemez.",
  mod: "sonuc",
});
