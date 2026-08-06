import { definePracticeSet } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const pencereFonksiyonlariPratik = definePracticeSet({
  slug: "pencere-fonksiyonlari",
  baslik: "Pencere Fonksiyonları",
  aciklama: "ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD ve yürüyen toplam — e-ticaret veritabanı üzerinde.",
  veritabaniId: eticaretDb.id,
  sorular: [
    {
      id: "pr-window-1",
      seviye: "Kolay",
      baslik: "Fiyat Sırası",
      soru: "Tüm ürünlerin product_name, price ve fiyata göre çoktan aza sıra numarasını (sira olarak, ROW_NUMBER ile) getiren bir sorgu yaz.",
      ipucu: "ROW_NUMBER() OVER (ORDER BY price DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS sira FROM products;",
      mod: "sonuc",
    },
    {
      id: "pr-window-2",
      seviye: "Kolay",
      baslik: "RANK ile Fiyat Sırası",
      soru: "Aynı sorguyu RANK() ile yaz — product_name, price ve RANK() ile hesaplanan sira sütunlarını getir.",
      ipucu: "RANK() OVER (ORDER BY price DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price, RANK() OVER (ORDER BY price DESC) AS sira FROM products;",
      mod: "sonuc",
    },
    {
      id: "pr-window-3",
      seviye: "Orta",
      baslik: "Kategori Bazlı Sıralama",
      soru: "Ürünlerin product_name, category, price ve HER KATEGORİDE KENDİ İÇİNDE fiyata göre sırasını (sira olarak, RANK ile) getiren bir sorgu yaz.",
      ipucu: "RANK() OVER (PARTITION BY category ORDER BY price DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, category, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS sira FROM products;",
      mod: "sonuc",
    },
    {
      id: "pr-window-4",
      seviye: "Orta",
      baslik: "Kategori Şampiyonları (Pencere ile)",
      soru: "Her kategorideki en pahalı ürünü (sira = 1) pencere fonksiyonuyla bulan bir sorgu yaz — bir alt sorguda RANK hesapla, dış sorguda filtrele.",
      ipucu: "FROM içinde RANK() OVER (PARTITION BY category ORDER BY price DESC) AS sira hesapla, dış sorguda WHERE sira = 1 ekle.",
      cozumSql:
        "SELECT product_name, category, price FROM (SELECT product_name, category, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS sira FROM products) AS t WHERE sira = 1;",
      mod: "sonuc",
    },
    {
      id: "pr-window-5",
      seviye: "Orta",
      baslik: "Önceki Sipariş Tarihi",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE bir önceki sipariş tarihini (onceki_tarih olarak, LAG ile) getiren bir sorgu yaz.",
      ipucu: "LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih FROM orders;",
      mod: "sonuc",
    },
    {
      id: "pr-window-6",
      seviye: "Orta",
      baslik: "Yürüyen Toplam Adet",
      soru: "product_id'si 2 olan order_items satırlarının item_id, quantity ve item_id sırasına göre yürüyen toplam adedini (yuruyen_toplam olarak) getiren bir sorgu yaz.",
      ipucu: "SUM(quantity) OVER (ORDER BY item_id) AS yuruyen_toplam kalıbını kullanabilirsin.",
      cozumSql: "SELECT item_id, quantity, SUM(quantity) OVER (ORDER BY item_id) AS yuruyen_toplam FROM order_items WHERE product_id = 2;",
      mod: "sonuc",
    },
    {
      id: "pr-window-7",
      seviye: "Zor",
      baslik: "Müşteri Başına Sipariş Sırası",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE tarih sırasına göre kaçıncı siparişi olduğunu (siparis_no olarak, COUNT penceresiyle) getiren bir sorgu yaz.",
      ipucu: "COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date) AS siparis_no kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date) AS siparis_no FROM orders;",
      mod: "sonuc",
    },
    {
      id: "pr-window-8",
      seviye: "Zor",
      baslik: "Kategorinin En Ucuz 2 Ürünü",
      soru: "Her kategorideki en ucuz 2 ürünü (product_name, category, price) pencere fonksiyonuyla bulan bir sorgu yaz.",
      ipucu: "FROM içinde RANK() OVER (PARTITION BY category ORDER BY price ASC) AS sira hesapla, dış sorguda WHERE sira <= 2 ekle.",
      cozumSql:
        "SELECT product_name, category, price FROM (SELECT product_name, category, price, RANK() OVER (PARTITION BY category ORDER BY price ASC) AS sira FROM products) AS t WHERE sira <= 2;",
      mod: "sonuc",
    },
    {
      id: "pr-window-9",
      seviye: "Zor",
      baslik: "Sonraki Sipariş Tarihi",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE bir sonraki sipariş tarihini (sonraki_tarih olarak, LEAD ile) getiren bir sorgu yaz.",
      ipucu: "LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS sonraki_tarih kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS sonraki_tarih FROM orders;",
      mod: "sonuc",
    },
    {
      id: "pr-window-10",
      seviye: "Zor",
      baslik: "En Pahalı 2 Ürün (DENSE_RANK)",
      soru: "Tüm ürünler arasında fiyata göre DENSE_RANK ile sıralandığında ilk 2 sırada (dense_sira <= 2) yer alan ürünlerin product_name ve price'ını getiren bir sorgu yaz.",
      ipucu: "FROM içinde DENSE_RANK() OVER (ORDER BY price DESC) AS dense_sira hesapla, dış sorguda WHERE dense_sira <= 2 ekle.",
      cozumSql:
        "SELECT product_name, price FROM (SELECT product_name, price, DENSE_RANK() OVER (ORDER BY price DESC) AS dense_sira FROM products) AS t WHERE dense_sira <= 2;",
      mod: "sonuc",
    },
  ],
});
