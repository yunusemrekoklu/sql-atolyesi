import { defineInterviewQuestion } from "@/types/content";

export const kategoriSampiyonuUrun = defineInterviewQuestion({
  slug: "kategori-sampiyonu-urun",
  seviye: "Orta",
  sirket: "Bir online moda mağazası",
  baslik: "Kategori Şampiyonu Ürün",
  senaryo: `
Bir online moda mağazasının ürün ekibindesin. Her kategoride en çok satılan (en yüksek toplam satış adedi olan) ürünün belirlenmesi isteniyor — bu ürünler ana sayfada öne çıkarılacak.

**Görev:** Her kategorideki en çok satılan (\`units_sold\`'u en yüksek) ürünü (\`category\`, \`item_name\`, \`units_sold\`) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE items (
  item_id INTEGER PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  units_sold INTEGER NOT NULL
);

INSERT INTO items (item_id, item_name, category, units_sold) VALUES
  (1, 'Slim Fit Kot', 'Pantolon', 320),
  (2, 'Bol Kesim Kot', 'Pantolon', 180),
  (3, 'Kumaş Pantolon', 'Pantolon', 95),
  (4, 'Beyaz Gömlek', 'Gömlek', 210),
  (5, 'Kareli Gömlek', 'Gömlek', 260),
  (6, 'Keten Gömlek', 'Gömlek', 140),
  (7, 'Deri Ceket', 'Ceket', 75),
  (8, 'Kaban', 'Ceket', 130),
  (9, 'Blazer Ceket', 'Ceket', 190),
  (10, 'Jogger Pantolon', 'Pantolon', 410),
  (11, 'Oversize Gömlek', 'Gömlek', 175),
  (12, 'Yelek', 'Ceket', 60);
`.trim(),
  onizlemeTablolari: ["items"],
  ipuclari: [
    "Her ürünü kendi kategorisinin en yüksek satış adediyle karşılaştırman gerekiyor.",
    "İlişkili bir alt sorgu ile her kategori için MAX(units_sold) hesapla: (SELECT MAX(units_sold) FROM items i2 WHERE i2.category = i.category).",
    "Dış sorguda WHERE units_sold = (...) ile eşleştir.",
  ],
  cozumSql: "SELECT category, item_name, units_sold FROM items i WHERE units_sold = (SELECT MAX(units_sold) FROM items i2 WHERE i2.category = i.category);",
  aciklama:
    "İlişkili alt sorgu, her kategori için MAX(units_sold)'u hesaplar (i2.category = i.category bağıyla); dış WHERE bu maksimuma eşit olan ürünü (kategori şampiyonunu) filtreler.",
  mod: "sonuc",
  takipSorusu: "Peki ya bir kategoride iki ürün aynı (en yüksek) satış adedine sahipse ne olur?",
  takipCevabi:
    "Bu sorgu bu durumda her ikisini de getirir (eşitlik durumunda karşılaştırma her iki satırı da sağlar) — bu genelde istenen davranıştır; sadece TEK bir sonuç istiyorsan ROW_NUMBER() OVER (PARTITION BY category ORDER BY units_sold DESC, item_id) = 1 gibi bir tekilleştirme (tie-breaker) eklemen gerekirdi.",
});
