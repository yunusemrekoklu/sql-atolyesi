import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const sorgununCalismaSirasi = defineLesson({
  slug: "sorgunun-calisma-sirasi",
  uniteId: 2,
  dersNo: "2.7",
  baslik: "Sorgunun Çalışma Sırası",
  veritabaniId: eticaretDb.id,
  anlatim: `
Ünite 2'yi bitirmeden önce, önceki derslerde defalarca karşına çıkan garip bir kuralı netleştirelim: **neden \`AS\` ile verdiğin bir takma ad bazen \`WHERE\`'de çalışmaz ama \`ORDER BY\`'da çalışır?** Cevap, SQL'in **yazıldığı sırayla değil, kendi mantıksal sırasıyla** çalışmasında.

## Yazılış sırası vs çalışma sırası

Bir sorguyu şöyle **yazarsın**:

\`\`\`
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
\`\`\`

Ama SQLite bunu bu sırayla **çalıştırmaz**. Gerçek (mantıksal) çalışma sırası şudur:

1. **FROM** — hangi tablodan veri okunacak
2. **WHERE** — satırlar tek tek filtrelenir
3. **GROUP BY** — kalan satırlar gruplanır
4. **HAVING** — gruplar filtrelenir
5. **SELECT** — sonuç sütunları (ve takma adlar!) hesaplanır
6. **ORDER BY** — sonuç sıralanır
7. **LIMIT** — satır sayısı sınırlanır

## Bu neden önemli?

\`SELECT\`, bu sırada **5. adımda** çalışır — yani \`WHERE\` (2. adım) ve \`HAVING\` (4. adım) çalıştığında, \`SELECT\`'te tanımladığın takma adlar **henüz mevcut değildir**. Bu yüzden:

\`\`\`sql
-- HATALI: stock_value, WHERE çalıştığında henüz tanımlı değil
SELECT product_name, price * stock_quantity AS stock_value
FROM products
WHERE stock_value > 20000;
\`\`\`

\`WHERE\`'de takma ad yerine ifadeyi **tekrar yazman** gerekir: \`WHERE price * stock_quantity > 20000\`. Aynı kural \`HAVING\` için de geçerlidir. Ama \`ORDER BY\` (6. adım), \`SELECT\`'ten (5. adım) **sonra** çalıştığı için takma adları kullanabilirsin — önceki derslerde \`ORDER BY stock_value\` gibi kullanımları bu yüzden sorunsuz gördün.
`,
  ornekler: [
    {
      aciklama: "Stokta olan ürünleri stok değerine göre sırala (ORDER BY'da alias kullanılabilir):",
      sql: "SELECT product_name, price * stock_quantity AS stock_value FROM products WHERE stock_quantity > 0 ORDER BY stock_value DESC;",
    },
  ],
  onizlemeTablolari: ["products"],
  alistirmalar: [
    {
      id: "2-7-1",
      seviye: "Kolay",
      baslik: "ORDER BY'da Takma Ad",
      soru: "Her ürünün product_name'ini ve %10 indirimli fiyatını (discounted_price) hesapla; sonucu discounted_price'a göre artan sırala.",
      ipucu: "ORDER BY, SELECT'ten sonra çalıştığı için takma adı (discounted_price) kullanabilirsin.",
      cozumSql: "SELECT product_name, price * 0.9 AS discounted_price FROM products ORDER BY discounted_price ASC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-7-2",
      seviye: "Orta",
      baslik: "WHERE'de Takma Ad Kullanılamaz",
      soru: "Stok değeri (price * stock_quantity) 20.000 TL'nin üzerinde olan ürünlerin product_name'ini ve stok değerini getir — WHERE'de ifadeyi TEKRAR yazman gerekiyor, takma ad kullanamazsın.",
      ipucu: "WHERE price * stock_quantity > 20000 — takma adı (stock_value) burada kullanamazsın çünkü WHERE, SELECT'ten önce çalışır.",
      cozumSql: "SELECT product_name, price * stock_quantity AS stock_value FROM products WHERE price * stock_quantity > 20000;",
      mod: "sonuc",
    },
    {
      id: "2-7-3",
      seviye: "Orta",
      baslik: "HAVING'de de Takma Ad Kullanılamaz",
      soru: "Kategori başına ortalama fiyatı (avg_price) hesapla; ortalaması 1000 TL'nin üzerinde olan kategorileri getir — HAVING'de de ifadeyi tekrar yaz.",
      ipucu: "HAVING AVG(price) > 1000 — takma adı (avg_price) burada da kullanamazsın.",
      cozumSql: "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 1000;",
      mod: "sonuc",
    },
    {
      id: "2-7-4",
      seviye: "Orta",
      baslik: "Doğru Sırayla Kombinasyon",
      soru:
        "'Giyim' HARİÇ kategorilerden en az 3 ürünü olanları, ürün sayısına göre azalan sırada getir (category, product_count) — WHERE, GROUP BY, HAVING ve ORDER BY'ı doğru sırayla birleştir.",
      ipucu: "WHERE category != 'Giyim' GROUP BY category HAVING COUNT(*) >= 3 ORDER BY product_count DESC kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT category, COUNT(*) AS product_count FROM products WHERE category != 'Giyim' GROUP BY category HAVING COUNT(*) >= 3 ORDER BY product_count DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-7-5",
      seviye: "Zor",
      baslik: "Neredeyse Tam Boru Hattı",
      soru:
        "Stokta ürünü olan (stock_quantity > 0) kategorileri, o kategorideki ürünlerin toplam stok değerine (SUM(price * stock_quantity)) göre azalan sırada listele; sadece ilk 2 kategoriyi getir (category, total_stock_value).",
      ipucu: "WHERE stock_quantity > 0 GROUP BY category ORDER BY total_stock_value DESC LIMIT 2 kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT category, SUM(price * stock_quantity) AS total_stock_value FROM products WHERE stock_quantity > 0 GROUP BY category ORDER BY total_stock_value DESC LIMIT 2;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "2-7-q1",
      soru: "Bir SQL sorgusu, YAZILDIĞI sırayla mı (önce SELECT) çalışır?",
      secenekler: [
        "Evet, tam olarak yazıldığı sırayla çalışır",
        "Hayır; mantıksal çalışma sırası FROM ile başlar, SELECT sona yakın (5. adımda) işlenir",
        "Hayır, çalışma sırası veritabanına göre rastgele değişir",
        "SELECT her zaman en son çalışır",
      ],
      dogruIndex: 1,
      aciklama: "SQL'in yazılış sırası (SELECT...FROM...WHERE...) ile mantıksal çalışma sırası (FROM...WHERE...SELECT...) farklıdır.",
    },
    {
      id: "2-7-q2",
      soru: "Mantıksal çalışma sırasında WHERE, GROUP BY'dan önce mi sonra mı çalışır?",
      secenekler: [
        "Önce çalışır — WHERE satırları filtreler, sonra GROUP BY gruplar",
        "Sonra çalışır — önce gruplanır, sonra satırlar filtrelenir",
        "İkisi aynı anda çalışır",
        "Bu sıralama veritabanına göre değişir",
      ],
      dogruIndex: 0,
      aciklama: "Çalışma sırası: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.",
    },
    {
      id: "2-7-q3",
      soru: "SELECT'te tanımlanan bir takma ad (alias) neden WHERE içinde kullanılamaz?",
      secenekler: [
        "SQLite takma adları desteklemez",
        "WHERE, SELECT'ten ÖNCE çalışır; o an alias henüz tanımlanmamıştır",
        "Takma adlar sadece ORDER BY için tasarlanmıştır",
        "Bu bir SQLite hatasıdır, diğer veritabanlarında çalışır",
      ],
      dogruIndex: 1,
      aciklama: "WHERE, mantıksal sırada SELECT'ten önce çalıştığı için SELECT'te tanımlanan alias'lar henüz mevcut değildir.",
    },
    {
      id: "2-7-q4",
      soru: "Peki neden aynı takma ad ORDER BY içinde kullanılabilir?",
      secenekler: [
        "ORDER BY özel bir istisnadır, kuralı yoktur",
        "ORDER BY, SELECT'ten SONRA çalışır; bu noktada alias artık tanımlıdır",
        "Sadece sayısal takma adlar ORDER BY'da çalışır",
        "Aslında ORDER BY'da da çalışmaz",
      ],
      dogruIndex: 1,
      aciklama: "ORDER BY, mantıksal sırada SELECT'ten sonra (6. adımda) çalıştığı için SELECT'te tanımlanan alias'ları kullanabilir.",
    },
    {
      id: "2-7-q5",
      soru: "Aşağıdakilerden hangisi doğru mantıksal çalışma sırasıdır?",
      secenekler: [
        "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT",
        "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
        "FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT",
        "WHERE → FROM → SELECT → GROUP BY → HAVING → ORDER BY → LIMIT",
      ],
      dogruIndex: 1,
      aciklama: "Doğru sıra: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.",
    },
  ],
});
