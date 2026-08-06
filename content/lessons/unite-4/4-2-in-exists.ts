import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const inExists = defineLesson({
  slug: "in-exists",
  uniteId: 4,
  dersNo: "4.2",
  baslik: "IN / EXISTS",
  veritabaniId: eticaretDb.id,
  anlatim: `
Önceki derste alt sorgunun **tek bir değer** döndürmesi gerektiğini gördün. Peki alt sorgu birden fazla değer döndürüyorsa? İşte o zaman \`IN\` devreye girer.

## IN ile liste karşılaştırması

\`\`\`sql
SELECT product_name FROM products
WHERE product_id IN (SELECT product_id FROM order_items);
\`\`\`

\`IN (alt_sorgu)\`, alt sorgunun döndürdüğü **tüm değerlerin listesiyle** karşılaştırma yapar — "bu değer, listedeki değerlerden biri mi?". Bu, en az bir kez sipariş edilmiş ürünleri getirir.

## NOT IN'in gizli tuzağı: NULL

\`NOT IN\`, listedeki hiçbir değere eşit olmayanları bulur — ama listede **tek bir \`NULL\`** bile varsa, \`NOT IN\` **hiçbir satır döndürmez**. Bunun nedeni, SQL'de \`NULL\` ile yapılan her karşılaştırmanın sonucunun "bilinmez" (UNKNOWN) olması; bir listede bilinmez bir değer varsa, "bu listede değil" iddiası da bilinmez hale gelir.

\`\`\`sql
-- TUZAK: cancellation_reason çoğu satırda NULL
SELECT full_name FROM customers
WHERE full_name NOT IN (SELECT cancellation_reason FROM orders);
\`\`\`

Bu sorgu **hiçbir satır döndürmez** — çünkü alt sorgunun listesinde en az bir \`NULL\` var. Güvenli kullanım için ya alt sorguya \`WHERE ... IS NOT NULL\` ekleyerek \`NULL\`'ları temizle, ya da aşağıda göreceğin \`NOT EXISTS\`'i tercih et.

## EXISTS: "var mı?" sorusu

\`EXISTS\`, bir alt sorgunun **en az bir satır döndürüp döndürmediğini** kontrol eder — döndürdüğü değerlerle değil, sadece "satır var mı yok mu" ile ilgilenir. Neredeyse her zaman **ilişkili (correlated)** çalışır: alt sorgu, dıştaki sorgunun o anki satırına \`c.customer_id\` gibi bir referansla bağlanır.

\`\`\`sql
SELECT full_name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
\`\`\`

Bu, en az bir siparişi olan müşterileri getirir. \`NOT EXISTS\` ise tam tersini yapar ve — \`NOT IN\`'in aksine — \`NULL\` tuzağına düşmez, bu yüzden "eşleşmeyenleri bulma" işlemlerinde genelde daha güvenlidir.
`,
  ornekler: [
    { aciklama: "Sipariş edilmiş ürünleri getir:", sql: "SELECT product_name FROM products WHERE product_id IN (SELECT product_id FROM order_items);" },
    { aciklama: "En az bir siparişi olan müşterileri getir:", sql: "SELECT full_name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);" },
  ],
  onizlemeTablolari: ["customers", "products"],
  alistirmalar: [
    {
      id: "4-2-1",
      seviye: "Kolay",
      baslik: "Sipariş Edilmiş Ürünler",
      soru: "En az bir kez sipariş edilmiş (order_items'ta geçen) ürünlerin product_name'ini getiren bir sorgu yaz.",
      ipucu: "WHERE product_id IN (SELECT product_id FROM order_items) kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name FROM products WHERE product_id IN (SELECT product_id FROM order_items);",
      mod: "sonuc",
    },
    {
      id: "4-2-2",
      seviye: "Orta",
      baslik: "İptal Siparişlerinde Geçmeyen Ürünler",
      soru: "status'ü 'İptal' olan hiçbir siparişin kaleminde (order_items) geçmeyen ürünlerin product_name'ini getiren bir sorgu yaz.",
      ipucu: "WHERE product_id NOT IN (SELECT oi.product_id FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE o.status = 'İptal') kalıbını kullanabilirsin — bu alt sorgudaki product_id sütununda NULL olmadığı için NOT IN güvenlidir.",
      cozumSql:
        "SELECT product_name FROM products WHERE product_id NOT IN (SELECT oi.product_id FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE o.status = 'İptal');",
      mod: "sonuc",
    },
    {
      id: "4-2-3",
      seviye: "Orta",
      baslik: "Siparişi Olan Müşteriler (EXISTS)",
      soru: "En az bir siparişi olan müşterilerin full_name'ini EXISTS kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id) kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);",
      mod: "sonuc",
    },
    {
      id: "4-2-4",
      seviye: "Orta",
      baslik: "Hiç Siparişi Olmayan Müşteriler",
      soru: "Hiç siparişi olmayan müşterilerin full_name'ini NOT EXISTS kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id) kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);",
      mod: "sonuc",
    },
    {
      id: "4-2-5",
      seviye: "Orta",
      baslik: "Hiç İptal Etmemiş Müşteriler",
      soru: "status'ü 'İptal' olan hiçbir siparişte customer_id'si geçmeyen müşterilerin full_name'ini NOT IN kullanarak getiren bir sorgu yaz.",
      ipucu: "WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE status = 'İptal') kalıbını kullanabilirsin — orders.customer_id asla NULL olmadığı için burada NOT IN güvenlidir.",
      cozumSql: "SELECT full_name FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE status = 'İptal');",
      mod: "sonuc",
    },
    {
      id: "4-2-6",
      seviye: "Zor",
      baslik: "Elektronik Alıcıları",
      soru: "category'si 'Elektronik' olan en az bir ürün sipariş etmiş müşterilerin full_name'ini EXISTS kullanarak getiren bir sorgu yaz.",
      ipucu: "EXISTS alt sorgusunun içinde orders'ı order_items'a ve order_items'ı products'a JOIN'leyip WHERE p.category = 'Elektronik' AND o.customer_id = c.customer_id filtrelerini ekle.",
      cozumSql:
        "SELECT full_name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o JOIN order_items oi ON o.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id WHERE o.customer_id = c.customer_id AND p.category = 'Elektronik');",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-2-q1",
      soru: "IN (alt_sorgu) ne işe yarar?",
      secenekler: [
        "Alt sorgunun döndürdüğü değerler listesiyle bir karşılaştırma yapar",
        "Sadece tek bir değerle çalışabilir, listeyle çalışmaz",
        "İki tabloyu JOIN'ler",
        "Bir tabloyu siler",
      ],
      dogruIndex: 0,
      aciklama: "IN, sol taraftaki değerin, alt sorgunun döndürdüğü değerler listesinde olup olmadığını kontrol eder.",
    },
    {
      id: "4-2-q2",
      soru: "Alt sorgunun döndürdüğü listede bir NULL varsa, NOT IN ne yapar?",
      secenekler: [
        "NULL'ı yok sayar ve normal çalışır",
        "Hiçbir satır döndürmez — bu, klasik bir SQL tuzağıdır",
        "Hata verir ve sorguyu durdurur",
        "NULL'ı 0 olarak değerlendirir",
      ],
      dogruIndex: 1,
      aciklama: "Listede bir NULL olduğunda, NOT IN'in her karşılaştırması bilinmez (UNKNOWN) hale gelir ve sorgu hiçbir satır döndürmez.",
    },
    {
      id: "4-2-q3",
      soru: "EXISTS neyle ilgilenir?",
      secenekler: [
        "Alt sorgunun döndürdüğü değerlerin içeriğiyle",
        "Sadece alt sorgunun en az bir satır döndürüp döndürmediğiyle",
        "Alt sorgunun kaç sütun döndürdüğüyle",
        "Alt sorgunun ne kadar sürede çalıştığıyla",
      ],
      dogruIndex: 1,
      aciklama: "EXISTS, alt sorgunun döndürdüğü değerlerle ilgilenmez; sadece en az bir satır olup olmadığını (var/yok) kontrol eder.",
    },
    {
      id: "4-2-q4",
      soru: "NULL tuzağı söz konusu olduğunda NOT IN yerine ne tercih edilir?",
      secenekler: [
        "NOT EXISTS — NULL'lardan etkilenmez",
        "UNION",
        "GROUP BY",
        "Hiçbiri, tuzaktan kaçmanın yolu yoktur",
      ],
      dogruIndex: 0,
      aciklama: "NOT EXISTS, satır varlığını kontrol ettiği için (değer karşılaştırması yapmadığı için) NOT IN'deki NULL tuzağına düşmez — bu yüzden 'eşleşmeyenleri bulma' işlemlerinde daha güvenlidir.",
    },
  ],
});
