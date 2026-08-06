import { defineLesson } from "@/types/content";
import { sehirlerDb } from "@/content/databases/sehirler";

export const tekrarTurkiyeTuru = defineLesson({
  slug: "tekrar-turkiye-turu",
  uniteId: 1,
  dersNo: "1.T",
  baslik: "Tekrar: Türkiye Turu",
  veritabaniId: sehirlerDb.id,
  anlatim: `
Ünite 1'i tamamladın! Bu tekrar dersinde öğrendiğin her şeyi — \`SELECT\`, \`WHERE\`, \`LIKE\`, \`IN\`, \`BETWEEN\`, \`ORDER BY\`, \`LIMIT\` — yeni bir veritabanı olan \`cities\` üzerinde uygulayacaksın: Türkiye'nin 81 ili, bölgesi, yaklaşık nüfusu, plaka kodu, rakımı ve büyükşehir olup olmadığı.

## Yeni bir küçük detay: 0/1 ile evet/hayır

\`cities\` tablosundaki \`is_metropolitan\` sütunu bir ilin büyükşehir statüsünde olup olmadığını tutar. SQLite'ta gerçek bir \`BOOLEAN\` (evet/hayır) tipi **yoktur** — bunun yerine \`INTEGER\` kullanılır: \`1\` = evet, \`0\` = hayır.

\`\`\`sql
SELECT province FROM cities WHERE is_metropolitan = 1;
\`\`\`

Aşağıdaki alıştırmalarda bu dersten önceki tüm konuları karma olarak, gerçek şehir verisi üzerinde pekiştireceksin. Kolaydan zora doğru ilerleyen bir set — iyi eğlenceler!
`,
  ornekler: [
    { aciklama: "Nüfusu en yüksek 5 ili listele:", sql: "SELECT province, population FROM cities ORDER BY population DESC LIMIT 5;" },
  ],
  onizlemeTablolari: ["cities"],
  alistirmalar: [
    {
      id: "1-t-1",
      seviye: "Kolay",
      baslik: "Marmara Bölgesi",
      soru: "region'ı 'Marmara' olan illerin province'ını getiren bir sorgu yaz.",
      ipucu: "WHERE region = 'Marmara' kalıbını kullanabilirsin.",
      cozumSql: "SELECT province FROM cities WHERE region = 'Marmara';",
      mod: "sonuc",
    },
    {
      id: "1-t-2",
      seviye: "Kolay",
      baslik: "Büyükşehirler",
      soru: "Büyükşehir statüsünde olan (is_metropolitan = 1) illerin province'ını getiren bir sorgu yaz.",
      ipucu: "SQLite'ta evet/hayır için 1/0 kullanılır: WHERE is_metropolitan = 1",
      cozumSql: "SELECT province FROM cities WHERE is_metropolitan = 1;",
      mod: "sonuc",
    },
    {
      id: "1-t-3",
      seviye: "Orta",
      baslik: "Nüfusa Göre Sıralı",
      soru: "Tüm illerin province ve population'ını, population'a göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY population DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT province, population FROM cities ORDER BY population DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-t-4",
      seviye: "Orta",
      baslik: "\"Ka\" ile Başlayan İller",
      soru: "Adı \"Ka\" ile başlayan illerin province'ını getiren bir sorgu yaz.",
      ipucu: "WHERE province LIKE 'Ka%' kalıbını kullanabilirsin.",
      cozumSql: "SELECT province FROM cities WHERE province LIKE 'Ka%';",
      mod: "sonuc",
    },
    {
      id: "1-t-5",
      seviye: "Orta",
      baslik: "Yüksek Rakımlı İller",
      soru: "elevation'ı 1500 ile 2000 metre arasında (her iki uç dahil) olan illerin province ve elevation'ını getiren bir sorgu yaz.",
      ipucu: "WHERE elevation BETWEEN 1500 AND 2000 kalıbını kullanabilirsin.",
      cozumSql: "SELECT province, elevation FROM cities WHERE elevation BETWEEN 1500 AND 2000;",
      mod: "sonuc",
    },
    {
      id: "1-t-6",
      seviye: "Zor",
      baslik: "En Yüksek Rakımlı 5 Küçük İl",
      soru:
        "Büyükşehir OLMAYAN (is_metropolitan = 0) iller arasından, elevation'ı en yüksek 5 tanesinin province ve elevation'ını, yüksekten alçağa sıralı getiren bir sorgu yaz.",
      ipucu: "Önce WHERE is_metropolitan = 0 ile filtrele, sonra ORDER BY elevation DESC LIMIT 5 ekle.",
      cozumSql: "SELECT province, elevation FROM cities WHERE is_metropolitan = 0 ORDER BY elevation DESC LIMIT 5;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-t-7",
      seviye: "Zor",
      baslik: "Kalabalık Karadeniz İlleri",
      soru:
        "region'ı 'Karadeniz' OLAN ve population'ı 500.000'in üzerinde olan illerin province ve population'ını, population'a göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "WHERE region = 'Karadeniz' AND population > 500000 ORDER BY population DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT province, population FROM cities WHERE region = 'Karadeniz' AND population > 500000 ORDER BY population DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "1-t-q1",
      soru: "Sadece belirli sütunları getirmek için SELECT'ten sonra ne yazılır?",
      secenekler: [
        "Sadece * karakteri",
        "İstenen sütun adları, virgülle ayrılmış",
        "Tablo adı",
        "WHERE koşulu",
      ],
      dogruIndex: 1,
      aciklama: "SELECT'ten sonra istediğin sütun adlarını virgülle ayırarak yazarsın; * ile tümünü getirebilirsin.",
    },
    {
      id: "1-t-q2",
      soru: "WHERE region = 'Ege' AND population > 1000000; ifadesi hangi satırları getirir?",
      secenekler: [
        "region'ı Ege OLAN veya population'ı 1 milyondan fazla OLAN satırları",
        "region'ı Ege OLAN ve population'ı 1 milyondan fazla OLAN satırları (ikisi birden)",
        "Sadece region'ı Ege olmayanları",
        "Sadece population'ı 1 milyondan az olanları",
      ],
      dogruIndex: 1,
      aciklama: "AND, her iki koşulun da doğru olmasını gerektirir.",
    },
    {
      id: "1-t-q3",
      soru: "province LIKE '%kale%' ifadesi cities verisinde hangi ili eşleştirir?",
      secenekler: ["Kayseri", "Çanakkale", "Karabük", "Kastamonu"],
      dogruIndex: 1,
      aciklama: "'%kale%' deseni, adının herhangi bir yerinde 'kale' geçen metinleri eşleştirir — Çanakkale bu koşulu sağlar.",
    },
    {
      id: "1-t-q4",
      soru: "ORDER BY population DESC LIMIT 1; sorgusu ne getirir?",
      secenekler: [
        "Nüfusu en düşük ili",
        "Nüfusu en yüksek tek ili",
        "Tüm illeri nüfusa göre sıralı",
        "Rastgele bir il",
      ],
      dogruIndex: 1,
      aciklama: "DESC ile azalan sıralama yapılır, LIMIT 1 ile de sadece ilk (en yüksek nüfuslu) satır getirilir.",
    },
    {
      id: "1-t-q5",
      soru: "SQLite'ta true/false (evet/hayır) yerine genellikle ne kullanılır?",
      secenekler: [
        "BOOLEAN tipi",
        "TEXT tipi ('evet'/'hayır' metni)",
        "INTEGER tipi (0 ve 1)",
        "SQLite bu tür veriyi desteklemez",
      ],
      dogruIndex: 2,
      aciklama: "SQLite'ta ayrı bir BOOLEAN tipi yoktur; evet/hayır durumları genellikle INTEGER (0/1) ile temsil edilir — is_metropolitan sütunu gibi.",
    },
  ],
});
