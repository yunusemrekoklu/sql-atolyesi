import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const ifadelerVeHesaplamalar = defineLesson({
  slug: "ifadeler-ve-hesaplamalar",
  uniteId: 2,
  dersNo: "2.1",
  baslik: "İfadeler ve Hesaplamalar",
  veritabaniId: eticaretDb.id,
  anlatim: `
Şimdiye kadar \`SELECT\` ile sütunları hep **oldukları gibi** getirdin. Ama SQL'in asıl gücü, veriyi getirirken üzerinde hesaplama da yapabilmesinde.

## Sütunlarla işlem yapmak

\`SELECT\` listesine bir sütun adı yerine bir **ifade** (expression) yazabilirsin: aritmetik işlem, metin birleştirme, hatta sabit bir değer. SQLite'ta kullanabileceğin temel aritmetik operatörler şunlar:

| Operatör | Anlamı |
|---|---|
| \`+\` | toplama |
| \`-\` | çıkarma |
| \`*\` | çarpma |
| \`/\` | bölme |
| \`\\|\\|\` | metin birleştirme (concat) |

Örneğin \`products\` tablosundaki her ürünün stok değerini (fiyat × adet) hesaplamak için:

\`\`\`sql
SELECT product_name, price * stock_quantity FROM products;
\`\`\`

## AS ile takma ad verme

Yukarıdaki sorguyu çalıştırırsan sonuç tablosundaki ikinci sütunun adının garip (\`price * stock_quantity\`) göründüğünü fark edersin. \`AS\` anahtar kelimesiyle hesaplanan sütuna okunabilir bir isim (takma ad / *alias*) verebilirsin:

\`\`\`sql
SELECT product_name, price * stock_quantity AS stock_value FROM products;
\`\`\`

Bu, sadece sayısal sütunlarla sınırlı değil — metin sütunlarını \`||\` ile birleştirip tek bir sütun olarak da getirebilirsin (ör. ad ve şehri birleştirmek).

**Önemli nokta:** İfadeler veritabanındaki veriyi **değiştirmez** — sadece sorgunun döndürdüğü sonucu hesaplar. Aşağıdaki alıştırmalardan birinde, hesapladığın değeri gerçekten tabloya *yazmak* için \`UPDATE\` kullanacaksın; \`UPDATE\` ayrı bir konu ama ifadelerle iç içe çalışır.

Bu derste \`eticaret\` veritabanını kullanacaksın — sağdaki şema panelinden tablolara göz atabilirsin (tablo/sütun adları İngilizce, veri Türkçe).
`,
  ornekler: [
    {
      aciklama: "Her ürünün adını ve %20 indirimli fiyatını hesapla:",
      sql: "SELECT product_name, price * 0.8 AS discounted_price FROM products;",
    },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-1-1",
      seviye: "Kolay",
      baslik: "İndirimli Fiyat",
      soru:
        "products tablosundaki her ürün için product_name ve %20 indirimli fiyatını (price * 0.8) getiren bir sorgu yaz.",
      ipucu: "SELECT product_name, price * 0.8 FROM products; şeklinde bir ifade yeterli, sütuna istediğin adı AS ile verebilirsin.",
      cozumSql: "SELECT product_name, price * 0.8 AS discounted_price FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-1-2",
      seviye: "Kolay",
      baslik: "Müşteri Etiketi",
      soru:
        "customers tablosundaki her müşteri için full_name ve city bilgisini \"Ad Soyad (Şehir)\" formatında tek bir sütunda birleştiren bir sorgu yaz.",
      ipucu: "Metin birleştirme için || operatörünü kullan: full_name || ' (' || city || ')'",
      cozumSql: "SELECT full_name || ' (' || city || ')' AS label FROM customers;",
      mod: "sonuc",
    },
    {
      id: "2-1-3",
      seviye: "Orta",
      baslik: "Pahalıdan Ucuza Ürün Listesi",
      soru: "Tüm ürünlerin product_name ve price'ını, fiyatı en yüksekten en düşüğe doğru sıralayarak listele.",
      ipucu: "ORDER BY price DESC ile sıralama yapabilirsin. Bu alıştırmada satır sırası da kontrol ediliyor.",
      cozumSql: "SELECT product_name, price FROM products ORDER BY price DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-1-4",
      seviye: "Orta",
      baslik: "Sipariş Detay Tutarı",
      soru:
        "order_items tablosundaki her satır için item_id ile birlikte toplam tutarı (quantity * unit_price) hesaplayan bir sorgu yaz.",
      ipucu: "SELECT item_id, quantity * unit_price FROM order_items; sütuna istediğin adı AS ile verebilirsin.",
      cozumSql: "SELECT item_id, quantity * unit_price AS line_total FROM order_items;",
      mod: "sonuc",
    },
    {
      id: "2-1-5",
      seviye: "Zor",
      baslik: "Yüksek Stok Değerli Ürünler",
      soru:
        "Stok değeri (price * stock_quantity) 40.000 TL'nin üzerinde olan ürünlerin product_name ve stok değerini, değere göre çoktan aza sıralayarak listele.",
      ipucu: "WHERE'de ifadeyi (AS ile verdiğin takma adı değil) tekrar yazman gerekiyor: WHERE price * stock_quantity > 40000",
      cozumSql:
        "SELECT product_name, price * stock_quantity AS stock_value FROM products WHERE price * stock_quantity > 40000 ORDER BY stock_value DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-1-6",
      seviye: "Zor",
      baslik: "Elektronik Ürünlere Zam",
      soru:
        "'Elektronik' kategorisindeki tüm ürünlerin fiyatını %10 artır (yeni fiyat = eski fiyat * 1.1 olacak şekilde tabloyu güncelle). Diğer kategorilerdeki ürünler değişmemeli.",
      ipucu: "UPDATE products SET price = ... WHERE category = 'Elektronik'; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE products SET price = price * 1.1 WHERE category = 'Elektronik';",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "2-1-q1",
      soru: "SELECT price * 2 FROM products; sorgusu products tablosundaki price sütununu değiştirir mi?",
      secenekler: [
        "Evet, tablodaki tüm fiyatlar kalıcı olarak ikiye katlanır.",
        "Hayır, sadece sorgunun döndürdüğü sonuç hesaplanır, tablo değişmez.",
        "Sadece WHERE koşulu yoksa değiştirir.",
        "Sadece AS ile takma ad verilmezse değiştirir.",
      ],
      dogruIndex: 1,
      aciklama: "SELECT ifadeleri salt-okunurdur; veriyi kalıcı olarak değiştirmek için UPDATE gerekir.",
    },
    {
      id: "2-1-q2",
      soru: "SELECT product_name, price * 0.8 FROM products; sorgusunda ikinci sütuna okunabilir bir isim vermek için ne kullanılır?",
      secenekler: ["AS", "IS", "IN", "LIKE"],
      dogruIndex: 0,
      aciklama: "AS anahtar kelimesi, bir ifadeye veya sütuna takma ad (alias) vermek için kullanılır.",
    },
    {
      id: "2-1-q3",
      soru: "SQLite'ta iki metin sütununu birleştirmek (concat) için hangi operatör kullanılır?",
      secenekler: ["+", "&", "||", "CONCAT()"],
      dogruIndex: 2,
      aciklama: "SQLite'ta metin birleştirme operatörü || işaretidir (ör. full_name || ' - ' || city).",
    },
    {
      id: "2-1-q4",
      soru:
        "products tablosunda price * stock_quantity AS stock_value hesaplanan bir sorguda, WHERE stock_value > 1000 yazmak neden hataya yol açar?",
      secenekler: [
        "WHERE ifadesi sadece metin sütunlarında çalışır.",
        "SQLite WHERE cümlesini desteklemez.",
        "WHERE, SELECT listesindeki takma adları (alias) henüz tanımıyor; ifadeyi tekrar yazman gerekir.",
        "AS sadece son sütunda kullanılabilir.",
      ],
      dogruIndex: 2,
      aciklama:
        "Sorgunun çalışma sırasında WHERE, SELECT'ten önce değerlendirilir; bu yüzden SELECT'te tanımlanan takma adlar WHERE'de henüz bilinmez (Ünite 2.7'de detaylı işlenecek).",
    },
  ],
});
