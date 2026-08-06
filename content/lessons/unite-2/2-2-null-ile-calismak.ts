import { defineLesson } from "@/types/content";
import { eticaretDb } from "@/content/databases/eticaret";

export const nullIleCalismak = defineLesson({
  slug: "null-ile-calismak",
  uniteId: 2,
  dersNo: "2.2",
  baslik: "NULL ile Çalışmak",
  veritabaniId: eticaretDb.id,
  anlatim: `
\`customers\` tablosuna bakarsan bazı müşterilerin \`phone\` sütununun boş olduğunu görürsün. Bu boşluk, boş bir metin (\`''\`) değil — **\`NULL\`**'dır: "bu değer bilinmiyor / kayıtlı değil" anlamına gelir. NULL, SQL'de sık karıştırılan ama çok önemli bir kavramdır.

## NULL'ı kontrol etmek: IS NULL / IS NOT NULL

NULL, hiçbir değere (NULL dahil) \`=\` ile eşit sayılmaz — çünkü "bilinmeyen bir şeyin bilinmeyen bir şeye eşit olup olmadığı" da bilinmez. Bu yüzden \`WHERE phone = NULL\` **hiçbir zaman** satır getirmez (mantıksal bir hata değil ama beklenmedik bir sonuçtur). Bunun yerine özel bir operatör kullanılır:

\`\`\`sql
SELECT full_name FROM customers WHERE phone IS NULL;
SELECT full_name FROM customers WHERE phone IS NOT NULL;
\`\`\`

## NULL ile aritmetik

NULL içeren herhangi bir aritmetik işlem de NULL sonucu verir: \`5 + NULL\` sonucu \`NULL\`'dır, \`NULL\`'ı sıfır gibi düşünmemelisin. Bu, ileride toplulaştırma fonksiyonlarında (\`SUM\`, \`AVG\`) dikkat etmen gereken bir tuzaktır.

## COALESCE ve IFNULL ile varsayılan değer

Bir sütun NULL olduğunda ekranda boş görünmesin, anlamlı bir varsayılan değer gösterilsin istersen \`COALESCE\` kullanılır — verilen değerlerden **ilk NULL olmayanı** döndürür:

\`\`\`sql
SELECT full_name, COALESCE(phone, 'Belirtilmemiş') AS phone FROM customers;
\`\`\`

SQLite'ta aynı işi yapan, sadece iki argüman alan bir kısayol da vardır: \`IFNULL(phone, 'Belirtilmemiş')\`. İkisi de aynı sonucu verir; \`COALESCE\` standart SQL'in bir parçasıdır ve daha fazla veritabanında çalışır.
`,
  ornekler: [
    { aciklama: "Telefon numarası kayıtlı olmayan müşterileri bul:", sql: "SELECT full_name, phone FROM customers WHERE phone IS NULL;" },
  ],
  onizlemeTablolari: ["customers"],
  alistirmalar: [
    {
      id: "2-2-1",
      seviye: "Kolay",
      baslik: "Telefonu Olmayan Müşteriler",
      soru: "Telefon numarası kayıtlı OLMAYAN müşterilerin full_name'ini getiren bir sorgu yaz.",
      ipucu: "WHERE phone IS NULL kalıbını kullanabilirsin (WHERE phone = NULL ÇALIŞMAZ).",
      cozumSql: "SELECT full_name FROM customers WHERE phone IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-2",
      seviye: "Kolay",
      baslik: "İptal Nedeni Olmayan Siparişler",
      soru: "İptal nedeni kayıtlı OLMAYAN (yani iptal edilmemiş) siparişlerin order_id ve status'unu getiren bir sorgu yaz.",
      ipucu: "WHERE cancellation_reason IS NULL kalıbını kullanabilirsin.",
      cozumSql: "SELECT order_id, status FROM orders WHERE cancellation_reason IS NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-3",
      seviye: "Orta",
      baslik: "İptal Nedenleri",
      soru: "İptal nedeni KAYITLI OLAN siparişlerin order_id ve cancellation_reason'ını getiren bir sorgu yaz.",
      ipucu: "WHERE cancellation_reason IS NOT NULL kalıbını kullanabilirsin.",
      cozumSql: "SELECT order_id, cancellation_reason FROM orders WHERE cancellation_reason IS NOT NULL;",
      mod: "sonuc",
    },
    {
      id: "2-2-4",
      seviye: "Orta",
      baslik: "Varsayılan Telefonla Göster",
      soru: "Her müşterinin full_name ve phone'unu getir; phone NULL ise 'Belirtilmemiş' yazsın (COALESCE kullan).",
      ipucu: "COALESCE(phone, 'Belirtilmemiş') AS phone kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name, COALESCE(phone, 'Belirtilmemiş') AS phone FROM customers;",
      mod: "sonuc",
    },
    {
      id: "2-2-5",
      seviye: "Zor",
      baslik: "IFNULL ile İptal Notu",
      soru: "Her siparişin order_id'sini ve bir 'durum notu' getir: cancellation_reason NULL ise 'İptal edilmedi', değilse cancellation_reason'ın kendisi yazsın — IFNULL kullan.",
      ipucu: "IFNULL(cancellation_reason, 'İptal edilmedi') AS status_note kalıbını kullanabilirsin.",
      cozumSql: "SELECT order_id, IFNULL(cancellation_reason, 'İptal edilmedi') AS status_note FROM orders;",
      mod: "sonuc",
    },
    {
      id: "2-2-6",
      seviye: "Zor",
      baslik: "İstanbul'da Telefonu Eksik Olanlar",
      soru: "Telefonu OLMAYAN VE şehri 'İstanbul' olan müşterilerin full_name'ini getiren bir sorgu yaz (IS NULL ile AND'i birleştir).",
      ipucu: "WHERE phone IS NULL AND city = 'İstanbul' kalıbını kullanabilirsin.",
      cozumSql: "SELECT full_name FROM customers WHERE phone IS NULL AND city = 'İstanbul';",
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
      soru: "WHERE phone = NULL; neden hiçbir zaman satır getirmez?",
      secenekler: [
        "Bu bir söz dizimi (syntax) hatasıdır",
        "NULL 'bilinmeyen' bir değerdir; hiçbir değer (NULL dahil) = ile ona eşit sayılmaz",
        "phone sütunu hiç NULL içermez",
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
      soru: "COALESCE(phone, 'Belirtilmemiş') ifadesi ne yapar?",
      secenekler: [
        "phone her zaman 'Belirtilmemiş' olarak değiştirir",
        "phone NULL ise 'Belirtilmemiş', değilse phone'un kendisini döndürür",
        "phone sütununu siler",
        "Sadece phone NULL DEĞİLSE çalışır",
      ],
      dogruIndex: 1,
      aciklama: "COALESCE, verilen değerlerden ilk NULL olmayanı döndürür — burada phone doluysa onu, boşsa varsayılan metni gösterir.",
    },
  ],
});
