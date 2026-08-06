import { defineInterviewQuestion } from "@/types/content";

export const yorumAlmamisRestoranlar = defineInterviewQuestion({
  slug: "yorum-almamis-restoranlar",
  seviye: "Kolay",
  sirket: "Bir yemek sipariş uygulaması",
  baslik: "Yorum Almamış Restoranlar",
  senaryo: `
Bir yemek sipariş uygulamasında çalışıyorsun. Platformdaki restoranlardan hangilerinin hiç müşteri yorumu almadığını bulman isteniyor — bu restoranlar bir öne çıkarma kampanyasına dahil edilecek.

**Görev:** Hiç yorumu olmayan restoranların \`restaurant_id\` ve \`name\`'ini getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE restaurants (
  restaurant_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE reviews (
  review_id INTEGER PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(restaurant_id),
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL
);

INSERT INTO restaurants (restaurant_id, name, city) VALUES
  (1, 'Lezzet Durağı', 'İstanbul'),
  (2, 'Anadolu Sofrası', 'Ankara'),
  (3, 'Deniz Mutfağı', 'İzmir'),
  (4, 'Kebapçı Veli', 'Gaziantep'),
  (5, 'Pizza Evi', 'İstanbul'),
  (6, 'Ev Yemekleri', 'Bursa'),
  (7, 'Tatlı Dünyası', 'Antalya'),
  (8, 'Kahve Köşesi', 'İstanbul');

INSERT INTO reviews (review_id, restaurant_id, rating, comment) VALUES
  (1, 1, 5, 'Harika!'),
  (2, 1, 4, 'Güzeldi'),
  (3, 2, 3, 'Fena değil'),
  (4, 3, 5, 'Çok lezzetli'),
  (5, 5, 4, 'Hızlı teslimat'),
  (6, 7, 5, 'Muhteşem tatlılar');
`.trim(),
  onizlemeTablolari: ["restaurants", "reviews"],
  ipuclari: [
    "restaurants tablosunu reviews tablosuna LEFT JOIN'le.",
    "Eşleşmesi olmayan satırlarda reviews'tan gelen sütunlar NULL olur.",
    "WHERE rv.review_id IS NULL ile bu satırları (anti-join) filtrele.",
  ],
  cozumSql: "SELECT r.restaurant_id, r.name FROM restaurants r LEFT JOIN reviews rv ON r.restaurant_id = rv.restaurant_id WHERE rv.review_id IS NULL;",
  aciklama:
    "restaurants, reviews'a LEFT JOIN'lendiğinde hiç yorumu olmayan restoranlarda review_id NULL olur; WHERE rv.review_id IS NULL bu restoranları filtreler.",
  mod: "sonuc",
  takipSorusu: "Peki ya sadece ortalama puanı 4'ün altında olan restoranları (yorumu olanlar arasından) bulman istenseydi?",
  takipCevabi:
    "Bu sefer anti-join değil, normal bir INNER JOIN + GROUP BY + HAVING AVG(rating) < 4 kullanırdın — yorum sayısı sıfır olan restoranlar bu sorguda zaten hiç görünmez.",
});
