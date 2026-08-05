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

Örneğin \`urunler\` tablosundaki her ürünün stok değerini (fiyat × adet) hesaplamak için:

\`\`\`sql
SELECT urun_adi, fiyat * stok_miktari FROM urunler;
\`\`\`

## AS ile takma ad verme

Yukarıdaki sorguyu çalıştırırsan sonuç tablosundaki ikinci sütunun adının garip (\`fiyat * stok_miktari\`) göründüğünü fark edersin. \`AS\` anahtar kelimesiyle hesaplanan sütuna okunabilir bir isim (takma ad / *alias*) verebilirsin:

\`\`\`sql
SELECT urun_adi, fiyat * stok_miktari AS stok_degeri FROM urunler;
\`\`\`

Bu, sadece sayısal sütunlarla sınırlı değil — metin sütunlarını \`||\` ile birleştirip tek bir sütun olarak da getirebilirsin (ör. ad ve soyadı birleştirmek).

**Önemli nokta:** İfadeler veritabanındaki veriyi **değiştirmez** — sadece sorgunun döndürdüğü sonucu hesaplar. Aşağıdaki alıştırmalardan birinde, hesapladığın değeri gerçekten tabloya *yazmak* için \`UPDATE\` kullanacaksın; \`UPDATE\` ayrı bir konu ama ifadelerle iç içe çalışır.

Bu derste \`eticaret\` veritabanını kullanacaksın — sağdaki şema panelinden tablolara göz atabilirsin.
`,
  ornekler: [
    {
      aciklama: "Her ürünün adını ve %20 indirimli fiyatını hesapla:",
      sql: "SELECT urun_adi, fiyat * 0.8 AS indirimli_fiyat FROM urunler;",
    },
  ],
  onizlemeTablolari: ["urunler"],
  alistirmalar: [
    {
      id: "2-1-1",
      seviye: "Kolay",
      baslik: "İndirimli Fiyat",
      soru:
        "urunler tablosundaki her ürün için ürün adını ve %20 indirimli fiyatını (fiyat * 0.8) getiren bir sorgu yaz.",
      ipucu: "SELECT ürün_adı, fiyat * 0.8 FROM urunler; şeklinde bir ifade yeterli, sütuna istediğin adı AS ile verebilirsin.",
      cozumSql: "SELECT urun_adi, fiyat * 0.8 AS indirimli_fiyat FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-1-2",
      seviye: "Kolay",
      baslik: "Müşteri Etiketi",
      soru:
        "musteriler tablosundaki her müşteri için ad_soyad ve sehir bilgisini \"Ad Soyad (Şehir)\" formatında tek bir sütunda birleştiren bir sorgu yaz.",
      ipucu: "Metin birleştirme için || operatörünü kullan: ad_soyad || ' (' || sehir || ')'",
      cozumSql: "SELECT ad_soyad || ' (' || sehir || ')' AS etiket FROM musteriler;",
      mod: "sonuc",
    },
    {
      id: "2-1-3",
      seviye: "Orta",
      baslik: "Pahalıdan Ucuza Ürün Listesi",
      soru: "Tüm ürünlerin adını ve fiyatını, fiyatı en yüksekten en düşüğe doğru sıralayarak listele.",
      ipucu: "ORDER BY fiyat DESC ile sıralama yapabilirsin. Bu alıştırmada satır sırası da kontrol ediliyor.",
      cozumSql: "SELECT urun_adi, fiyat FROM urunler ORDER BY fiyat DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-1-4",
      seviye: "Orta",
      baslik: "Sipariş Detay Tutarı",
      soru:
        "siparis_detay tablosundaki her satır için detay_id ile birlikte toplam tutarı (adet * birim_fiyat) hesaplayan bir sorgu yaz.",
      ipucu: "SELECT detay_id, adet * birim_fiyat FROM siparis_detay; sütuna istediğin adı AS ile verebilirsin.",
      cozumSql: "SELECT detay_id, adet * birim_fiyat AS toplam_tutar FROM siparis_detay;",
      mod: "sonuc",
    },
    {
      id: "2-1-5",
      seviye: "Zor",
      baslik: "Yüksek Stok Değerli Ürünler",
      soru:
        "Stok değeri (fiyat * stok_miktari) 40.000 TL'nin üzerinde olan ürünlerin adını ve stok değerini, değere göre çoktan aza sıralayarak listele.",
      ipucu: "WHERE'de ifadeyi (AS ile verdiğin takma adı değil) tekrar yazman gerekiyor: WHERE fiyat * stok_miktari > 40000",
      cozumSql:
        "SELECT urun_adi, fiyat * stok_miktari AS stok_degeri FROM urunler WHERE fiyat * stok_miktari > 40000 ORDER BY stok_degeri DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-1-6",
      seviye: "Zor",
      baslik: "Elektronik Ürünlere Zam",
      soru:
        "'Elektronik' kategorisindeki tüm ürünlerin fiyatını %10 artır (yeni fiyat = eski fiyat * 1.1 olacak şekilde tabloyu güncelle). Diğer kategorilerdeki ürünler değişmemeli.",
      ipucu: "UPDATE urunler SET fiyat = ... WHERE kategori = 'Elektronik'; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE urunler SET fiyat = fiyat * 1.1 WHERE kategori = 'Elektronik';",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "2-1-q1",
      soru: "SELECT fiyat * 2 FROM urunler; sorgusu urunler tablosundaki fiyat sütununu değiştirir mi?",
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
      soru: "SELECT urun_adi, fiyat * 0.8 FROM urunler; sorgusunda ikinci sütuna okunabilir bir isim vermek için ne kullanılır?",
      secenekler: ["AS", "IS", "IN", "LIKE"],
      dogruIndex: 0,
      aciklama: "AS anahtar kelimesi, bir ifadeye veya sütuna takma ad (alias) vermek için kullanılır.",
    },
    {
      id: "2-1-q3",
      soru: "SQLite'ta iki metin sütununu birleştirmek (concat) için hangi operatör kullanılır?",
      secenekler: ["+", "&", "||", "CONCAT()"],
      dogruIndex: 2,
      aciklama: "SQLite'ta metin birleştirme operatörü || işaretidir (ör. ad_soyad || ' - ' || sehir).",
    },
    {
      id: "2-1-q4",
      soru:
        "urunler tablosunda fiyat * stok_miktari AS stok_degeri hesaplanan bir sorguda, WHERE stok_degeri > 1000 yazmak neden hataya yol açar?",
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
