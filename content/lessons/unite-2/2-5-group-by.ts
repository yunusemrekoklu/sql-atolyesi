import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const groupBy = defineLesson({
  slug: "group-by",
  uniteId: 2,
  dersNo: "2.5",
  baslik: "GROUP BY",
  veritabaniId: eticaretDb.id,
  anlatim: `
Önceki derste toplulaştırma fonksiyonlarını (\`COUNT\`, \`SUM\`, \`AVG\`...) **tüm tablo** üzerinde kullandık. \`GROUP BY\` ile bunları **her grup için ayrı ayrı** hesaplayabiliriz — ör. "her kategoride kaç ürün var?"

## Temel GROUP BY kullanımı

\`GROUP BY\`, satırları belirttiğin sütun(lar)daki **aynı değerlere** göre gruplara ayırır; toplulaştırma fonksiyonları da artık tüm tablo yerine **her grup için ayrı ayrı** hesaplanır:

\`\`\`sql
SELECT kategori, COUNT(*) AS urun_sayisi FROM urunler GROUP BY kategori;
\`\`\`

Bu sorgu, her farklı \`kategori\` değeri için bir satır döndürür — o kategorideki ürün sayısıyla birlikte.

## Sık yapılan bir hata

\`SELECT\` listesindeki bir sütun ne \`GROUP BY\`'da ne de bir toplulaştırma fonksiyonu içinde olursa hataya yol açar:

\`\`\`sql
-- HATALI: urun_adi GROUP BY'da yok ve toplulaştırılmamış
SELECT kategori, urun_adi, COUNT(*) FROM urunler GROUP BY kategori;
\`\`\`

Bir kategoride birden fazla ürün varsa, SQLite hangi \`urun_adi\`'nı göstereceğini bilemez. **Kural:** \`SELECT\`'teki her sütun ya \`GROUP BY\`'da olmalı ya da bir toplulaştırma fonksiyonu içinde kullanılmalı.

## Çoklu sütunla gruplama

\`GROUP BY\`'a birden fazla sütun verirsen, o sütunların **birlikte** oluşturduğu her benzersiz kombinasyon ayrı bir grup sayılır — tıpkı \`DISTINCT\`'in birden fazla sütunla çalışması gibi.
`,
  ornekler: [
    { aciklama: "Her kategorideki ürün sayısını hesapla:", sql: "SELECT kategori, COUNT(*) AS urun_sayisi FROM urunler GROUP BY kategori;" },
  ],
  onizlemeTablolari: ["urunler"],
  alistirmalar: [
    {
      id: "2-5-1",
      seviye: "Kolay",
      baslik: "Kategori Başına Ürün Sayısı",
      soru: "Her kategorideki ürün sayısını (kategori, urun_sayisi) getiren bir sorgu yaz.",
      ipucu: "SELECT kategori, COUNT(*) AS urun_sayisi FROM urunler GROUP BY kategori;",
      cozumSql: "SELECT kategori, COUNT(*) AS urun_sayisi FROM urunler GROUP BY kategori;",
      mod: "sonuc",
    },
    {
      id: "2-5-2",
      seviye: "Kolay",
      baslik: "Şehir Başına Müşteri Sayısı",
      soru: "Her şehirdeki müşteri sayısını (sehir, musteri_sayisi) getiren bir sorgu yaz.",
      ipucu: "GROUP BY sehir kullanarak müşterileri şehre göre grupla.",
      cozumSql: "SELECT sehir, COUNT(*) AS musteri_sayisi FROM musteriler GROUP BY sehir;",
      mod: "sonuc",
    },
    {
      id: "2-5-3",
      seviye: "Orta",
      baslik: "Kategori Başına Ortalama Fiyat",
      soru: "Her kategorinin ortalama ürün fiyatını (kategori, ortalama_fiyat) getiren bir sorgu yaz.",
      ipucu: "AVG(fiyat)'ı GROUP BY kategori ile birleştir.",
      cozumSql: "SELECT kategori, AVG(fiyat) AS ortalama_fiyat FROM urunler GROUP BY kategori;",
      mod: "sonuc",
    },
    {
      id: "2-5-4",
      seviye: "Orta",
      baslik: "Duruma Göre Sipariş Sayısı",
      soru: "Her sipariş durumundaki (durum) sipariş sayısını, sayıya göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "GROUP BY durum yaptıktan sonra ORDER BY ile COUNT sonucunu sırala.",
      cozumSql: "SELECT durum, COUNT(*) AS siparis_sayisi FROM siparisler GROUP BY durum ORDER BY siparis_sayisi DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-5-5",
      seviye: "Orta",
      baslik: "Ürün Başına Toplam Satış Adedi",
      soru: "siparis_detay tablosunda her urun_id için toplam satılan adedi (urun_id, toplam_satis) getiren bir sorgu yaz.",
      ipucu: "SELECT urun_id, SUM(adet) AS toplam_satis FROM siparis_detay GROUP BY urun_id;",
      cozumSql: "SELECT urun_id, SUM(adet) AS toplam_satis FROM siparis_detay GROUP BY urun_id;",
      mod: "sonuc",
    },
    {
      id: "2-5-6",
      seviye: "Zor",
      baslik: "En Çok Sipariş Veren Müşteriler",
      soru: "Her müşterinin (musteri_id) kaç siparişi olduğunu, sipariş sayısına göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "GROUP BY musteri_id ... ORDER BY COUNT(*) DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT musteri_id, COUNT(*) AS siparis_sayisi FROM siparisler GROUP BY musteri_id ORDER BY siparis_sayisi DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "2-5-q1",
      soru: "GROUP BY ne işe yarar?",
      secenekler: [
        "Satırları alfabetik sıralar",
        "Satırları belirtilen sütun(lar)daki aynı değerlere göre gruplara ayırır",
        "Belirli bir satır sayısıyla sınırlar",
        "İki tabloyu birleştirir",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY, satırları grup grup toplayarak toplulaştırma fonksiyonlarının her grup için ayrı hesaplanmasını sağlar.",
    },
    {
      id: "2-5-q2",
      soru: "SELECT kategori, urun_adi, COUNT(*) FROM urunler GROUP BY kategori; sorgusu neden hataya yol açar?",
      secenekler: [
        "COUNT(*) GROUP BY ile kullanılamaz",
        "urun_adi ne GROUP BY'da ne de bir toplulaştırma fonksiyonu içinde — SQLite hangi değeri göstereceğini bilemez",
        "kategori sütunu metin olduğu için gruplanamaz",
        "Bu sorgu hataya yol açmaz",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY kullanıldığında, SELECT'teki toplulaştırılmamış her sütun GROUP BY listesinde de olmalıdır.",
    },
    {
      id: "2-5-q3",
      soru: "GROUP BY olmadan COUNT(*) gibi bir toplulaştırma fonksiyonu kullanılırsa ne olur?",
      secenekler: [
        "Hata verir",
        "Tüm tablo tek bir grup sayılır, tek satırlık bir sonuç döner",
        "Her satır için ayrı bir sonuç döner",
        "Sorgu hiçbir şey döndürmez",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY belirtilmezse, toplulaştırma fonksiyonu tüm tabloyu (veya WHERE'den geçen satırları) tek bir grup olarak ele alır.",
    },
    {
      id: "2-5-q4",
      soru: "GROUP BY birden fazla sütunla kullanılabilir mi?",
      secenekler: [
        "Hayır, sadece tek sütunla kullanılabilir",
        "Evet, sütunların birlikte oluşturduğu her benzersiz kombinasyon ayrı bir grup olur",
        "Evet ama en fazla iki sütunla",
        "Sadece sayısal sütunlarla kullanılabilir",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY sutun1, sutun2 yazıldığında, bu iki sütunun birlikte oluşturduğu her farklı kombinasyon kendi grubunu oluşturur.",
    },
  ],
});
