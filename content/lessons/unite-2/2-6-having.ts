import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const having = defineLesson({
  slug: "having",
  uniteId: 2,
  dersNo: "2.6",
  baslik: "HAVING",
  veritabaniId: eticaretDb.id,
  anlatim: `
\`GROUP BY\` ile grupladığın sonuçları bir koşula göre filtrelemek istediğinde \`WHERE\` **işe yaramaz** — çünkü \`WHERE\`, gruplama henüz yapılmadan çalışır. Bunun için \`HAVING\` var; bu, mülakatlarda en sık sorulan SQL farklarından biridir.

## WHERE vs HAVING

- **\`WHERE\`**: gruplama yapılmadan **önce**, tek tek satırları filtreler. İçinde toplulaştırma fonksiyonu (\`COUNT\`, \`SUM\`...) **kullanamazsın** — çünkü o an henüz hesaplanmamıştır.
- **\`HAVING\`**: gruplama yapıldıktan **sonra**, oluşan grupları filtreler. İçinde toplulaştırma fonksiyonu kullanmak **asıl amacıdır**.

\`\`\`sql
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING COUNT(*) >= 4;
\`\`\`

Bu sorgu, önce ürünleri kategoriye göre gruplar, sonra sadece **4 veya daha fazla ürünü olan** kategorileri sonuca dahil eder.

## WHERE ve HAVING birlikte

İkisini aynı sorguda kullanabilirsin — \`WHERE\` gruplamadan önceki satırları, \`HAVING\` gruplamadan sonraki grupları filtreler:

\`\`\`sql
SELECT category, AVG(price) AS avg_price
FROM products
WHERE category != 'Giyim'
GROUP BY category
HAVING AVG(price) > 1700;
\`\`\`

Sıralama önemli: SQL'de \`WHERE\` her zaman \`GROUP BY\`'dan önce, \`HAVING\` ise \`GROUP BY\`'dan sonra yazılır. Bir sonraki derste bu sırayı tüm sorgu için netleştireceğiz.
`,
  ornekler: [
    { aciklama: "En az 3 ürünü olan kategorileri listele:", sql: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category HAVING COUNT(*) >= 3;" },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-6-1",
      seviye: "Kolay",
      baslik: "Kalabalık Kategoriler",
      soru: "En az 4 ürünü olan kategorileri, ürün sayısıyla birlikte (category, product_count) getiren bir sorgu yaz.",
      ipucu: "GROUP BY category HAVING COUNT(*) >= 4 kalıbını kullanabilirsin.",
      cozumSql: "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category HAVING COUNT(*) >= 4;",
      mod: "sonuc",
    },
    {
      id: "2-6-2",
      seviye: "Kolay",
      baslik: "Ortalaması Yüksek Kategoriler",
      soru: "Ortalama ürün fiyatı 1000 TL'nin üzerinde olan kategorileri, ortalama fiyatla birlikte getiren bir sorgu yaz.",
      ipucu: "GROUP BY category HAVING AVG(price) > 1000 kalıbını kullanabilirsin.",
      cozumSql: "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 1000;",
      mod: "sonuc",
    },
    {
      id: "2-6-3",
      seviye: "Orta",
      baslik: "Çok Sipariş Veren Müşteriler",
      soru: "En az 2 siparişi olan müşterilerin customer_id'sini ve sipariş sayısını getiren bir sorgu yaz.",
      ipucu: "GROUP BY customer_id HAVING COUNT(*) >= 2 kalıbını kullanabilirsin.",
      cozumSql: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
    {
      id: "2-6-4",
      seviye: "Orta",
      baslik: "WHERE ve HAVING Birlikte",
      soru: "'Giyim' HARİÇ kategorilerden, ortalama fiyatı 1700 TL'nin üzerinde olanları (category, avg_price) getiren bir sorgu yaz — hem WHERE hem HAVING kullan.",
      ipucu: "Önce WHERE category != 'Giyim' ile satırları filtrele, sonra GROUP BY category HAVING AVG(price) > 1700 ekle.",
      cozumSql: "SELECT category, AVG(price) AS avg_price FROM products WHERE category != 'Giyim' GROUP BY category HAVING AVG(price) > 1700;",
      mod: "sonuc",
    },
    {
      id: "2-6-5",
      seviye: "Zor",
      baslik: "Çok Satan Ürünler",
      soru: "order_items tablosunda toplam satılan adedi 3 veya daha fazla olan ürünlerin product_id'sini ve toplam adedini getiren bir sorgu yaz.",
      ipucu: "GROUP BY product_id HAVING SUM(quantity) >= 3 kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_id, SUM(quantity) AS total_quantity FROM order_items GROUP BY product_id HAVING SUM(quantity) >= 3;",
      mod: "sonuc",
    },
    {
      id: "2-6-6",
      seviye: "Zor",
      baslik: "Sadık Müşteriler (Teslim Edilen)",
      soru: "Durumu 'Teslim Edildi' olan siparişler arasından, en az 2 siparişi teslim edilmiş müşterilerin customer_id'sini ve teslim sayısını getiren bir sorgu yaz.",
      ipucu: "Önce WHERE status = 'Teslim Edildi' ile filtrele, sonra GROUP BY customer_id HAVING COUNT(*) >= 2 ekle.",
      cozumSql:
        "SELECT customer_id, COUNT(*) AS delivered_count FROM orders WHERE status = 'Teslim Edildi' GROUP BY customer_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "2-6-q1",
      soru: "WHERE ile HAVING arasındaki temel fark nedir?",
      secenekler: [
        "Aralarında fark yoktur, ikisi de aynı işi yapar",
        "WHERE gruplamadan ÖNCE satırları, HAVING gruplamadan SONRA grupları filtreler",
        "WHERE sadece sayılarla, HAVING sadece metinlerle çalışır",
        "HAVING her zaman WHERE'den önce yazılır",
      ],
      dogruIndex: 1,
      aciklama: "WHERE, tek tek satırları GROUP BY'dan önce filtreler; HAVING ise oluşan grupları GROUP BY'dan sonra filtreler.",
    },
    {
      id: "2-6-q2",
      soru: "HAVING içinde COUNT(*) gibi bir toplulaştırma fonksiyonu kullanabilir misin?",
      secenekler: [
        "Hayır, hiçbir zaman",
        "Evet, HAVING'in asıl var oluş amacı budur",
        "Sadece COUNT ile, SUM ile kullanılamaz",
        "Sadece GROUP BY olmadan kullanılırsa",
      ],
      dogruIndex: 1,
      aciklama: "HAVING, grupları toplulaştırma sonuçlarına göre filtrelemek için tasarlanmıştır — bu yüzden içinde COUNT/SUM/AVG gibi fonksiyonlar rahatlıkla kullanılır.",
    },
    {
      id: "2-6-q3",
      soru: "WHERE içinde COUNT(*) gibi bir toplulaştırma fonksiyonu kullanmaya çalışırsan ne olur?",
      secenekler: [
        "Beklendiği gibi çalışır",
        "Hata verir; toplulaştırma fonksiyonları WHERE çalıştığı anda henüz hesaplanmamıştır",
        "Sonuç her zaman NULL olur",
        "Sadece GROUP BY ile birlikte çalışır",
      ],
      dogruIndex: 1,
      aciklama: "WHERE, GROUP BY'dan önce çalıştığı için toplulaştırma sonuçları henüz mevcut değildir; bu tür filtreler için HAVING kullanılmalıdır.",
    },
    {
      id: "2-6-q4",
      soru: "GROUP BY olmadan HAVING kullanılabilir mi?",
      secenekler: [
        "Hayır, GROUP BY olmadan HAVING söz dizimi hatası verir",
        "Evet ama nadirdir; bu durumda tüm tablo tek grup sayılır",
        "Evet, HAVING her zaman GROUP BY'ın yerini alabilir",
        "Sadece SELECT * ile kullanılabilir",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY olmadan da HAVING teknik olarak geçerlidir (tüm tablo tek grup sayılır) ama pratikte neredeyse her zaman GROUP BY ile birlikte kullanılır.",
    },
  ],
});
