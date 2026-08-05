import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const nullIleCalismak = defineLesson({
  slug: "null-ile-calismak",
  uniteId: 2,
  dersNo: "2.2",
  baslik: "NULL ile Çalışmak",
  veritabaniId: eticaretDb.id,
  anlatim: `
\`musteriler\` tablosuna bakarsan bazı müşterilerin \`telefon\` sütununun boş olduğunu görürsün. Bu boşluk, boş bir metin (\`''\`) değil — **\`NULL\`**'dır: "bu değer bilinmiyor / kayıtlı değil" anlamına gelir. NULL, SQL'de sık karıştırılan ama çok önemli bir kavramdır.

## NULL'ı kontrol etmek: IS NULL / IS NOT NULL

NULL, hiçbir değere (NULL dahil) \`=\` ile eşit sayılmaz — çünkü "bilinmeyen bir şeyin bilinmeyen bir şeye eşit olup olmadığı" da bilinmez. Bu yüzden \`WHERE telefon = NULL\` **hiçbir zaman** satır getirmez (mantıksal bir hata değil ama beklenmedik bir sonuçtur). Bunun yerine özel bir operatör kullanılır:

\`\`\`sql
SELECT ad_soyad FROM musteriler WHERE telefon IS NULL;
SELECT ad_soyad FROM musteriler WHERE telefon IS NOT NULL;
\`\`\`

## NULL ile aritmetik

NULL içeren herhangi bir aritmetik işlem de NULL sonucu verir: \`5 + NULL\` sonucu \`NULL\`'dır, \`NULL\`'ı sıfır gibi düşünmemelisin. Bu, ileride toplulaştırma fonksiyonlarında (\`SUM\`, \`AVG\`) dikkat etmen gereken bir tuzaktır.

## COALESCE ve IFNULL ile varsayılan değer

Bir sütun NULL olduğunda ekranda boş görünmesin, anlamlı bir varsayılan değer gösterilsin istersen \`COALESCE\` kullanılır — verilen değerlerden **ilk NULL olmayanı** döndürür:

\`\`\`sql
SELECT ad_soyad, COALESCE(telefon, 'Belirtilmemiş') AS telefon FROM musteriler;
\`\`\`

SQLite'ta aynı işi yapan, sadece iki argüman alan bir kısayol da vardır: \`IFNULL(telefon, 'Belirtilmemiş')\`. İkisi de aynı sonucu verir; \`COALESCE\` standart SQL'in bir parçasıdır ve daha fazla veritabanında çalışır.
`,
  ornekler: [
    { aciklama: "Telefon numarası kayıtlı olmayan müşterileri bul:", sql: "SELECT ad_soyad, telefon FROM musteriler WHERE telefon IS NULL;" },
  ],
  onizlemeTablolari: ["musteriler"],
  alistirmalar: [
    {
      id: "2-2-1",
      seviye: "Kolay",
      baslik: "Telefonu Olmayan Müşteriler",
      soru: "Telefon numarası kayıtlı OLMAYAN müşterilerin adını getiren bir sorgu yaz.",
      ipucu: "WHERE telefon IS NULL kalıbını kullanabilirsin (WHERE telefon = NULL ÇALIŞMAZ).",
      cozumSql: "SELECT ad_soyad FROM musteriler WHERE telefon IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-2",
      seviye: "Kolay",
      baslik: "İptal Nedeni Olmayan Siparişler",
      soru: "İptal nedeni kayıtlı OLMAYAN (yani iptal edilmemiş) siparişlerin id'sini ve durumunu getiren bir sorgu yaz.",
      ipucu: "WHERE iptal_nedeni IS NULL kalıbını kullanabilirsin.",
      cozumSql: "SELECT siparis_id, durum FROM siparisler WHERE iptal_nedeni IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-3",
      seviye: "Orta",
      baslik: "İptal Nedenleri",
      soru: "İptal nedeni KAYITLI OLAN siparişlerin id'sini ve iptal nedenini getiren bir sorgu yaz.",
      ipucu: "WHERE iptal_nedeni IS NOT NULL kalıbını kullanabilirsin.",
      cozumSql: "SELECT siparis_id, iptal_nedeni FROM siparisler WHERE iptal_nedeni IS NOT NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-4",
      seviye: "Orta",
      baslik: "Varsayılan Telefonla Göster",
      soru: "Her müşterinin adını ve telefonunu getir; telefon NULL ise 'Belirtilmemiş' yazsın (COALESCE kullan).",
      ipucu: "COALESCE(telefon, 'Belirtilmemiş') AS telefon kalıbını kullanabilirsin.",
      cozumSql: "SELECT ad_soyad, COALESCE(telefon, 'Belirtilmemiş') AS telefon FROM musteriler;",
      mod: "sonuc",
    },
    {
      id: "2-2-5",
      seviye: "Zor",
      baslik: "IFNULL ile İptal Notu",
      soru: "Her siparişin id'sini ve bir 'durum notu' getir: iptal_nedeni NULL ise 'İptal edilmedi', değilse iptal_nedeni'nin kendisi yazsın — IFNULL kullan.",
      ipucu: "IFNULL(iptal_nedeni, 'İptal edilmedi') AS durum_notu kalıbını kullanabilirsin.",
      cozumSql: "SELECT siparis_id, IFNULL(iptal_nedeni, 'İptal edilmedi') AS durum_notu FROM siparisler;",
      mod: "sonuc",
    },
    {
      id: "2-2-6",
      seviye: "Zor",
      baslik: "İstanbul'da Telefonu Eksik Olanlar",
      soru: "Telefonu OLMAYAN VE şehri 'İstanbul' olan müşterilerin adını getiren bir sorgu yaz (IS NULL ile AND'i birleştir).",
      ipucu: "WHERE telefon IS NULL AND sehir = 'İstanbul' kalıbını kullanabilirsin.",
      cozumSql: "SELECT ad_soyad FROM musteriler WHERE telefon IS NULL AND sehir = 'İstanbul';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "2-2-q1",
      soru: "Bir sütunun NULL olup olmadığını kontrol etmek için hangi ifade kullanılır?",
      secenekler: ["= NULL", "IS NULL", "== NULL", "LIKE NULL"],
      dogruIndex: 1,
      aciklama: "NULL kontrolü için özel bir operatör olan IS NULL / IS NOT NULL kullanılır; = NULL çalışmaz.",
    },
    {
      id: "2-2-q2",
      soru: "WHERE telefon = NULL; neden hiçbir zaman satır getirmez?",
      secenekler: [
        "Bu bir söz dizimi (syntax) hatasıdır",
        "NULL 'bilinmeyen' bir değerdir; hiçbir değer (NULL dahil) = ile ona eşit sayılmaz",
        "telefon sütunu hiç NULL içermez",
        "SQLite = operatörünü desteklemez",
      ],
      dogruIndex: 1,
      aciklama: "NULL bir değer değil, 'bilinmeyen' durumunu temsil eder; bu yüzden eşitlik karşılaştırmaları NULL ile hep bilinmeyen (etkin olarak yanlış) sonuç verir.",
    },
    {
      id: "2-2-q3",
      soru: "5 + NULL işleminin sonucu nedir?",
      secenekler: ["5", "0", "NULL", "Hata"],
      dogruIndex: 2,
      aciklama: "NULL içeren aritmetik işlemler her zaman NULL sonucu verir — NULL, sıfır gibi davranmaz.",
    },
    {
      id: "2-2-q4",
      soru: "COALESCE(telefon, 'Belirtilmemiş') ifadesi ne yapar?",
      secenekler: [
        "telefon her zaman 'Belirtilmemiş' olarak değiştirir",
        "telefon NULL ise 'Belirtilmemiş', değilse telefon'un kendisini döndürür",
        "telefon sütununu siler",
        "Sadece telefon NULL DEĞİLSE çalışır",
      ],
      dogruIndex: 1,
      aciklama: "COALESCE, verilen değerlerden ilk NULL olmayanı döndürür — burada telefon doluysa onu, boşsa varsayılan metni gösterir.",
    },
  ],
});
