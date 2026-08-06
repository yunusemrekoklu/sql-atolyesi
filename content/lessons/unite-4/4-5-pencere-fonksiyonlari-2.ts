import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const pencereFonksiyonlari2 = defineLesson({
  slug: "pencere-fonksiyonlari-2",
  uniteId: 4,
  dersNo: "4.5",
  baslik: "Pencere Fonksiyonları II",
  veritabaniId: eticaretDb.id,
  anlatim: `
*(İleri rozetli — bu ders, pencere fonksiyonlarını bir adım daha ileri götürür.)*

Bir önceki derste bir satırın **kendi grubu içindeki sırasını** bulmayı öğrendin. Bu derste iki yeni şey göreceksin: bir satırdan **komşu satırlara** erişmek (\`LAG\`/\`LEAD\`) ve **yürüyen toplam** hesaplamak.

## LAG ve LEAD: komşu satırlara erişim

\`\`\`sql
SELECT order_id, order_date,
       LAG(order_date) OVER (ORDER BY order_date) AS onceki_tarih
FROM orders
WHERE customer_id = 1;
\`\`\`

- **LAG(sütun)**: sıralamada **bir önceki** satırın değerini getirir. İlk satır için "önceki" olmadığından sonuç \`NULL\`'dur.
- **LEAD(sütun)**: sıralamada **bir sonraki** satırın değerini getirir. Son satır için sonuç \`NULL\`'dur.

Bu, "bir önceki siparişine göre ne değişti?" gibi soruları normalde JOIN ve alt sorgularla uğraşarak çözmen gereken bir problemi tek satırda çözer.

## Yürüyen toplam (running total)

\`ORDER BY\` ile birlikte bir toplulaştırma fonksiyonunu \`OVER\` içinde kullanırsan, o satıra kadar olan **birikimli** bir hesaplama elde edersin:

\`\`\`sql
SELECT item_id, quantity,
       SUM(quantity) OVER (ORDER BY item_id) AS yuruyen_toplam
FROM order_items
WHERE product_id = 1;
\`\`\`

Her satırdaki \`yuruyen_toplam\`, o satıra kadarki (kendisi dahil) tüm \`quantity\` değerlerinin toplamıdır — SQLite'ta \`ORDER BY\` olan bir pencerede varsayılan çerçeve tam olarak budur ("baştan şu ana kadar"). Aynı mantıkla \`AVG(...) OVER (ORDER BY ...)\` ile **yürüyen ortalama** da hesaplayabilirsin.

\`PARTITION BY\` ile birlikte kullanıldığında, hem \`LAG\`/\`LEAD\` hem de yürüyen toplam **her grup kendi içinde sıfırdan** hesaplanır — tıpkı bir önceki derste gördüğün \`RANK\`/\`ROW_NUMBER\` gibi.
`,
  ornekler: [
    { aciklama: "customer_id'si 1 olan müşterinin siparişlerini önceki sipariş tarihiyle birlikte getir:", sql: "SELECT order_id, order_date, LAG(order_date) OVER (ORDER BY order_date) AS onceki_tarih FROM orders WHERE customer_id = 1;" },
  ],
  onizlemeTablolari: ["orders", "order_items"],
  alistirmalar: [
    {
      id: "4-5-1",
      seviye: "Kolay",
      baslik: "Önceki Sipariş Tarihi",
      soru: "customer_id'si 1 olan müşterinin siparişlerinin order_id, order_date ve bir önceki siparişinin tarihini (onceki_tarih olarak, LAG ile) getiren bir sorgu yaz.",
      ipucu: "LAG(order_date) OVER (ORDER BY order_date) AS onceki_tarih kalıbını kullanabilirsin.",
      cozumSql: "SELECT order_id, order_date, LAG(order_date) OVER (ORDER BY order_date) AS onceki_tarih FROM orders WHERE customer_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-5-2",
      seviye: "Orta",
      baslik: "Sonraki Sipariş Tarihi",
      soru: "Aynı müşteri (customer_id = 1) için bu sefer bir SONRAKİ siparişin tarihini (sonraki_tarih olarak, LEAD ile) getiren bir sorgu yaz.",
      ipucu: "LAG yerine LEAD(order_date) OVER (ORDER BY order_date) AS sonraki_tarih kullan.",
      cozumSql: "SELECT order_id, order_date, LEAD(order_date) OVER (ORDER BY order_date) AS sonraki_tarih FROM orders WHERE customer_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-5-3",
      seviye: "Orta",
      baslik: "Tüm Müşteriler İçin Önceki Sipariş",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE bir önceki sipariş tarihini (onceki_tarih olarak) getiren bir sorgu yaz — PARTITION BY kullan.",
      ipucu: "LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih FROM orders;",
      mod: "sonuc",
    },
    {
      id: "4-5-4",
      seviye: "Orta",
      baslik: "Yürüyen Toplam Adet",
      soru: "product_id'si 1 olan order_items satırlarının item_id, quantity ve item_id sırasına göre yürüyen toplam adedini (yuruyen_toplam olarak) getiren bir sorgu yaz.",
      ipucu: "SUM(quantity) OVER (ORDER BY item_id) AS yuruyen_toplam kalıbını kullanabilirsin.",
      cozumSql: "SELECT item_id, quantity, SUM(quantity) OVER (ORDER BY item_id) AS yuruyen_toplam FROM order_items WHERE product_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-5-5",
      seviye: "Zor",
      baslik: "Müşteri Başına Sipariş Sırası",
      soru: "Tüm siparişlerin customer_id, order_id, order_date ve HER MÜŞTERİ KENDİ İÇİNDE, tarih sırasına göre kaçıncı siparişi olduğunu (siparis_no olarak, COUNT penceresiyle) getiren bir sorgu yaz.",
      ipucu: "COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date) AS siparis_no kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, COUNT(*) OVER (PARTITION BY customer_id ORDER BY order_date) AS siparis_no FROM orders;",
      mod: "sonuc",
    },
    {
      id: "4-5-6",
      seviye: "Zor",
      baslik: "İlk Sipariş Hariç",
      soru: "Her müşterinin İLK siparişi HARİÇ diğer tüm siparişlerini (customer_id, order_id, order_date, onceki_tarih) getiren bir sorgu yaz — bir alt sorguda LAG ile onceki_tarih hesapla, dış sorguda onceki_tarih IS NOT NULL ile filtrele.",
      ipucu: "Pencere fonksiyonu WHERE'de doğrudan kullanılamaz; FROM içinde LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih hesapla, dış sorguda WHERE onceki_tarih IS NOT NULL ekle.",
      cozumSql:
        "SELECT customer_id, order_id, order_date, onceki_tarih FROM (SELECT customer_id, order_id, order_date, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS onceki_tarih FROM orders) AS t WHERE onceki_tarih IS NOT NULL;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-5-q1",
      soru: "LAG(order_date) OVER (ORDER BY order_date) ifadesi, bir grubun İLK satırında ne döndürür?",
      secenekler: [
        "0",
        "NULL — çünkü ondan önceki bir satır yoktur",
        "Kendi order_date değerini",
        "Hata verir",
      ],
      dogruIndex: 1,
      aciklama: "İlk satırın 'önceki'si olmadığı için LAG, o satırda NULL döndürür — bu, Ders 4.5'teki 'ilk sipariş hariç' alıştırmasının da temelidir.",
    },
    {
      id: "4-5-q2",
      soru: "LAG ile LEAD arasındaki fark nedir?",
      secenekler: [
        "Aralarında fark yoktur",
        "LAG önceki satıra, LEAD sonraki satıra bakar",
        "LAG sadece sayısal sütunlarla, LEAD sadece metin sütunlarıyla çalışır",
        "LEAD, LAG'den her zaman daha yavaştır",
      ],
      dogruIndex: 1,
      aciklama: "LAG, sıralamadaki bir önceki satırın değerine; LEAD ise bir sonraki satırın değerine erişim sağlar.",
    },
    {
      id: "4-5-q3",
      soru: "SUM(quantity) OVER (ORDER BY item_id) ifadesi her satırda ne hesaplar?",
      secenekler: [
        "Sadece o satırın quantity değerini",
        "Tüm tablodaki toplam quantity'yi (her satırda aynı değer)",
        "O satıra kadar (kendisi dahil) olan quantity değerlerinin birikimli toplamını (yürüyen toplam)",
        "Sadece bir sonraki satırın quantity'sini",
      ],
      dogruIndex: 2,
      aciklama: "ORDER BY ile kullanılan bir toplulaştırma penceresi, varsayılan olarak 'baştan şu satıra kadar' birikimli bir toplam (yürüyen toplam) hesaplar.",
    },
    {
      id: "4-5-q4",
      soru: "PARTITION BY customer_id ile birlikte kullanılan bir LAG fonksiyonu ne yapar?",
      secenekler: [
        "Tüm müşterilerin sipariş geçmişini tek bir grup olarak ele alır",
        "Her müşterinin kendi sipariş geçmişi içinde önceki satırı bulur, müşteriler arası sızıntı olmaz",
        "PARTITION BY, LAG ile birlikte kullanılamaz",
        "Sadece ilk müşteri için çalışır",
      ],
      dogruIndex: 1,
      aciklama: "PARTITION BY, hesaplamayı her grup için sıfırlar; bu sayede bir müşterinin ilk siparişi, başka bir müşterinin son siparişini 'önceki' olarak almaz.",
    },
  ],
});
