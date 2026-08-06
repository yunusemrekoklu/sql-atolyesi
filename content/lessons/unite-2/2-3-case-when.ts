import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const caseWhen = defineLesson({
  slug: "case-when",
  uniteId: 2,
  dersNo: "2.3",
  baslik: "CASE WHEN",
  veritabaniId: eticaretDb.id,
  anlatim: `
Bazen bir sütunun ham değerini değil, o değere göre **koşullu bir etiket** göstermek istersin — ör. bir fiyatı sayı olarak değil "Pahalı" / "Uygun" olarak göstermek. Bunun için \`CASE WHEN\` kullanılır.

## Temel söz dizimi

\`\`\`sql
SELECT product_name, price,
  CASE
    WHEN price >= 1500 THEN 'Pahalı'
    ELSE 'Uygun'
  END AS price_label
FROM products;
\`\`\`

\`CASE\`, koşulları **yukarıdan aşağı sırayla** kontrol eder ve **ilk doğru olan** \`WHEN\`'in sonucunu döndürür. \`ELSE\`, hiçbir \`WHEN\` eşleşmezse kullanılır — \`ELSE\` yazılmazsa ve hiçbir koşul sağlanmazsa sonuç \`NULL\` olur. İfade her zaman \`END\` ile kapatılır.

## Birden fazla WHEN

İstediğin kadar \`WHEN\` ekleyebilirsin — bu, sınavlarda ve mülakatlarda çok sık karşına çıkan bir kalıptır:

\`\`\`sql
SELECT product_name, price,
  CASE
    WHEN price < 600 THEN 'Ucuz'
    WHEN price <= 1500 THEN 'Orta'
    ELSE 'Pahalı'
  END AS price_tier
FROM products;
\`\`\`

\`CASE WHEN\`, ileride toplulaştırma fonksiyonlarıyla (\`SUM(CASE WHEN ...)\` gibi) birleştirilerek koşullu sayım/toplama yapmak için de kullanılır — bunu ileri derslerde göreceksin.
`,
  ornekler: [
    {
      aciklama: "Ürünleri fiyatına göre 'Pahalı' / 'Uygun' olarak etiketle:",
      sql: "SELECT product_name, price, CASE WHEN price >= 1500 THEN 'Pahalı' ELSE 'Uygun' END AS price_label FROM products;",
    },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-3-1",
      seviye: "Kolay",
      baslik: "Stok Durumu Etiketi",
      soru: "Her ürünün product_name'ini ve bir stock_status etiketi getir: stock_quantity 0 ise 'Tükendi', değilse 'Stokta' yazsın.",
      ipucu: "CASE WHEN stock_quantity = 0 THEN 'Tükendi' ELSE 'Stokta' END kalıbını kullanabilirsin.",
      cozumSql: "SELECT product_name, CASE WHEN stock_quantity = 0 THEN 'Tükendi' ELSE 'Stokta' END AS stock_status FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-3-2",
      seviye: "Orta",
      baslik: "Üç Kademeli Fiyat Etiketi",
      soru: "Her ürünün product_name'ini, price'ını ve bir price_tier etiketi getir: price 600'den az ise 'Ucuz', 600-1500 arası (1500 dahil) 'Orta', 1500'den fazla ise 'Pahalı'.",
      ipucu: "Birden fazla WHEN kullanabilirsin: WHEN price < 600 THEN 'Ucuz' WHEN price <= 1500 THEN 'Orta' ELSE 'Pahalı'",
      cozumSql:
        "SELECT product_name, price, CASE WHEN price < 600 THEN 'Ucuz' WHEN price <= 1500 THEN 'Orta' ELSE 'Pahalı' END AS price_tier FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-3-3",
      seviye: "Orta",
      baslik: "Sipariş Durum Simgesi",
      soru: "Her siparişin order_id'sini, status'unu ve bir simge sütununu getir: status 'Teslim Edildi' ise '✓', 'İptal' ise '✗', diğer tüm durumlar için '…' yazsın.",
      ipucu: "WHEN status = 'Teslim Edildi' THEN '✓' WHEN status = 'İptal' THEN '✗' ELSE '…' şeklinde ilerleyebilirsin.",
      cozumSql:
        "SELECT order_id, status, CASE WHEN status = 'Teslim Edildi' THEN '✓' WHEN status = 'İptal' THEN '✗' ELSE '…' END AS icon FROM orders;",
      mod: "sonuc",
    },
    {
      id: "2-3-4",
      seviye: "Orta",
      baslik: "Kategori Bazlı İndirim",
      soru:
        "Her ürünün product_name'ini, category'sini ve bir discounted_price hesapla: category 'Elektronik' ise %10 indirim (price * 0.9), 'Giyim' ise %20 indirim (price * 0.8), diğer kategoriler %5 indirim (price * 0.95) uygulansın.",
      ipucu: "CASE içinde her WHEN'in sonucunda bir ifade (hesaplama) da yazabilirsin: WHEN category = 'Elektronik' THEN price * 0.9",
      cozumSql:
        "SELECT product_name, category, CASE WHEN category = 'Elektronik' THEN price * 0.9 WHEN category = 'Giyim' THEN price * 0.8 ELSE price * 0.95 END AS discounted_price FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-3-5",
      seviye: "Zor",
      baslik: "Sipariş Kalemi Paket Boyutu",
      soru:
        "order_items tablosundaki her satır için item_id, quantity ve bir package_size etiketi getir: quantity 1 ise 'Tekli', 2 ile 3 arası (dahil) 'Küçük Paket', 3'ten fazla ise 'Büyük Paket'.",
      ipucu: "WHEN quantity = 1 THEN 'Tekli' WHEN quantity BETWEEN 2 AND 3 THEN 'Küçük Paket' ELSE 'Büyük Paket' — BETWEEN'i CASE içinde de kullanabilirsin.",
      cozumSql:
        "SELECT item_id, quantity, CASE WHEN quantity = 1 THEN 'Tekli' WHEN quantity BETWEEN 2 AND 3 THEN 'Küçük Paket' ELSE 'Büyük Paket' END AS package_size FROM order_items;",
      mod: "sonuc",
    },
    {
      id: "2-3-6",
      seviye: "Zor",
      baslik: "Müşteri Şehir Grubu",
      soru:
        "Her müşterinin full_name'ini, city'sini ve bir city_group etiketi getir: city İstanbul, Ankara veya İzmir ise 'Büyükşehir', diğer şehirler için 'Diğer' yazsın (IN ile CASE'i birleştir).",
      ipucu: "WHEN city IN ('İstanbul', 'Ankara', 'İzmir') THEN 'Büyükşehir' ELSE 'Diğer' kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT full_name, city, CASE WHEN city IN ('İstanbul', 'Ankara', 'İzmir') THEN 'Büyükşehir' ELSE 'Diğer' END AS city_group FROM customers;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "2-3-q1",
      soru: "CASE WHEN ifadesinin temel amacı nedir?",
      secenekler: [
        "Bir tabloyu silmek",
        "Bir sütunun/ifadenin değerine göre koşullu bir sonuç üretmek",
        "İki tabloyu birleştirmek",
        "Bir sütuna NOT NULL kısıtı eklemek",
      ],
      dogruIndex: 1,
      aciklama: "CASE WHEN, koşullara göre farklı sonuçlar döndüren bir SQL ifadesidir — programlamadaki if/else if/else yapısına benzer.",
    },
    {
      id: "2-3-q2",
      soru: "Birden fazla WHEN koşulu varsa ve birden fazlası doğruysa SQL hangisini kullanır?",
      secenekler: [
        "Hepsini birleştirir",
        "Yukarıdan aşağı sırayla kontrol edilen ilk DOĞRU WHEN'i kullanır",
        "En sonuncu doğru WHEN'i kullanır",
        "Rastgele birini seçer",
      ],
      dogruIndex: 1,
      aciklama: "CASE, WHEN koşullarını yazıldığı sırayla kontrol eder ve ilk doğru olanın sonucunu kullanır, geri kalanlarına bakmaz.",
    },
    {
      id: "2-3-q3",
      soru: "ELSE kısmı yazılmazsa ve hiçbir WHEN koşulu sağlanmazsa sonuç ne olur?",
      secenekler: ["0", "Boş metin ('')", "NULL", "Söz dizimi hatası"],
      dogruIndex: 2,
      aciklama: "ELSE isteğe bağlıdır; hiç yazılmazsa ve hiçbir WHEN eşleşmezse CASE ifadesi NULL döner.",
    },
    {
      id: "2-3-q4",
      soru: "CASE WHEN ifadesini kapatmak için hangi anahtar kelime kullanılır?",
      secenekler: ["STOP", "CLOSE", "END", "FINISH"],
      dogruIndex: 2,
      aciklama: "Her CASE ifadesi END ile kapatılmalıdır; unutulursa söz dizimi hatası oluşur.",
    },
  ],
});
