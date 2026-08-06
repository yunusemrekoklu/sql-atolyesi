import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const toplulastirmaFonksiyonlari = defineLesson({
  slug: "toplulastirma-fonksiyonlari",
  uniteId: 2,
  dersNo: "2.4",
  baslik: "Toplulaştırma Fonksiyonları",
  veritabaniId: eticaretDb.id,
  anlatim: `
Şimdiye kadar sorgularımız hep **satır satır** sonuç verdi. Bazen ise tüm tablo (veya bir bölümü) hakkında **tek bir özet sayı** öğrenmek isteriz — "kaç ürünümüz var?", "ortalama fiyat ne?" gibi. Bunun için **toplulaştırma fonksiyonları** (aggregate functions) kullanılır.

## Temel toplulaştırma fonksiyonları

| Fonksiyon | Ne yapar |
|---|---|
| \`COUNT(*)\` | satır sayısını sayar |
| \`SUM(sutun)\` | sayısal bir sütunun toplamını alır |
| \`AVG(sutun)\` | sayısal bir sütunun ortalamasını alır |
| \`MIN(sutun)\` / \`MAX(sutun)\` | en küçük / en büyük değeri bulur |

\`\`\`sql
SELECT COUNT(*) AS total_products, AVG(price) AS avg_price FROM products;
\`\`\`

Bu sorgu tek bir satır döndürür — çünkü toplulaştırma fonksiyonları tüm tabloyu (veya \`WHERE\` ile filtrelenmiş satırları) **tek bir sonuca** indirger.

## COUNT(*) vs COUNT(sütun) — önemli fark!

\`COUNT(*)\`, tüm satırları sayar (NULL değerler dahil). \`COUNT(sutun)\` ise sadece o **sütunu NULL olmayan** satırları sayar. Önceki dersteki \`phone\` sütununu hatırlıyor musun?

\`\`\`sql
SELECT COUNT(*) AS total_customers, COUNT(phone) AS with_phone FROM customers;
\`\`\`

Bu sorgu iki farklı sayı döndürür: toplam müşteri sayısı ile telefon numarası **kayıtlı olan** müşteri sayısı. \`MIN\` ve \`MAX\`, metin sütunlarında da çalışır — alfabetik olarak en küçük/en büyük değeri bulur.
`,
  ornekler: [
    { aciklama: "Toplam ürün sayısı ve ortalama fiyatı hesapla:", sql: "SELECT COUNT(*) AS total_products, AVG(price) AS avg_price FROM products;" },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-4-1",
      seviye: "Kolay",
      baslik: "Toplam Ürün Sayısı",
      soru: "products tablosundaki toplam satır (ürün) sayısını getiren bir sorgu yaz.",
      ipucu: "SELECT COUNT(*) FROM products; kalıbını kullanabilirsin.",
      cozumSql: "SELECT COUNT(*) AS product_count FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-4-2",
      seviye: "Kolay",
      baslik: "En Pahalı ve En Ucuz Ürün Fiyatı",
      soru: "products tablosundaki en yüksek ve en düşük fiyatı (max_price, min_price) tek sorguda getir.",
      ipucu: "MAX(price) AS max_price, MIN(price) AS min_price kalıbını kullanabilirsin.",
      cozumSql: "SELECT MAX(price) AS max_price, MIN(price) AS min_price FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-4-3",
      seviye: "Orta",
      baslik: "Toplam Stok Değeri",
      soru: "Tüm ürünlerin toplam stok değerini (her ürün için price * stock_quantity, hepsinin toplamı) hesaplayan bir sorgu yaz.",
      ipucu: "SUM(price * stock_quantity) — SUM içinde bir ifade de kullanabilirsin.",
      cozumSql: "SELECT SUM(price * stock_quantity) AS total_stock_value FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-4-4",
      seviye: "Orta",
      baslik: "Telefon Kaydı Karşılaştırması",
      soru: "Toplam müşteri sayısını ve telefon numarası KAYITLI OLAN müşteri sayısını tek sorguda getir (COUNT(*) ile COUNT(sütun) arasındaki farkı gözlemle).",
      ipucu: "COUNT(*) AS total_customers, COUNT(phone) AS with_phone kalıbını kullanabilirsin.",
      cozumSql: "SELECT COUNT(*) AS total_customers, COUNT(phone) AS with_phone FROM customers;",
      mod: "sonuc",
    },
    {
      id: "2-4-5",
      seviye: "Orta",
      baslik: "Ortalama Sipariş Kalemi Tutarı",
      soru: "order_items tablosundaki her satırın tutarını (quantity * unit_price) hesaba katarak, ortalama sipariş kalemi tutarını getiren bir sorgu yaz.",
      ipucu: "AVG(quantity * unit_price) kalıbını kullanabilirsin.",
      cozumSql: "SELECT AVG(quantity * unit_price) AS avg_line_total FROM order_items;",
      mod: "sonuc",
    },
    {
      id: "2-4-6",
      seviye: "Zor",
      baslik: "Elektronik Kategorisi Özeti",
      soru: "'Elektronik' kategorisindeki ürün sayısını ve bu ürünlerin toplam stok miktarını (stock_quantity toplamı) tek sorguda getir.",
      ipucu: "Önce WHERE category = 'Elektronik' ile filtrele, sonra COUNT(*) ve SUM(stock_quantity) hesapla.",
      cozumSql: "SELECT COUNT(*) AS product_count, SUM(stock_quantity) AS total_stock FROM products WHERE category = 'Elektronik';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "2-4-q1",
      soru: "COUNT(*) ne sayar?",
      secenekler: [
        "Sadece NULL olmayan değerleri",
        "Tablodaki (veya filtrelenmiş) toplam satır sayısını, NULL'lar dahil",
        "Sütun sayısını",
        "Farklı (distinct) değer sayısını",
      ],
      dogruIndex: 1,
      aciklama: "COUNT(*), her satırı sayar; belirli bir sütunun NULL olup olmadığına bakmaz.",
    },
    {
      id: "2-4-q2",
      soru: "COUNT(phone) ile COUNT(*) arasındaki fark nedir?",
      secenekler: [
        "Aralarında hiç fark yoktur",
        "COUNT(phone) sadece phone sütunu NULL OLMAYAN satırları sayar",
        "COUNT(phone) her zaman COUNT(*)'tan büyüktür",
        "COUNT(phone) sadece sayısal sütunlarda çalışır",
      ],
      dogruIndex: 1,
      aciklama: "COUNT(sutun), o sütundaki NULL değerleri saymaz; COUNT(*) ise NULL'a bakmaksızın tüm satırları sayar.",
    },
    {
      id: "2-4-q3",
      soru: "AVG() fonksiyonu neyi hesaplar?",
      secenekler: [
        "Belirtilen sütunun toplamını",
        "Belirtilen sütunun ortalamasını",
        "Belirtilen sütundaki farklı değer sayısını",
        "Belirtilen sütunun en büyük değerini",
      ],
      dogruIndex: 1,
      aciklama: "AVG, verilen sayısal sütunun ortalama (aritmetik ortalama) değerini hesaplar.",
    },
    {
      id: "2-4-q4",
      soru: "SUM(price) sonucuna bakarak kaç satır olduğunu doğrudan öğrenebilir misin?",
      secenekler: [
        "Evet, SUM otomatik olarak satır sayısını da gösterir",
        "Hayır, SUM sadece toplamı verir; satır sayısı için COUNT gerekir",
        "Evet ama sadece price sütunu NOT NULL ise",
        "Hayır, SUM hiçbir zaman sayısal sonuç vermez",
      ],
      dogruIndex: 1,
      aciklama: "SUM tek başına toplam değeri verir; kaç satırın toplandığını bilmek istersen ayrıca COUNT(*) çalıştırman gerekir.",
    },
    {
      id: "2-4-q5",
      soru: "MIN() ve MAX() metin (TEXT) sütunlarında da çalışır mı?",
      secenekler: [
        "Hayır, sadece sayısal sütunlarda çalışır",
        "Evet, alfabetik olarak en küçük/en büyük değeri bulur",
        "Evet ama sonuç her zaman NULL olur",
        "Sadece tarih formatındaki metinlerde çalışır",
      ],
      dogruIndex: 1,
      aciklama: "MIN/MAX metin sütunlarında alfabetik sıralamaya göre en küçük/en büyük değeri (ör. A'ya en yakın / Z'ye en yakın) bulur.",
    },
  ],
});
