import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const tekrarAltSorguVePencere = defineLesson({
  slug: "tekrar-alt-sorgu-ve-pencere",
  uniteId: 4,
  dersNo: "4.T",
  baslik: "Tekrar: Alt Sorgu ve Pencere Fonksiyonları",
  veritabaniId: eticaretDb.id,
  anlatim: `
Ünite 4'ü tamamladın! Skaler alt sorgular, \`IN\`/\`EXISTS\`, türetilmiş tablolar, ilişkili alt sorgular ve pencere fonksiyonları — hepsini \`eticaret\` verisi üzerinde karma bir setle pekiştireceksin.

## Hangi tekniği ne zaman kullanmalı?

- Tek bir değer mi lazım (ortalama, maksimum)? → **skaler alt sorgu**
- Bir listeyle mi karşılaştırıyorsun? → **IN** (ya da eşleşmeyenler için dikkatli kullanılan **NOT IN**)
- Sadece "var mı yok mu" mu önemli? → **EXISTS** / **NOT EXISTS** (NULL tuzağından bağımsız)
- Bir hesaplamayı tablo gibi kullanıp JOIN'lemek mi istiyorsun? → **FROM içinde alt sorgu (türetilmiş tablo)**
- Her satırı "kendi grubuyla" mı karşılaştırıyorsun? → **ilişkili alt sorgu** ya da **pencere fonksiyonu**

Aşağıdaki alıştırmalarda bu kararı sen vereceksin.
`,
  ornekler: [
    { aciklama: "Her ürünün fiyatını kategori ortalamasıyla karşılaştır:", sql: "SELECT p.product_name, p.price, ka.avg_price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category;" },
  ],
  onizlemeTablolari: ["products", "customers", "orders"],
  alistirmalar: [
    {
      id: "4-t-1",
      seviye: "Kolay",
      baslik: "Ortalama Üstü Ürünler",
      soru: "Fiyatı, tüm ürünlerin ortalamasının üzerinde olan ürünlerin product_name ve price'ını getiren bir sorgu yaz.",
      ipucu: "WHERE price > (SELECT AVG(price) FROM products) kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
      mod: "sonuc",
    },
    {
      id: "4-t-2",
      seviye: "Kolay",
      baslik: "Sessiz Müşteriler",
      soru: "Hiç siparişi olmayan müşterilerin full_name'ini NOT EXISTS kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id) kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);",
      mod: "sonuc",
    },
    {
      id: "4-t-3",
      seviye: "Orta",
      baslik: "Kategori Şampiyonu (Tekrar)",
      soru: "Her kategorideki en pahalı ürünü (product_name, category, price) ilişkili alt sorgu kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT product_name, category, price FROM products p WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category);",
      mod: "sonuc",
    },
    {
      id: "4-t-4",
      seviye: "Orta",
      baslik: "Fiyat Sıralaması",
      soru: "Tüm ürünlerin product_name, price ve fiyata göre çoktan aza sırasını (sira olarak, RANK ile) getiren bir sorgu yaz.",
      ipucu: "RANK() OVER (ORDER BY price DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price, RANK() OVER (ORDER BY price DESC) AS sira FROM products;",
      mod: "sonuc",
    },
    {
      id: "4-t-5",
      seviye: "Orta",
      baslik: "Sipariş Geçmişi",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE bir önceki sipariş tarihini (onceki_tarih olarak, LAG ile) getiren bir sorgu yaz.",
      ipucu: "LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih FROM orders;",
      mod: "sonuc",
    },
    {
      id: "4-t-6",
      seviye: "Zor",
      baslik: "Kategori Ortalamasının Üzerindekiler",
      soru: "Fiyatı kendi kategorisinin ortalamasından yüksek olan ürünlerin product_name, category ve price'ını getiren bir sorgu yaz — türetilmiş tablo (FROM içinde alt sorgu) kullan.",
      ipucu: "products'ı, kategori ortalamalarını hesaplayan bir alt sorguya category üzerinden JOIN'le, sonra WHERE p.price > ka.avg_price ekle.",
      cozumSql:
        "SELECT p.product_name, p.category, p.price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category WHERE p.price > ka.avg_price;",
      mod: "sonuc",
    },
    {
      id: "4-t-7",
      seviye: "Zor",
      baslik: "Sadık Müşteriler",
      soru: "En az 3 siparişi olan müşterilerin full_name'ini getiren bir sorgu yaz — IN ve bir GROUP BY/HAVING içeren alt sorgu kullan.",
      ipucu: "WHERE customer_id IN (SELECT customer_id FROM orders GROUP BY customer_id HAVING COUNT(*) >= 3) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT full_name FROM customers WHERE customer_id IN (SELECT customer_id FROM orders GROUP BY customer_id HAVING COUNT(*) >= 3);",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-t-q1",
      soru: "Bir listeyle karşılaştırma yapman gerektiğinde (tek değer değil) hangi operatörü kullanırsın?",
      secenekler: ["=", "IN", ">", "LIKE"],
      dogruIndex: 1,
      aciklama: "IN, bir değerin bir alt sorgunun döndürdüğü değerler listesinde olup olmadığını kontrol etmek için kullanılır.",
    },
    {
      id: "4-t-q2",
      soru: "NOT IN yerine NOT EXISTS kullanmanın en önemli avantajı nedir?",
      secenekler: [
        "NOT EXISTS her zaman daha kısa yazılır",
        "NOT EXISTS, alt sorgu sonucunda NULL bulunsa bile beklenmedik şekilde boş sonuç dönmez",
        "Aralarında hiçbir fark yoktur",
        "NOT EXISTS sadece sayısal sütunlarla çalışır",
      ],
      dogruIndex: 1,
      aciklama: "NOT IN, alt sorgunun listesinde bir NULL varsa hiç satır döndürmez (NULL tuzağı); NOT EXISTS bu sorunu yaşamaz.",
    },
    {
      id: "4-t-q3",
      soru: "Pencere fonksiyonları ile ilişkili (correlated) alt sorgular arasındaki temel benzerlik nedir?",
      secenekler: [
        "İkisi de sadece INSERT ile kullanılır",
        "İkisi de bir satırı 'kendi grubuyla' karşılaştırma problemini çözebilir (ör. kategori şampiyonu)",
        "İkisi de tabloları siler",
        "Aralarında hiçbir ortak nokta yoktur",
      ],
      dogruIndex: 1,
      aciklama: "Her ikisi de bir satırı kendi grubuyla (ör. kategorisiyle) ilişkilendirip karşılaştırma problemini çözebilir; pencere fonksiyonları genelde daha kısa ve okunaklıdır.",
    },
    {
      id: "4-t-q4",
      soru: "FROM içinde bir alt sorgu (türetilmiş tablo) ne zaman özellikle kullanışlıdır?",
      secenekler: [
        "Hiçbir zaman, WHERE içindeki alt sorgular her zaman yeterlidir",
        "Bir hesaplamanın (ör. kategori ortalamaları) sonucunu, başka bir tabloyla JOIN'lemek istediğinde",
        "Sadece INSERT işlemlerinde",
        "Sadece tek satırlık sonuçlar için",
      ],
      dogruIndex: 1,
      aciklama: "FROM içindeki alt sorgu, önceden hesaplanmış bir sonucu (ör. gruplanmış ortalamalar) sanki bir tabloymuş gibi başka tablolarla JOIN'lemeni sağlar.",
    },
    {
      id: "4-t-q5",
      soru: "PARTITION BY olmadan kullanılan bir pencere fonksiyonu (ör. RANK() OVER (ORDER BY price DESC)) neyi baz alır?",
      secenekler: [
        "Her satırı kendi başına, hiçbir gruplamaya tabi tutmadan",
        "Tüm tabloyu tek bir grup olarak kabul eder",
        "Sadece ilk 10 satırı",
        "Rastgele bir alt küme",
      ],
      dogruIndex: 1,
      aciklama: "PARTITION BY belirtilmediğinde, pencere fonksiyonu tüm sonuç kümesini tek bir grup olarak ele alır.",
    },
  ],
});
