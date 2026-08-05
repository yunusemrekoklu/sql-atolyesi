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
- **NULL kontrolü** (2.2) — eksik verilerle (\`telefon\`, \`iptal_nedeni\`) çalışma
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
      sql: "SELECT kategori, COUNT(*) AS urun_sayisi, AVG(fiyat) AS ortalama_fiyat FROM urunler GROUP BY kategori ORDER BY urun_sayisi DESC;",
    },
  ],
  onizlemeTablolari: ["urunler", "siparisler"],
  alistirmalar: [
    {
      id: "2-t-1",
      seviye: "Kolay",
      baslik: "İndirim Hesabı",
      soru: "Her ürünün adını ve %15 indirimli fiyatını (indirimli_fiyat) hesapla.",
      ipucu: "fiyat * 0.85 AS indirimli_fiyat kalıbını kullanabilirsin (Ders 2.1 hatırlatması).",
      cozumSql: "SELECT urun_adi, fiyat * 0.85 AS indirimli_fiyat FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-t-2",
      seviye: "Kolay",
      baslik: "Telefonu Eksik Müşteriler",
      soru: "Telefon numarası kayıtlı OLMAYAN müşterilerin adını ve şehrini getir.",
      ipucu: "WHERE telefon IS NULL kalıbını kullanabilirsin (Ders 2.2 hatırlatması).",
      cozumSql: "SELECT ad_soyad, sehir FROM musteriler WHERE telefon IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-t-3",
      seviye: "Orta",
      baslik: "Stok Uyarı Etiketi",
      soru:
        "Her ürünün adını, stok_miktari'nı ve bir stok_durumu etiketi getir: 10'dan az ise 'Kritik', 10-29 arası 'Az', 30 ve üzeri 'Yeterli'.",
      ipucu: "CASE WHEN stok_miktari < 10 THEN 'Kritik' WHEN stok_miktari < 30 THEN 'Az' ELSE 'Yeterli' END (Ders 2.3 hatırlatması).",
      cozumSql:
        "SELECT urun_adi, stok_miktari, CASE WHEN stok_miktari < 10 THEN 'Kritik' WHEN stok_miktari < 30 THEN 'Az' ELSE 'Yeterli' END AS stok_durumu FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-t-4",
      seviye: "Orta",
      baslik: "Kategori Raporu",
      soru:
        "Her kategori için ürün sayısını (urun_sayisi), ortalama fiyatı (ortalama_fiyat) ve toplam stok miktarını (toplam_stok) tek sorguda getir.",
      ipucu: "GROUP BY kategori ile COUNT(*), AVG(fiyat), SUM(stok_miktari)'ı birlikte kullan (Ders 2.4 + 2.5 hatırlatması).",
      cozumSql:
        "SELECT kategori, COUNT(*) AS urun_sayisi, AVG(fiyat) AS ortalama_fiyat, SUM(stok_miktari) AS toplam_stok FROM urunler GROUP BY kategori;",
      mod: "sonuc",
    },
    {
      id: "2-t-5",
      seviye: "Orta",
      baslik: "Aktif Müşteriler",
      soru: "En az 2 siparişi olan müşterilerin id'sini ve sipariş sayısını getir.",
      ipucu: "GROUP BY musteri_id HAVING COUNT(*) >= 2 kalıbını kullanabilirsin (Ders 2.5 + 2.6 hatırlatması).",
      cozumSql: "SELECT musteri_id, COUNT(*) AS siparis_sayisi FROM siparisler GROUP BY musteri_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
    {
      id: "2-t-6",
      seviye: "Zor",
      baslik: "İptal Olmayan Sadık Müşteriler",
      soru:
        "İptal EDİLMEMİŞ (durum != 'İptal') siparişleri say, müşteri bazında grupla, en az 2 siparişi olanları filtrele, sipariş sayısına göre azalan sırada getir (musteri_id, siparis_sayisi).",
      ipucu: "WHERE durum != 'İptal' GROUP BY musteri_id HAVING COUNT(*) >= 2 ORDER BY siparis_sayisi DESC kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT musteri_id, COUNT(*) AS siparis_sayisi FROM siparisler WHERE durum != 'İptal' GROUP BY musteri_id HAVING COUNT(*) >= 2 ORDER BY siparis_sayisi DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-t-7",
      seviye: "Zor",
      baslik: "Yüksek Değerli Kategoriler",
      soru:
        "Her kategorinin toplam stok değerini (SUM(fiyat * stok_miktari)) hesapla; toplam değeri 40.000 TL ve üzeri olan kategorileri, değere göre azalan sırada getir (kategori, toplam_deger).",
      ipucu: "GROUP BY kategori HAVING SUM(fiyat * stok_miktari) >= 40000 ORDER BY toplam_deger DESC — takma adı WHERE/HAVING'de değil, sadece ORDER BY'da kullanabildiğini unutma (Ders 2.7 hatırlatması).",
      cozumSql:
        "SELECT kategori, SUM(fiyat * stok_miktari) AS toplam_deger FROM urunler GROUP BY kategori HAVING SUM(fiyat * stok_miktari) >= 40000 ORDER BY toplam_deger DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "2-t-q1",
      soru: "fiyat * 0.85 gibi bir ifade çalıştırıldığında veritabanındaki veriyi değiştirir mi?",
      secenekler: [
        "Evet, fiyat sütunu kalıcı olarak güncellenir",
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
