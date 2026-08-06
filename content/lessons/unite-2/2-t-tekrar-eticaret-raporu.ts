import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const tekrarEticaretRaporu = defineLesson({
  slug: "tekrar-eticaret-raporu",
  uniteId: 2,
  dersNo: "2.T",
  baslik: "Tekrar: E-Ticaret Raporu",
  veritabaniId: eticaretDb.id,
  anlatim: `
Ünite 2'yi tamamladın! İfadelerden \`HAVING\`'e kadar öğrendiğin her şeyi, gerçekçi bir senaryoda pekiştirme zamanı: patronun senden **eticaret** verisi üzerinden küçük bir rapor hazırlamanı istedi.

## Bu tekrar dersinde neler var?

- **İfadeler ve hesaplama** (2.1) — sayısal sütunlarla işlem yapma
- **NULL kontrolü** (2.2) — eksik verilerle (\`phone\`, \`cancellation_reason\`) çalışma
- **CASE WHEN** (2.3) — koşullu etiketler üretme
- **Toplulaştırma fonksiyonları** (2.4) — \`COUNT\`, \`SUM\`, \`AVG\`
- **GROUP BY** (2.5) — gruplama
- **HAVING** (2.6) — grupları filtreleme
- **Çalışma sırası** (2.7) — \`WHERE\`/\`HAVING\`'de neden alias kullanılamadığı

Aşağıdaki alıştırmalar kolaydan zora, tüm bu konuları karma şekilde kullanıyor. Bol şans!
`,
  ornekler: [
    {
      aciklama: "Kategori bazlı ürün sayısı ve ortalama fiyat raporu:",
      sql: "SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price FROM products GROUP BY category ORDER BY product_count DESC;",
    },
  ],
  onizlemeTablolari: ["products", "orders"],
  alistirmalar: [
    {
      id: "2-t-1",
      seviye: "Kolay",
      baslik: "İndirim Hesabı",
      soru: "Her ürünün product_name'ini ve %15 indirimli fiyatını (discounted_price) hesapla.",
      ipucu: "price * 0.85 AS discounted_price kalıbını kullanabilirsin (Ders 2.1 hatırlatması).",
      cozumSql: "SELECT product_name, price * 0.85 AS discounted_price FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-t-2",
      seviye: "Kolay",
      baslik: "Telefonu Eksik Müşteriler",
      soru: "Telefon numarası kayıtlı OLMAYAN müşterilerin full_name'ini ve city'sini getir.",
      ipucu: "WHERE phone IS NULL kalıbını kullanabilirsin (Ders 2.2 hatırlatması).",
      cozumSql: "SELECT full_name, city FROM customers WHERE phone IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-t-3",
      seviye: "Orta",
      baslik: "Stok Uyarı Etiketi",
      soru:
        "Her ürünün product_name'ini, stock_quantity'sini ve bir stock_status etiketi getir: 10'dan az ise 'Kritik', 10-29 arası 'Az', 30 ve üzeri 'Yeterli'.",
      ipucu: "CASE WHEN stock_quantity < 10 THEN 'Kritik' WHEN stock_quantity < 30 THEN 'Az' ELSE 'Yeterli' END (Ders 2.3 hatırlatması).",
      cozumSql:
        "SELECT product_name, stock_quantity, CASE WHEN stock_quantity < 10 THEN 'Kritik' WHEN stock_quantity < 30 THEN 'Az' ELSE 'Yeterli' END AS stock_status FROM products;",
      mod: "sonuc",
    },
    {
      id: "2-t-4",
      seviye: "Orta",
      baslik: "Kategori Raporu",
      soru:
        "Her kategori için ürün sayısını (product_count), ortalama fiyatı (avg_price) ve toplam stok miktarını (total_stock) tek sorguda getir.",
      ipucu: "GROUP BY category ile COUNT(*), AVG(price), SUM(stock_quantity)'ı birlikte kullan (Ders 2.4 + 2.5 hatırlatması).",
      cozumSql:
        "SELECT category, COUNT(*) AS product_count, AVG(price) AS avg_price, SUM(stock_quantity) AS total_stock FROM products GROUP BY category;",
      mod: "sonuc",
    },
    {
      id: "2-t-5",
      seviye: "Orta",
      baslik: "Aktif Müşteriler",
      soru: "En az 2 siparişi olan müşterilerin customer_id'sini ve sipariş sayısını getir.",
      ipucu: "GROUP BY customer_id HAVING COUNT(*) >= 2 kalıbını kullanabilirsin (Ders 2.5 + 2.6 hatırlatması).",
      cozumSql: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
    {
      id: "2-t-6",
      seviye: "Zor",
      baslik: "İptal Olmayan Sadık Müşteriler",
      soru:
        "İptal EDİLMEMİŞ (status != 'İptal') siparişleri say, müşteri bazında grupla, en az 2 siparişi olanları filtrele, sipariş sayısına göre azalan sırada getir (customer_id, order_count).",
      ipucu: "WHERE status != 'İptal' GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT customer_id, COUNT(*) AS order_count FROM orders WHERE status != 'İptal' GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-t-7",
      seviye: "Zor",
      baslik: "Yüksek Değerli Kategoriler",
      soru:
        "Her kategorinin toplam stok değerini (SUM(price * stock_quantity)) hesapla; toplam değeri 40.000 TL ve üzeri olan kategorileri, değere göre azalan sırada getir (category, total_value).",
      ipucu: "GROUP BY category HAVING SUM(price * stock_quantity) >= 40000 ORDER BY total_value DESC — takma adı WHERE/HAVING'de değil, sadece ORDER BY'da kullanabildiğini unutma (Ders 2.7 hatırlatması).",
      cozumSql:
        "SELECT category, SUM(price * stock_quantity) AS total_value FROM products GROUP BY category HAVING SUM(price * stock_quantity) >= 40000 ORDER BY total_value DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "2-t-q1",
      soru: "price * 0.85 gibi bir ifade çalıştırıldığında veritabanındaki veriyi değiştirir mi?",
      secenekler: [
        "Evet, price sütunu kalıcı olarak güncellenir",
        "Hayır, sadece o sorgunun sonucunu hesaplar",
        "Sadece UPDATE ile birlikte kullanılırsa değiştirir",
        "Sadece WHERE koşulu varsa değiştirir",
      ],
      dogruIndex: 1,
      aciklama: "SELECT içindeki ifadeler salt-okunurdur; veriyi kalıcı olarak değiştirmek için UPDATE gerekir.",
    },
    {
      id: "2-t-q2",
      soru: "COUNT(sutun) ile COUNT(*) ne zaman farklı sonuç verir?",
      secenekler: [
        "Asla farklı sonuç vermezler",
        "sutun'da NULL değerler varsa (COUNT(sutun) NULL'ları saymaz)",
        "Sadece GROUP BY kullanılırsa farklı olur",
        "Sadece sayısal sütunlarda farklı olur",
      ],
      dogruIndex: 1,
      aciklama: "COUNT(*) tüm satırları sayar; COUNT(sutun) ise o sütunda NULL olan satırları saymaz.",
    },
    {
      id: "2-t-q3",
      soru: "HAVING hangi aşamada çalışır?",
      secenekler: ["WHERE'den önce", "GROUP BY'dan sonra, grupları filtrelemek için", "SELECT'ten önce", "ORDER BY'dan sonra"],
      dogruIndex: 1,
      aciklama: "Çalışma sırası: ... GROUP BY → HAVING → SELECT ... — HAVING, oluşan grupları filtreler.",
    },
    {
      id: "2-t-q4",
      soru: "CASE WHEN ifadesinde ilk doğru WHEN koşulu bulunduktan sonra diğer WHEN'ler kontrol edilir mi?",
      secenekler: [
        "Evet, hepsi kontrol edilir ve en sonuncusu kullanılır",
        "Hayır, ilk doğru WHEN bulunduğunda durur",
        "Sadece ELSE varsa hepsi kontrol edilir",
        "Bu, veritabanına göre değişir",
      ],
      dogruIndex: 1,
      aciklama: "CASE, WHEN koşullarını sırayla kontrol eder ve ilk doğru olanın sonucunu döndürüp durur.",
    },
    {
      id: "2-t-q5",
      soru: "Mantıksal çalışma sırasında ORDER BY, LIMIT'ten önce mi çalışır?",
      secenekler: [
        "Evet, önce tüm sonuç sıralanır, sonra LIMIT ile kaç satır döneceği belirlenir",
        "Hayır, önce LIMIT uygulanır sonra kalan satırlar sıralanır",
        "İkisi aynı anda çalışır",
        "Bu sıralama tabloya göre değişir",
      ],
      dogruIndex: 0,
      aciklama: "Çalışma sırasının son iki adımı ORDER BY, ardından LIMIT'tir — önce tüm sonuç sıralanır, sonra istenen kadarı alınır.",
    },
  ],
});
