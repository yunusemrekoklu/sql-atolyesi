import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const toplulastirmaFonksiyonlari = defineLesson({
  slug: "toplulastirma-fonksiyonlari",
  uniteId: 2,
  dersNo: "2.4",
  baslik: "Toplulaştırma Fonksiyonları",
  veritabaniId: eticaretDb.id,
  anlatim: `
Şimdiye kadar sorgularımız hep **satır satır** sonuç verdi. Bazen ise tüm tablo (veya bir bölümü) hakkında **tek bir özet sayı** öğrenmek isteriz — "kaç ürünümüz var?", "ortalama fiyat ne?" gibi. Bunun için **toplulaştırma fonksiyonları** (aggregate functions) kullanılır.

## Temel toplulaştırma fonksiyonları

| Fonksiyon | Ne yapar |
|---|---|
| \`COUNT(*)\` | satır sayısını sayar |
| \`SUM(sutun)\` | sayısal bir sütunun toplamını alır |
| \`AVG(sutun)\` | sayısal bir sütunun ortalamasını alır |
| \`MIN(sutun)\` / \`MAX(sutun)\` | en küçük / en büyük değeri bulur |

\`\`\`sql
SELECT COUNT(*) AS toplam_urun, AVG(fiyat) AS ortalama_fiyat FROM urunler;
\`\`\`

Bu sorgu tek bir satır döndürür — çünkü toplulaştırma fonksiyonları tüm tabloyu (veya \`WHERE\` ile filtrelenmiş satırları) **tek bir sonuca** indirger.

## COUNT(*) vs COUNT(sütun) — önemli fark!

\`COUNT(*)\`, tüm satırları sayar (NULL değerler dahil). \`COUNT(sutun)\` ise sadece o **sütunu NULL olmayan** satırları sayar. Önceki dersteki \`telefon\` sütununu hatırlıyor musun?

\`\`\`sql
SELECT COUNT(*) AS toplam_musteri, COUNT(telefon) AS telefonu_olan FROM musteriler;
\`\`\`

Bu sorgu iki farklı sayı döndürür: toplam müşteri sayısı ile telefon numarası **kayıtlı olan** müşteri sayısı. \`MIN\` ve \`MAX\`, metin sütunlarında da çalışır — alfabetik olarak en küçük/en büyük değeri bulur.
`,
  ornekler: [
    { aciklama: "Toplam ürün sayısı ve ortalama fiyatı hesapla:", sql: "SELECT COUNT(*) AS toplam_urun, AVG(fiyat) AS ortalama_fiyat FROM urunler;" },
  ],
  onizlemeTablolari: ["urunler"],
  alistirmalar: [
    {
      id: "2-4-1",
      seviye: "Kolay",
      baslik: "Toplam Ürün Sayısı",
      soru: "urunler tablosundaki toplam satır (ürün) sayısını getiren bir sorgu yaz.",
      ipucu: "SELECT COUNT(*) FROM urunler; kalıbını kullanabilirsin.",
      cozumSql: "SELECT COUNT(*) AS urun_sayisi FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-4-2",
      seviye: "Kolay",
      baslik: "En Pahalı ve En Ucuz Ürün Fiyatı",
      soru: "urunler tablosundaki en yüksek ve en düşük fiyatı (en_pahali, en_ucuz) tek sorguda getir.",
      ipucu: "MAX(fiyat) AS en_pahali, MIN(fiyat) AS en_ucuz kalıbını kullanabilirsin.",
      cozumSql: "SELECT MAX(fiyat) AS en_pahali, MIN(fiyat) AS en_ucuz FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-4-3",
      seviye: "Orta",
      baslik: "Toplam Stok Değeri",
      soru: "Tüm ürünlerin toplam stok değerini (her ürün için fiyat * stok_miktari, hepsinin toplamı) hesaplayan bir sorgu yaz.",
      ipucu: "SUM(fiyat * stok_miktari) — SUM içinde bir ifade de kullanabilirsin.",
      cozumSql: "SELECT SUM(fiyat * stok_miktari) AS toplam_stok_degeri FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-4-4",
      seviye: "Orta",
      baslik: "Telefon Kaydı Karşılaştırması",
      soru: "Toplam müşteri sayısını ve telefon numarası KAYITLI OLAN müşteri sayısını tek sorguda getir (COUNT(*) ile COUNT(sütun) arasındaki farkı gözlemle).",
      ipucu: "COUNT(*) AS toplam_musteri, COUNT(telefon) AS telefonu_olan kalıbını kullanabilirsin.",
      cozumSql: "SELECT COUNT(*) AS toplam_musteri, COUNT(telefon) AS telefonu_olan FROM musteriler;",
      mod: "sonuc",
    },
    {
      id: "2-4-5",
      seviye: "Orta",
      baslik: "Ortalama Sipariş Kalemi Tutarı",
      soru: "siparis_detay tablosundaki her satırın tutarını (adet * birim_fiyat) hesaba katarak, ortalama sipariş kalemi tutarını getiren bir sorgu yaz.",
      ipucu: "AVG(adet * birim_fiyat) kalıbını kullanabilirsin.",
      cozumSql: "SELECT AVG(adet * birim_fiyat) AS ortalama_tutar FROM siparis_detay;",
      mod: "sonuc",
    },
    {
      id: "2-4-6",
      seviye: "Zor",
      baslik: "Elektronik Kategorisi Özeti",
      soru: "'Elektronik' kategorisindeki ürün sayısını ve bu ürünlerin toplam stok miktarını (stok_miktari toplamı) tek sorguda getir.",
      ipucu: "Önce WHERE kategori = 'Elektronik' ile filtrele, sonra COUNT(*) ve SUM(stok_miktari) hesapla.",
      cozumSql: "SELECT COUNT(*) AS urun_sayisi, SUM(stok_miktari) AS toplam_stok FROM urunler WHERE kategori = 'Elektronik';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "2-4-q1",
      soru: "COUNT(*) ne sayar?",
      secenekler: [
        "Sadece NULL olmayan değerleri",
        "Tablodaki (veya filtrelenmiş) toplam satır sayısını, NULL'lar dahil",
        "Sütun sayısını",
        "Farklı (distinct) değer sayısını",
      ],
      dogruIndex: 1,
      aciklama: "COUNT(*), her satırı sayar; belirli bir sütunun NULL olup olmadığına bakmaz.",
    },
    {
      id: "2-4-q2",
      soru: "COUNT(telefon) ile COUNT(*) arasındaki fark nedir?",
      secenekler: [
        "Aralarında hiç fark yoktur",
        "COUNT(telefon) sadece telefon sütunu NULL OLMAYAN satırları sayar",
        "COUNT(telefon) her zaman COUNT(*)'tan büyüktür",
        "COUNT(telefon) sadece sayısal sütunlarda çalışır",
      ],
      dogruIndex: 1,
      aciklama: "COUNT(sutun), o sütundaki NULL değerleri saymaz; COUNT(*) ise NULL'a bakmaksızın tüm satırları sayar.",
    },
    {
      id: "2-4-q3",
      soru: "AVG() fonksiyonu neyi hesaplar?",
      secenekler: [
        "Belirtilen sütunun toplamını",
        "Belirtilen sütunun ortalamasını",
        "Belirtilen sütundaki farklı değer sayısını",
        "Belirtilen sütunun en büyük değerini",
      ],
      dogruIndex: 1,
      aciklama: "AVG, verilen sayısal sütunun ortalama (aritmetik ortalama) değerini hesaplar.",
    },
    {
      id: "2-4-q4",
      soru: "SUM(fiyat) sonucuna bakarak kaç satır olduğunu doğrudan öğrenebilir misin?",
      secenekler: [
        "Evet, SUM otomatik olarak satır sayısını da gösterir",
        "Hayır, SUM sadece toplamı verir; satır sayısı için COUNT gerekir",
        "Evet ama sadece fiyat sütunu NOT NULL ise",
        "Hayır, SUM hiçbir zaman sayısal sonuç vermez",
      ],
      dogruIndex: 1,
      aciklama: "SUM tek başına toplam değeri verir; kaç satırın toplandığını bilmek istersen ayrıca COUNT(*) çalıştırman gerekir.",
    },
    {
      id: "2-4-q5",
      soru: "MIN() ve MAX() metin (TEXT) sütunlarında da çalışır mı?",
      secenekler: [
        "Hayır, sadece sayısal sütunlarda çalışır",
        "Evet, alfabetik olarak en küçük/en büyük değeri bulur",
        "Evet ama sonuç her zaman NULL olur",
        "Sadece tarih formatındaki metinlerde çalışır",
      ],
      dogruIndex: 1,
      aciklama: "MIN/MAX metin sütunlarında alfabetik sıralamaya göre en küçük/en büyük değeri (ör. A'ya en yakın / Z'ye en yakın) bulur.",
    },
  ],
});
