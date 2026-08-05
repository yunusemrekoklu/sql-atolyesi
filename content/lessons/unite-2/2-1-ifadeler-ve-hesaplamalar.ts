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
      seviye: "Orta",
      baslik: "Pahalıdan Ucuza Ürün Listesi",
      soru: "Tüm ürünlerin adını ve fiyatını, fiyatı en yüksekten en düşüğe doğru sıralayarak listele.",
      ipucu: "ORDER BY fiyat DESC ile sıralama yapabilirsin. Bu alıştırmada satır sırası da kontrol ediliyor.",
      cozumSql: "SELECT urun_adi, fiyat FROM urunler ORDER BY fiyat DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "2-1-3",
      seviye: "Zor",
      baslik: "Elektronik Ürünlere Zam",
      soru:
        "'Elektronik' kategorisindeki tüm ürünlerin fiyatını %10 artır (yeni fiyat = eski fiyat * 1.1 olacak şekilde tabloyu güncelle). Diğer kategorilerdeki ürünler değişmemeli.",
      ipucu: "UPDATE urunler SET fiyat = ... WHERE kategori = 'Elektronik'; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE urunler SET fiyat = fiyat * 1.1 WHERE kategori = 'Elektronik';",
      mod: "tabloDurumu",
    },
  ],
});
