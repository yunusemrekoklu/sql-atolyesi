import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const altSorguFromVeIliskili = defineLesson({
  slug: "alt-sorgu-from-ve-iliskili",
  uniteId: 4,
  dersNo: "4.3",
  baslik: "FROM'da Alt Sorgu ve Correlated",
  veritabaniId: eticaretDb.id,
  anlatim: `
Alt sorgular sadece \`WHERE\` içinde yaşamaz. Bu derste iki güçlü teknik göreceksin: bir alt sorguyu **tablo gibi** kullanmak ve bir alt sorguyu **dıştaki sorgunun her satırı için yeniden** çalıştırmak.

## Türetilmiş tablo (derived table): FROM içinde alt sorgu

Bir alt sorguyu \`FROM\`'a yazıp bir takma ad verirsen, onu sanki gerçek bir tabloymuş gibi kullanabilirsin:

\`\`\`sql
SELECT p.product_name, p.price, ka.avg_price
FROM products p
JOIN (
  SELECT category, AVG(price) AS avg_price
  FROM products
  GROUP BY category
) AS ka ON p.category = ka.category
WHERE p.price > ka.avg_price;
\`\`\`

Burada parantez içindeki sorgu önce çalışır, kategori başına ortalama fiyatı içeren **geçici bir tablo** (\`ka\`) üretir. Sonra bu geçici tabloyu \`products\`'a JOIN'leyip, her ürünü **kendi kategorisinin ortalamasıyla** karşılaştırırız. \`FROM\`'daki her alt sorgu mutlaka bir takma ad almalı.

## İlişkili (correlated) alt sorgu

Normal bir alt sorgu bağımsızdır — bir kez çalışır, sonucu dış sorguda kullanılır. **İlişkili alt sorgu** ise dıştaki sorgunun **o anki satırına** bir sütun referansıyla bağlıdır ve kavramsal olarak dış sorgunun her satırı için yeniden değerlendirilir:

\`\`\`sql
SELECT product_name, category, price
FROM products p
WHERE price = (
  SELECT MAX(price) FROM products p2 WHERE p2.category = p.category
);
\`\`\`

Burada iç sorgudaki \`p2.category = p.category\`, dış sorgudaki \`p\`'ye referans veriyor — bu yüzden "ilişkili". Bu sorgu, **her kategorideki en pahalı ürünü** bulur; buna **kategori şampiyonu deseni** denir ve mülakatlarda sık sorulur ("her grubun en yükseği/en düşüğü" problemleri). Ünite 4.4'te bu problemi pencere fonksiyonlarıyla çok daha kısa çözmeyi göreceksin.
`,
  ornekler: [
    { aciklama: "Her ürünü kendi kategorisinin ortalama fiyatıyla karşılaştır:", sql: "SELECT p.product_name, p.category, p.price, ka.avg_price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category;" },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "4-3-1",
      seviye: "Kolay",
      baslik: "Pahalı Kategoriler",
      soru: "Ortalama fiyatı 1000 TL'nin üzerinde olan kategorilerin category ve avg_price sütunlarını, kategori ortalamalarını FROM içinde bir alt sorguyla hesaplayarak getiren bir sorgu yaz.",
      ipucu: "SELECT * FROM (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS t WHERE avg_price > 1000; kalıbını kullanabilirsin.",
      cozumSql: "SELECT category, avg_price FROM (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS t WHERE avg_price > 1000;",
      mod: "sonuc",
    },
    {
      id: "4-3-2",
      seviye: "Orta",
      baslik: "Ürün ve Kategori Ortalaması",
      soru: "Her ürünün product_name, price ve kendi kategorisinin ortalama fiyatını (avg_price olarak) getiren bir sorgu yaz — FROM içinde bir alt sorgu (türetilmiş tablo) kullan.",
      ipucu: "products'ı, kategori bazlı ortalamaları hesaplayan bir alt sorguya category üzerinden JOIN'le.",
      cozumSql:
        "SELECT p.product_name, p.price, ka.avg_price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category;",
      mod: "sonuc",
    },
    {
      id: "4-3-3",
      seviye: "Orta",
      baslik: "Kategori Şampiyonu",
      soru: "Her kategorideki en pahalı ürünü (product_name, category, price) getiren bir sorgu yaz — ilişkili (correlated) alt sorgu kullan.",
      ipucu: "WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT product_name, category, price FROM products p WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p.category);",
      mod: "sonuc",
    },
    {
      id: "4-3-4",
      seviye: "Orta",
      baslik: "Kategori Ortalamasının Üzerindeki Ürünler",
      soru: "Fiyatı, kendi kategorisinin ortalama fiyatından YÜKSEK olan ürünlerin product_name ve price'ını getiren bir sorgu yaz — bir türetilmiş tablo kullan.",
      ipucu: "4.3 dersinin anlatım bölümündeki ana örneği (products JOIN kategori ortalamaları, WHERE p.price > ka.avg_price) temel alabilirsin.",
      cozumSql:
        "SELECT p.product_name, p.price FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category WHERE p.price > ka.avg_price;",
      mod: "sonuc",
    },
    {
      id: "4-3-5",
      seviye: "Zor",
      baslik: "Her Müşterinin Son Siparişi",
      soru: "Her müşterinin en son (en yeni tarihli) siparişini (customer_id, order_id, order_date) getiren bir sorgu yaz — ilişkili alt sorgu kullan.",
      ipucu: "WHERE order_date = (SELECT MAX(order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date FROM orders o WHERE order_date = (SELECT MAX(order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id);",
      mod: "sonuc",
    },
    {
      id: "4-3-6",
      seviye: "Zor",
      baslik: "Kategorinin En Ucuzu",
      soru: "Her kategorideki en ucuz ürünü (product_name, category, price) getiren bir sorgu yaz — türetilmiş tablo kullanmadan, sadece ilişkili alt sorguyla çöz.",
      ipucu: "WHERE price = (SELECT MIN(price) FROM products p2 WHERE p2.category = p.category) kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT product_name, category, price FROM products p WHERE price = (SELECT MIN(price) FROM products p2 WHERE p2.category = p.category);",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-3-q1",
      soru: "FROM içinde kullanılan bir alt sorgu (türetilmiş tablo) için ne zorunludur?",
      secenekler: [
        "Hiçbir şey, doğrudan kullanılabilir",
        "Mutlaka bir takma ad (alias) verilmesi",
        "Sadece tek bir sütun döndürmesi",
        "WHERE koşulu içermemesi",
      ],
      dogruIndex: 1,
      aciklama: "FROM içindeki bir alt sorgu, sanki bir tabloymuş gibi davranır ve SQL'in ona referans verebilmesi için mutlaka bir takma ad almalıdır.",
    },
    {
      id: "4-3-q2",
      soru: "İlişkili (correlated) alt sorgu, normal (bağımsız) alt sorgudan nasıl farklıdır?",
      secenekler: [
        "Hiçbir farkı yoktur",
        "İlişkili alt sorgu, dıştaki sorgunun o anki satırına bir sütun referansıyla bağlıdır",
        "İlişkili alt sorgu sadece INSERT ile kullanılabilir",
        "İlişkili alt sorgu her zaman FROM içinde yazılır",
      ],
      dogruIndex: 1,
      aciklama: "İlişkili alt sorgu, dış sorgudaki bir tabloya (ör. p.category) referans verir; bu bağ, sonucun dış sorgunun her satırına göre değişmesini sağlar.",
    },
    {
      id: "4-3-q3",
      soru: "'Kategori şampiyonu' deseni ne tür bir problemi çözer?",
      secenekler: [
        "Bir tablodaki tüm satırları silme",
        "Her grup içindeki en yüksek (ya da en düşük) değere sahip satırı bulma",
        "İki tabloyu birleştirme",
        "Bir sütunun veri tipini değiştirme",
      ],
      dogruIndex: 1,
      aciklama: "Kategori şampiyonu deseni, her grubun (ör. her kategorinin) en yüksek/en düşük değerine sahip satırını bulmak için kullanılan klasik bir SQL desenidir.",
    },
    {
      id: "4-3-q4",
      soru: "SELECT p.product_name FROM products p JOIN (SELECT category, AVG(price) AS avg_price FROM products GROUP BY category) AS ka ON p.category = ka.category; ifadesindeki 'ka' nedir?",
      secenekler: [
        "Bir SQL anahtar kelimesi",
        "FROM içindeki alt sorguya verilen takma ad (türetilmiş tablo adı)",
        "Bir sütun adı",
        "Bir hata mesajı",
      ],
      dogruIndex: 1,
      aciklama: "'ka', parantez içindeki alt sorgunun (türetilmiş tablonun) takma adıdır; sorgunun geri kalanı ona bu adla referans verir.",
    },
  ],
});
