import type { SampleDatabase } from "@/types/content";

export const eticaretDb: SampleDatabase = {
  id: "eticaret",
  ad: "E-Ticaret",
  aciklama: "Küçük bir e-ticaret sitesinin müşteri, ürün ve sipariş verileri.",
  ddl: `
CREATE TABLE musteriler (
  musteri_id INTEGER PRIMARY KEY,
  ad_soyad TEXT NOT NULL,
  sehir TEXT NOT NULL,
  kayit_tarihi TEXT NOT NULL,
  telefon TEXT
);

CREATE TABLE urunler (
  urun_id INTEGER PRIMARY KEY,
  urun_adi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  fiyat REAL NOT NULL,
  stok_miktari INTEGER NOT NULL
);

CREATE TABLE siparisler (
  siparis_id INTEGER PRIMARY KEY,
  musteri_id INTEGER NOT NULL REFERENCES musteriler(musteri_id),
  siparis_tarihi TEXT NOT NULL,
  durum TEXT NOT NULL,
  iptal_nedeni TEXT
);

CREATE TABLE siparis_detay (
  detay_id INTEGER PRIMARY KEY,
  siparis_id INTEGER NOT NULL REFERENCES siparisler(siparis_id),
  urun_id INTEGER NOT NULL REFERENCES urunler(urun_id),
  adet INTEGER NOT NULL,
  birim_fiyat REAL NOT NULL
);

INSERT INTO musteriler (musteri_id, ad_soyad, sehir, kayit_tarihi, telefon) VALUES
  (1, 'Caner Şahin', 'İstanbul', '2024-01-15', '0532 111 22 33'),
  (2, 'Elif Yıldız', 'Ankara', '2024-02-03', NULL),
  (3, 'Selin Aydın', 'İzmir', '2024-02-20', '0533 222 33 44'),
  (4, 'Murat Bakır', 'İstanbul', '2024-03-05', NULL),
  (5, 'Zeynep Arslan', 'Bursa', '2024-03-18', '0534 333 44 55'),
  (6, 'Burak Koç', 'Antalya', '2024-04-02', NULL),
  (7, 'Deniz Yavuz', 'İstanbul', '2024-04-22', '0535 444 55 66'),
  (8, 'Gizem Polat', 'Ankara', '2024-05-10', NULL),
  (9, 'Emre Şahin', 'İzmir', '2024-05-30', '0536 555 66 77'),
  (10, 'Aylin Demirtaş', 'Bursa', '2024-06-14', NULL),
  (11, 'Kerem Uçar', 'İstanbul', '2024-07-01', '0537 666 77 88'),
  (12, 'Nazlı Öztürk', 'Antalya', '2024-07-19', NULL);

INSERT INTO urunler (urun_id, urun_adi, kategori, fiyat, stok_miktari) VALUES
  (1, 'Kablosuz Kulaklık', 'Elektronik', 1250.00, 45),
  (2, 'Akıllı Saat X', 'Elektronik', 3400.00, 12),
  (3, 'Kahve Makinesi', 'Ev Aletleri', 2850.00, 0),
  (4, 'Pamuklu Oversize Tişört', 'Giyim', 350.00, 150),
  (5, 'Ortopedik Çalışma Yastığı', 'Ev Aletleri', 620.00, 25),
  (6, 'Pro Gaming Klavye', 'Elektronik', 1850.00, 8),
  (7, 'Kot Pantolon', 'Giyim', 780.00, 60),
  (8, 'Blender Seti', 'Ev Aletleri', 1450.00, 20),
  (9, 'Bluetooth Hoparlör', 'Elektronik', 950.00, 33),
  (10, 'Yün Kazak', 'Giyim', 540.00, 40);

INSERT INTO siparisler (siparis_id, musteri_id, siparis_tarihi, durum, iptal_nedeni) VALUES
  (1, 1, '2025-01-05', 'Teslim Edildi', NULL),
  (2, 2, '2025-01-08', 'Teslim Edildi', NULL),
  (3, 1, '2025-01-20', 'Kargoda', NULL),
  (4, 3, '2025-02-02', 'Teslim Edildi', NULL),
  (5, 4, '2025-02-10', 'İptal', 'Müşteri vazgeçti'),
  (6, 5, '2025-02-14', 'Teslim Edildi', NULL),
  (7, 2, '2025-02-25', 'Hazırlanıyor', NULL),
  (8, 6, '2025-03-01', 'Teslim Edildi', NULL),
  (9, 7, '2025-03-05', 'Kargoda', NULL),
  (10, 1, '2025-03-12', 'Teslim Edildi', NULL),
  (11, 8, '2025-03-20', 'Teslim Edildi', NULL),
  (12, 9, '2025-03-28', 'İptal', 'Stok tükendi'),
  (13, 3, '2025-04-02', 'Teslim Edildi', NULL),
  (14, 10, '2025-04-10', 'Hazırlanıyor', NULL),
  (15, 5, '2025-04-15', 'Teslim Edildi', NULL);

INSERT INTO siparis_detay (detay_id, siparis_id, urun_id, adet, birim_fiyat) VALUES
  (1, 1, 1, 1, 1250.00),
  (2, 1, 4, 2, 350.00),
  (3, 2, 2, 1, 3400.00),
  (4, 3, 6, 1, 1850.00),
  (5, 4, 5, 1, 620.00),
  (6, 5, 3, 1, 2850.00),
  (7, 6, 1, 2, 1250.00),
  (8, 7, 9, 1, 950.00),
  (9, 8, 8, 1, 1450.00),
  (10, 8, 10, 1, 540.00),
  (11, 9, 7, 3, 780.00),
  (12, 10, 2, 1, 3400.00),
  (13, 10, 6, 1, 1850.00),
  (14, 11, 4, 1, 350.00),
  (15, 12, 1, 1, 1250.00),
  (16, 13, 9, 2, 950.00),
  (17, 14, 5, 1, 620.00),
  (18, 14, 10, 2, 540.00),
  (19, 15, 3, 1, 2850.00),
  (20, 15, 7, 1, 780.00);
`.trim(),
};
