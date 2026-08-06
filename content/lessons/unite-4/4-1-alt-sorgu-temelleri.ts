import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const altSorguTemelleri = defineLesson({
  slug: "alt-sorgu-temelleri",
  uniteId: 4,
  dersNo: "4.1",
  baslik: "Alt Sorgu Temelleri",
  veritabaniId: eticaretDb.id,
  anlatim: `
Bazen bir sorgunun \`WHERE\`'i, önce başka bir sorgunun sonucunu bilmeni gerektirir. "Ortalama fiyatın üzerindeki ürünler" dediğinde, önce ortalama fiyatı hesaplaman, sonra bu değere göre filtrelemen gerekir. İşte **alt sorgu (subquery)** — bir sorgunun içine yerleştirilmiş başka bir sorgu — tam olarak bunu sağlar.

## Skaler alt sorgu: tek bir değer döndüren sorgu

\`\`\`sql
SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
\`\`\`

Burada parantez içindeki \`SELECT AVG(price) FROM products\` bir **alt sorgu**. SQL önce bunu çalıştırır, tek bir sayı elde eder (ortalama fiyat), sonra bu sayıyı ana sorgunun \`WHERE price > ...\` koşulunda kullanır. Alt sorgu, ana sorgudan **önce** çalışır.

Bu tür bir alt sorguya **skaler alt sorgu** denir çünkü tam olarak **tek bir satır, tek bir sütun** (yani tek bir değer) döndürür. \`=\`, \`>\`, \`<\` gibi karşılaştırma operatörleriyle kullanılan alt sorgular mutlaka skaler olmalıdır — birden fazla satır dönerse SQL hata verir.

## Alt sorgu ile ID bulma

Alt sorgunun en yaygın kullanımlarından biri: bir değeri (ör. bir isim) bilip, ona karşılık gelen ID'yi bulmak ve bu ID ile başka bir tabloyu filtrelemek.

\`\`\`sql
SELECT * FROM orders
WHERE customer_id = (SELECT customer_id FROM customers WHERE full_name = 'Caner Şahin');
\`\`\`

Bu, "önce Caner Şahin'in \`customer_id\`'sini bul, sonra o \`customer_id\`'ye ait siparişleri getir" mantığıyla çalışır — iki ayrı sorgu yazıp sonucu elle birleştirmek yerine, SQL bunu tek adımda yapar.
`,
  ornekler: [
    { aciklama: "Ortalama fiyatın üzerindeki ürünleri getir:", sql: "SELECT product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);" },
  ],
  onizlemeTablolari: ["products", "customers"],
  alistirmalar: [
    {
      id: "4-1-1",
      seviye: "Kolay",
      baslik: "Ortalama Üstü Ürünler",
      soru: "Fiyatı, tüm ürünlerin ortalama fiyatının üzerinde olan ürünlerin product_name ve price'ını getiren bir sorgu yaz.",
      ipucu: "WHERE price > (SELECT AVG(price) FROM products) kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
      mod: "sonuc",
    },
    {
      id: "4-1-2",
      seviye: "Kolay",
      baslik: "En Pahalı Ürün",
      soru: "Fiyatı, tüm ürünler arasındaki en yüksek fiyata eşit olan ürünü (product_name, price) getiren bir sorgu yaz.",
      ipucu: "WHERE price = (SELECT MAX(price) FROM products) kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, price FROM products WHERE price = (SELECT MAX(price) FROM products);",
      mod: "sonuc",
    },
    {
      id: "4-1-3",
      seviye: "Orta",
      baslik: "Caner Şahin'in Siparişleri",
      soru: "full_name'i 'Caner Şahin' olan müşterinin tüm siparişlerini (orders tablosundaki tüm sütunlarla) getiren bir sorgu yaz — customer_id'yi bir alt sorguyla bul.",
      ipucu: "WHERE customer_id = (SELECT customer_id FROM customers WHERE full_name = 'Caner Şahin') kalıbını kullanabilirsin.",
      cozumSql: "SELECT * FROM orders WHERE customer_id = (SELECT customer_id FROM customers WHERE full_name = 'Caner Şahin');",
      mod: "sonuc",
    },
    {
      id: "4-1-4",
      seviye: "Orta",
      baslik: "Stoksuz Ürünün Fiyatından Ucuz Ürünler",
      soru: "Stok adedi (stock_quantity) en düşük olan ürünün fiyatından DAHA UCUZ ürünlerin product_name ve price'ını getiren bir sorgu yaz.",
      ipucu: "Önce bir alt sorguyla en düşük stoklu ürünün fiyatını bul: SELECT price FROM products ORDER BY stock_quantity ASC LIMIT 1. Sonra WHERE price < (...) ile filtrele.",
      cozumSql: "SELECT product_name, price FROM products WHERE price < (SELECT price FROM products ORDER BY stock_quantity ASC LIMIT 1);",
      mod: "sonuc",
    },
    {
      id: "4-1-5",
      seviye: "Zor",
      baslik: "Ev Aletleri Rekoru",
      soru: "category'si 'Ev Aletleri' olan ürünler arasındaki en yüksek fiyata EŞİT ya da ondan YÜKSEK fiyatlı tüm ürünlerin (kategorisi ne olursa olsun) product_name ve price'ını getiren bir sorgu yaz.",
      ipucu: "Alt sorguda WHERE category = 'Ev Aletleri' filtresiyle MAX(price) bul, dış sorguda kategoriye göre filtreleme yapma.",
      cozumSql:
        "SELECT product_name, price FROM products WHERE price >= (SELECT MAX(price) FROM products WHERE category = 'Ev Aletleri');",
      mod: "sonuc",
    },
    {
      id: "4-1-6",
      seviye: "Zor",
      baslik: "En Çok Sipariş Veren Müşteri",
      soru: "En çok siparişi olan müşterinin full_name ve city bilgilerini getiren bir sorgu yaz.",
      ipucu: "Alt sorguda orders'ı customer_id'ye göre GROUP BY'la, COUNT(*) ile sırala ve ORDER BY ... DESC LIMIT 1 ile en çok sipariş vereni bul; dış sorguda customers'tan bu customer_id'yi filtrele.",
      cozumSql:
        "SELECT full_name, city FROM customers WHERE customer_id = (SELECT customer_id FROM orders GROUP BY customer_id ORDER BY COUNT(*) DESC LIMIT 1);",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-1-q1",
      soru: "Bir alt sorgu (subquery) nedir?",
      secenekler: [
        "Bir sorgunun içine yerleştirilmiş başka bir sorgu",
        "Bir tabloyu silen özel bir komut",
        "Sadece INSERT ile birlikte kullanılan bir yapı",
        "İki tabloyu JOIN'lemenin başka bir adı",
      ],
      dogruIndex: 0,
      aciklama: "Alt sorgu, bir SELECT ifadesinin (genellikle WHERE içinde) parantez içine yerleştirilmiş başka bir SELECT ifadesidir.",
    },
    {
      id: "4-1-q2",
      soru: "= veya > gibi bir karşılaştırma operatörüyle kullanılan bir alt sorgu ne döndürmelidir?",
      secenekler: [
        "Herhangi sayıda satır ve sütun",
        "Tam olarak tek bir satır ve tek bir sütun (skaler değer)",
        "En az iki satır",
        "Sadece metin değerleri",
      ],
      dogruIndex: 1,
      aciklama: "= veya > gibi operatörler tek bir değerle karşılaştırma yapar; alt sorgu birden fazla satır döndürürse SQL hata verir.",
    },
    {
      id: "4-1-q3",
      soru: "SELECT * FROM orders WHERE customer_id = (SELECT customer_id FROM customers WHERE full_name = 'Caner Şahin'); sorgusunda hangi kısım önce çalışır?",
      secenekler: [
        "İkisi aynı anda çalışır",
        "Önce alt sorgu (parantez içindeki), sonra ana sorgu",
        "Önce ana sorgu, sonra alt sorgu",
        "Sıra rastgeledir",
      ],
      dogruIndex: 1,
      aciklama: "SQL, önce alt sorguyu çalıştırıp tek bir customer_id değeri elde eder, sonra bu değeri ana sorgunun WHERE koşulunda kullanır.",
    },
    {
      id: "4-1-q4",
      soru: "Bir alt sorgu birden fazla satır döndürürse ve = operatörüyle kullanılırsa ne olur?",
      secenekler: [
        "SQL, ilk satırı otomatik olarak seçer",
        "SQL bir hata verir",
        "Sonuç her zaman NULL olur",
        "Tüm satırlar otomatik olarak birleştirilir",
      ],
      dogruIndex: 1,
      aciklama: "= operatörü tek bir değer bekler; alt sorgu birden fazla satır döndürürse SQL çalışma zamanında hata fırlatır. Bu durumda IN kullanmak gerekir (bir sonraki ders).",
    },
  ],
});
