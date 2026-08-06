import { definePracticeSet } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const zorluKarisik = definePracticeSet({
  slug: "zorlu-karisik",
  baslik: "Zorlu Karışık",
  aciklama: "JOIN, alt sorgu, pencere fonksiyonu ve toplulaştırmanın karıştığı üst düzey sorular — e-ticaret veritabanı üzerinde.",
  veritabaniId: eticaretDb.id,
  sorular: [
    {
      id: "pr-hard-1",
      seviye: "Orta",
      baslik: "Ortalama Üstü Ürünler (Kategoriyle)",
      soru: "Fiyatı tüm ürünlerin ortalamasının üzerinde olan ürünlerin product_name, category ve price'ını getiren bir sorgu yaz.",
      ipucu: "WHERE price > (SELECT AVG(price) FROM products) kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, category, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
      mod: "sonuc",
    },
    {
      id: "pr-hard-2",
      seviye: "Orta",
      baslik: "Farklı Ürün Sayısı",
      soru: "Her müşterinin full_name'ini ve sipariş ettiği FARKLI ürün sayısını (farkli_urun_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "customers'ı orders ve order_items'a JOIN'le, GROUP BY customer, COUNT(DISTINCT oi.product_id) kullan.",
      cozumSql:
        "SELECT c.full_name, COUNT(DISTINCT oi.product_id) AS farkli_urun_sayisi FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id GROUP BY c.customer_id;",
      mod: "sonuc",
    },
    {
      id: "pr-hard-3",
      seviye: "Orta",
      baslik: "Siparişsiz Müşteriler",
      soru: "Hiç siparişi olmayan müşterilerin full_name'ini NOT EXISTS kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id) kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);",
      mod: "sonuc",
    },
    {
      id: "pr-hard-4",
      seviye: "Zor",
      baslik: "Kategori Şampiyonu",
      soru: "Her kategorideki en pahalı ürünü (product_name, category, price) ilişkili alt sorgu ile getiren bir sorgu yaz.",
      ipucu: "WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT product_name, category, price FROM products p WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category);",
      mod: "sonuc",
    },
    {
      id: "pr-hard-5",
      seviye: "Zor",
      baslik: "En Pahalı 3 Ürün (Pencere ile)",
      soru: "Fiyata göre RANK ile sıralandığında ilk 3 sırada yer alan ürünlerin product_name ve price'ını getiren bir sorgu yaz — pencere fonksiyonunu bir alt sorguda hesapla.",
      ipucu: "FROM içinde RANK() OVER (ORDER BY price DESC) AS sira hesapla, dış sorguda WHERE sira <= 3 ekle.",
      cozumSql:
        "SELECT product_name, price FROM (SELECT product_name, price, RANK() OVER (ORDER BY price DESC) AS sira FROM products) AS t WHERE sira <= 3;",
      mod: "sonuc",
    },
    {
      id: "pr-hard-6",
      seviye: "Zor",
      baslik: "Müşteri Harcamaları",
      soru: "Her müşterinin full_name'ini ve order_items üzerinden hesaplanan toplam harcamasını (quantity * unit_price toplamı, toplam_harcama olarak) getiren, çoktan aza sıralı bir sorgu yaz.",
      ipucu: "customers'ı orders ve order_items'a JOIN'le, GROUP BY customer, SUM(oi.quantity * oi.unit_price) kullan.",
      cozumSql:
        "SELECT c.full_name, SUM(oi.quantity * oi.unit_price) AS toplam_harcama FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id GROUP BY c.customer_id ORDER BY toplam_harcama DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "pr-hard-7",
      seviye: "Zor",
      baslik: "Çok Kategorili Müşteriler",
      soru: "En az 2 farklı kategoriden ürün sipariş etmiş müşterilerin full_name'ini ve farklı kategori sayısını (kategori_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "customers'ı orders, order_items ve products'a JOIN'le, GROUP BY customer, COUNT(DISTINCT p.category), HAVING COUNT(DISTINCT p.category) >= 2 kullan.",
      cozumSql:
        "SELECT c.full_name, COUNT(DISTINCT p.category) AS kategori_sayisi FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id GROUP BY c.customer_id HAVING COUNT(DISTINCT p.category) >= 2;",
      mod: "sonuc",
    },
    {
      id: "pr-hard-8",
      seviye: "Zor",
      baslik: "Sipariş Aralıkları",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE bir önceki sipariş tarihini (onceki_tarih olarak) getiren bir sorgu yaz — sadece onceki_tarih'i NULL OLMAYAN (yani ilk sipariş olmayan) satırları göster.",
      ipucu: "FROM içinde LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih hesapla, dış sorguda WHERE onceki_tarih IS NOT NULL ekle.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, onceki_tarih FROM (SELECT customer_id, order_id, order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih FROM orders) AS t WHERE onceki_tarih IS NOT NULL;",
      mod: "sonuc",
    },
    {
      id: "pr-hard-9",
      seviye: "Zor",
      baslik: "Kategori Ortalamasının Üzerinde",
      soru: "Fiyatı kendi kategorisinin ortalamasından yüksek olan ürünlerin product_name, category ve price'ını getiren bir sorgu yaz — türetilmiş tablo kullan.",
      ipucu: "products'ı, kategori ortalamalarını hesaplayan bir alt sorguya category üzerinden JOIN'le, WHERE p.price > ka.avg_price ekle.",
      cozumSql:
        "SELECT p.product_name, p.category, p.price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category WHERE p.price > ka.avg_price;",
      mod: "sonuc",
    },
    {
      id: "pr-hard-10",
      seviye: "Zor",
      baslik: "İptal Eden Müşteriler",
      soru: "En az bir siparişini iptal etmiş (status = 'İptal') müşterilerin full_name'ini ve toplam iptal sayısını (iptal_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "customers'ı, WHERE status = 'İptal' filtreli orders'a JOIN'le, GROUP BY customer, COUNT(*) kullan.",
      cozumSql:
        "SELECT c.full_name, COUNT(*) AS iptal_sayisi FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'İptal' GROUP BY c.customer_id;",
      mod: "sonuc",
    },
  ],
});
