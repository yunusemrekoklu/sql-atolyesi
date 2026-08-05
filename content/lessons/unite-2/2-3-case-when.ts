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
SELECT urun_adi, fiyat,
  CASE
    WHEN fiyat >= 1500 THEN 'Pahalı'
    ELSE 'Uygun'
  END AS fiyat_kategorisi
FROM urunler;
\`\`\`

\`CASE\`, koşulları **yukarıdan aşağı sırayla** kontrol eder ve **ilk doğru olan** \`WHEN\`'in sonucunu döndürür. \`ELSE\`, hiçbir \`WHEN\` eşleşmezse kullanılır — \`ELSE\` yazılmazsa ve hiçbir koşul sağlanmazsa sonuç \`NULL\` olur. İfade her zaman \`END\` ile kapatılır.

## Birden fazla WHEN

İstediğin kadar \`WHEN\` ekleyebilirsin — bu, sınavlarda ve mülakatlarda çok sık karşına çıkan bir kalıptır:

\`\`\`sql
SELECT urun_adi, fiyat,
  CASE
    WHEN fiyat < 600 THEN 'Ucuz'
    WHEN fiyat <= 1500 THEN 'Orta'
    ELSE 'Pahalı'
  END AS fiyat_seviyesi
FROM urunler;
\`\`\`

\`CASE WHEN\`, ileride toplulaştırma fonksiyonlarıyla (\`SUM(CASE WHEN ...)\` gibi) birleştirilerek koşullu sayım/toplama yapmak için de kullanılır — bunu ileri derslerde göreceksin.
`,
  ornekler: [
    {
      aciklama: "Ürünleri fiyatına göre 'Pahalı' / 'Uygun' olarak etiketle:",
      sql: "SELECT urun_adi, fiyat, CASE WHEN fiyat >= 1500 THEN 'Pahalı' ELSE 'Uygun' END AS fiyat_kategorisi FROM urunler;",
    },
  ],
  onizlemeTablolari: ["urunler"],
  alistirmalar: [
    {
      id: "2-3-1",
      seviye: "Kolay",
      baslik: "Stok Durumu Etiketi",
      soru: "Her ürünün adını ve bir stok_durumu etiketi getir: stok_miktari 0 ise 'Tükendi', değilse 'Stokta' yazsın.",
      ipucu: "CASE WHEN stok_miktari = 0 THEN 'Tükendi' ELSE 'Stokta' END kalıbını kullanabilirsin.",
      cozumSql: "SELECT urun_adi, CASE WHEN stok_miktari = 0 THEN 'Tükendi' ELSE 'Stokta' END AS stok_durumu FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-3-2",
      seviye: "Orta",
      baslik: "Üç Kademeli Fiyat Etiketi",
      soru: "Her ürünün adını, fiyatını ve bir fiyat_seviyesi etiketi getir: fiyat 600'den az ise 'Ucuz', 600-1500 arası (1500 dahil) 'Orta', 1500'den fazla ise 'Pahalı'.",
      ipucu: "Birden fazla WHEN kullanabilirsin: WHEN fiyat < 600 THEN 'Ucuz' WHEN fiyat <= 1500 THEN 'Orta' ELSE 'Pahalı'",
      cozumSql:
        "SELECT urun_adi, fiyat, CASE WHEN fiyat < 600 THEN 'Ucuz' WHEN fiyat <= 1500 THEN 'Orta' ELSE 'Pahalı' END AS fiyat_seviyesi FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-3-3",
      seviye: "Orta",
      baslik: "Sipariş Durum Simgesi",
      soru: "Her siparişin id'sini, durumunu ve bir simge sütununu getir: durum 'Teslim Edildi' ise '✓', 'İptal' ise '✗', diğer tüm durumlar için '…' yazsın.",
      ipucu: "WHEN durum = 'Teslim Edildi' THEN '✓' WHEN durum = 'İptal' THEN '✗' ELSE '…' şeklinde ilerleyebilirsin.",
      cozumSql:
        "SELECT siparis_id, durum, CASE WHEN durum = 'Teslim Edildi' THEN '✓' WHEN durum = 'İptal' THEN '✗' ELSE '…' END AS simge FROM siparisler;",
      mod: "sonuc",
    },
    {
      id: "2-3-4",
      seviye: "Orta",
      baslik: "Kategori Bazlı İndirim",
      soru:
        "Her ürünün adını, kategorisini ve bir indirimli_fiyat hesapla: kategori 'Elektronik' ise %10 indirim (fiyat * 0.9), 'Giyim' ise %20 indirim (fiyat * 0.8), diğer kategoriler %5 indirim (fiyat * 0.95) uygulansın.",
      ipucu: "CASE içinde her WHEN'in sonucunda bir ifade (hesaplama) da yazabilirsin: WHEN kategori = 'Elektronik' THEN fiyat * 0.9",
      cozumSql:
        "SELECT urun_adi, kategori, CASE WHEN kategori = 'Elektronik' THEN fiyat * 0.9 WHEN kategori = 'Giyim' THEN fiyat * 0.8 ELSE fiyat * 0.95 END AS indirimli_fiyat FROM urunler;",
      mod: "sonuc",
    },
    {
      id: "2-3-5",
      seviye: "Zor",
      baslik: "Sipariş Kalemi Paket Boyutu",
      soru:
        "siparis_detay tablosundaki her satır için detay_id, adet ve bir paket_boyutu etiketi getir: adet 1 ise 'Tekli', 2 ile 3 arası (dahil) 'Küçük Paket', 3'ten fazla ise 'Büyük Paket'.",
      ipucu: "WHEN adet = 1 THEN 'Tekli' WHEN adet BETWEEN 2 AND 3 THEN 'Küçük Paket' ELSE 'Büyük Paket' — BETWEEN'i CASE içinde de kullanabilirsin.",
      cozumSql:
        "SELECT detay_id, adet, CASE WHEN adet = 1 THEN 'Tekli' WHEN adet BETWEEN 2 AND 3 THEN 'Küçük Paket' ELSE 'Büyük Paket' END AS paket_boyutu FROM siparis_detay;",
      mod: "sonuc",
    },
    {
      id: "2-3-6",
      seviye: "Zor",
      baslik: "Müşteri Şehir Grubu",
      soru:
        "Her müşterinin adını, şehrini ve bir sehir_grubu etiketi getir: şehri İstanbul, Ankara veya İzmir ise 'Büyükşehir', diğer şehirler için 'Diğer' yazsın (IN ile CASE'i birleştir).",
      ipucu: "WHEN sehir IN ('İstanbul', 'Ankara', 'İzmir') THEN 'Büyükşehir' ELSE 'Diğer' kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT ad_soyad, sehir, CASE WHEN sehir IN ('İstanbul', 'Ankara', 'İzmir') THEN 'Büyükşehir' ELSE 'Diğer' END AS sehir_grubu FROM musteriler;",
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
