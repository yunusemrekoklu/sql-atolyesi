import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const groupBy = defineLesson({
  slug: "group-by",
  uniteId: 2,
  dersNo: "2.5",
  baslik: "GROUP BY",
  veritabaniId: eticaretDb.id,
  anlatim: `
Önceki derste toplulaştırma fonksiyonlarını (\`COUNT\`, \`SUM\`, \`AVG\`...) **tüm tablo** üzerinde kullandık. \`GROUP BY\` ile bunları **her grup için ayrı ayrı** hesaplayabiliriz — ör. "her kategoride kaç ürün var?"

## Temel GROUP BY kullanımı

\`GROUP BY\`, satırları belirttiğin sütun(lar)daki **aynı değerlere** göre gruplara ayırır; toplulaştırma fonksiyonları da artık tüm tablo yerine **her grup için ayrı ayrı** hesaplanır:

\`\`\`sql
SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;
\`\`\`

Bu sorgu, her farklı \`category\` değeri için bir satır döndürür — o kategorideki ürün sayısıyla birlikte.

## Sık yapılan bir hata

\`SELECT\` listesindeki bir sütun ne \`GROUP BY\`'da ne de bir toplulaştırma fonksiyonu içinde olursa hataya yol açar:

\`\`\`sql
-- HATALI: product_name GROUP BY'da yok ve toplulaştırılmamış
SELECT category, product_name, COUNT(*) FROM products GROUP BY category;
\`\`\`

Bir kategoride birden fazla ürün varsa, SQLite hangi \`product_name\`'i göstereceğini bilemez. **Kural:** \`SELECT\`'teki her sütun ya \`GROUP BY\`'da olmalı ya da bir toplulaştırma fonksiyonu içinde kullanılmalı.

## Çoklu sütunla gruplama

\`GROUP BY\`'a birden fazla sütun verirsen, o sütunların **birlikte** oluşturduğu her benzersiz kombinasyon ayrı bir grup sayılır — tıpkı \`DISTINCT\`'in birden fazla sütunla çalışması gibi.
`,
  ornekler: [
    { aciklama: "Her kategorideki ürün sayısını hesapla:", sql: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;" },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-5-1",
      seviye: "Kolay",
      baslik: "Kategori Başına Ürün Sayısı",
      soru: "Her kategorideki ürün sayısını (category, product_count) getiren bir sorgu yaz.",
      ipucu: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;",
      cozumSql: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category;",
      mod: "sonuc",
    },
    {
      id: "2-5-2",
      seviye: "Kolay",
      baslik: "Şehir Başına Müşteri Sayısı",
      soru: "Her şehirdeki müşteri sayısını (city, customer_count) getiren bir sorgu yaz.",
      ipucu: "GROUP BY city kullanarak müşterileri şehre göre grupla.",
      cozumSql: "SELECT city, COUNT(*) AS customer_count FROM customers GROUP BY city;",
      mod: "sonuc",
    },
    {
      id: "2-5-3",
      seviye: "Orta",
      baslik: "Kategori Başına Ortalama Fiyat",
      soru: "Her kategorinin ortalama ürün fiyatını (category, avg_price) getiren bir sorgu yaz.",
      ipucu: "AVG(price)'ı GROUP BY category ile birleştir.",
      cozumSql: "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;",
      mod: "sonuc",
    },
    {
      id: "2-5-4",
      seviye: "Orta",
      baslik: "Duruma Göre Sipariş Sayısı",
      soru: "Her sipariş durumundaki (status) sipariş sayısını, sayıya göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "GROUP BY status yaptıktan sonra ORDER BY ile COUNT sonucunu sırala.",
      cozumSql: "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-5-5",
      seviye: "Orta",
      baslik: "Ürün Başına Toplam Satış Adedi",
      soru: "order_items tablosunda her product_id için toplam satılan adedi (product_id, total_quantity) getiren bir sorgu yaz.",
      ipucu: "SELECT product_id, SUM(quantity) AS total_quantity FROM order_items GROUP BY product_id;",
      cozumSql: "SELECT product_id, SUM(quantity) AS total_quantity FROM order_items GROUP BY product_id;",
      mod: "sonuc",
    },
    {
      id: "2-5-6",
      seviye: "Zor",
      baslik: "En Çok Sipariş Veren Müşteriler",
      soru: "Her müşterinin (customer_id) kaç siparişi olduğunu, sipariş sayısına göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "GROUP BY customer_id ... ORDER BY COUNT(*) DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id ORDER BY order_count DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "2-5-q1",
      soru: "GROUP BY ne işe yarar?",
      secenekler: [
        "Satırları alfabetik sıralar",
        "Satırları belirtilen sütun(lar)daki aynı değerlere göre gruplara ayırır",
        "Belirli bir satır sayısıyla sınırlar",
        "İki tabloyu birleştirir",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY, satırları grup grup toplayarak toplulaştırma fonksiyonlarının her grup için ayrı hesaplanmasını sağlar.",
    },
    {
      id: "2-5-q2",
      soru: "SELECT category, product_name, COUNT(*) FROM products GROUP BY category; sorgusu neden hataya yol açar?",
      secenekler: [
        "COUNT(*) GROUP BY ile kullanılamaz",
        "product_name ne GROUP BY'da ne de bir toplulaştırma fonksiyonu içinde — SQLite hangi değeri göstereceğini bilemez",
        "category sütunu metin olduğu için gruplanamaz",
        "Bu sorgu hataya yol açmaz",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY kullanıldığında, SELECT'teki toplulaştırılmamış her sütun GROUP BY listesinde de olmalıdır.",
    },
    {
      id: "2-5-q3",
      soru: "GROUP BY olmadan COUNT(*) gibi bir toplulaştırma fonksiyonu kullanılırsa ne olur?",
      secenekler: [
        "Hata verir",
        "Tüm tablo tek bir grup sayılır, tek satırlık bir sonuç döner",
        "Her satır için ayrı bir sonuç döner",
        "Sorgu hiçbir şey döndürmez",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY belirtilmezse, toplulaştırma fonksiyonu tüm tabloyu (veya WHERE'den geçen satırları) tek bir grup olarak ele alır.",
    },
    {
      id: "2-5-q4",
      soru: "GROUP BY birden fazla sütunla kullanılabilir mi?",
      secenekler: [
        "Hayır, sadece tek sütunla kullanılabilir",
        "Evet, sütunların birlikte oluşturduğu her benzersiz kombinasyon ayrı bir grup olur",
        "Evet ama en fazla iki sütunla",
        "Sadece sayısal sütunlarla kullanılabilir",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY sutun1, sutun2 yazıldığında, bu iki sütunun birlikte oluşturduğu her farklı kombinasyon kendi grubunu oluşturur.",
    },
  ],
});
