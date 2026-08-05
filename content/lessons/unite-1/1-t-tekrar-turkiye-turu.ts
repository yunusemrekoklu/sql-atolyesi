import { defineLesson } from "@/types/content";
import { sehirlerDb } from "@/content/databases/sehirler";

export const tekrarTurkiyeTuru = defineLesson({
  slug: "tekrar-turkiye-turu",
  uniteId: 1,
  dersNo: "1.T",
  baslik: "Tekrar: Türkiye Turu",
  veritabaniId: sehirlerDb.id,
  anlatim: `
Ünite 1'i tamamladın! Bu tekrar dersinde öğrendiğin her şeyi — \`SELECT\`, \`WHERE\`, \`LIKE\`, \`IN\`, \`BETWEEN\`, \`ORDER BY\`, \`LIMIT\` — yeni bir veritabanı olan \`sehirler\` üzerinde uygulayacaksın: Türkiye'nin 81 ili, bölgesi, yaklaşık nüfusu, plaka kodu, rakımı ve büyükşehir olup olmadığı.

## Yeni bir küçük detay: 0/1 ile evet/hayır

\`sehirler\` tablosundaki \`buyuksehir_mi\` sütunu bir il büyükşehir statüsünde mi diye tutar. SQLite'ta gerçek bir \`BOOLEAN\` (evet/hayır) tipi **yoktur** — bunun yerine \`INTEGER\` kullanılır: \`1\` = evet, \`0\` = hayır.

\`\`\`sql
SELECT il FROM sehirler WHERE buyuksehir_mi = 1;
\`\`\`

Aşağıdaki alıştırmalarda bu dersten önceki tüm konuları karma olarak, gerçek şehir verisi üzerinde pekiştireceksin. Kolaydan zora doğru ilerleyen bir set — iyi eğlenceler!
`,
  ornekler: [
    { aciklama: "Nüfusu en yüksek 5 ili listele:", sql: "SELECT il, nufus FROM sehirler ORDER BY nufus DESC LIMIT 5;" },
  ],
  onizlemeTablolari: ["sehirler"],
  alistirmalar: [
    {
      id: "1-t-1",
      seviye: "Kolay",
      baslik: "Marmara Bölgesi",
      soru: "Bölgesi 'Marmara' olan illerin adını getiren bir sorgu yaz.",
      ipucu: "WHERE bolge = 'Marmara' kalıbını kullanabilirsin.",
      cozumSql: "SELECT il FROM sehirler WHERE bolge = 'Marmara';",
      mod: "sonuc",
    },
    {
      id: "1-t-2",
      seviye: "Kolay",
      baslik: "Büyükşehirler",
      soru: "Büyükşehir statüsünde olan (buyuksehir_mi = 1) illerin adını getiren bir sorgu yaz.",
      ipucu: "SQLite'ta evet/hayır için 1/0 kullanılır: WHERE buyuksehir_mi = 1",
      cozumSql: "SELECT il FROM sehirler WHERE buyuksehir_mi = 1;",
      mod: "sonuc",
    },
    {
      id: "1-t-3",
      seviye: "Orta",
      baslik: "Nüfusa Göre Sıralı",
      soru: "Tüm illerin adını ve nüfusunu, nüfusa göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY nufus DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT il, nufus FROM sehirler ORDER BY nufus DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-t-4",
      seviye: "Orta",
      baslik: "\"Ka\" ile Başlayan İller",
      soru: "Adı \"Ka\" ile başlayan illerin adını getiren bir sorgu yaz.",
      ipucu: "WHERE il LIKE 'Ka%' kalıbını kullanabilirsin.",
      cozumSql: "SELECT il FROM sehirler WHERE il LIKE 'Ka%';",
      mod: "sonuc",
    },
    {
      id: "1-t-5",
      seviye: "Orta",
      baslik: "Yüksek Rakımlı İller",
      soru: "Rakımı (rakim) 1500 ile 2000 metre arasında (her iki uç dahil) olan illerin adını ve rakımını getiren bir sorgu yaz.",
      ipucu: "WHERE rakim BETWEEN 1500 AND 2000 kalıbını kullanabilirsin.",
      cozumSql: "SELECT il, rakim FROM sehirler WHERE rakim BETWEEN 1500 AND 2000;",
      mod: "sonuc",
    },
    {
      id: "1-t-6",
      seviye: "Zor",
      baslik: "En Yüksek Rakımlı 5 Küçük İl",
      soru:
        "Büyükşehir OLMAYAN (buyuksehir_mi = 0) iller arasından, rakımı en yüksek 5 tanesinin adını ve rakımını, yüksekten alçağa sıralı getiren bir sorgu yaz.",
      ipucu: "Önce WHERE buyuksehir_mi = 0 ile filtrele, sonra ORDER BY rakim DESC LIMIT 5 ekle.",
      cozumSql: "SELECT il, rakim FROM sehirler WHERE buyuksehir_mi = 0 ORDER BY rakim DESC LIMIT 5;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-t-7",
      seviye: "Zor",
      baslik: "Kalabalık Karadeniz İlleri",
      soru:
        "Bölgesi 'Karadeniz' OLAN ve nüfusu 500.000'in üzerinde olan illerin adını ve nüfusunu, nüfusa göre çoktan aza sıralı getiren bir sorgu yaz.",
      ipucu: "WHERE bolge = 'Karadeniz' AND nufus > 500000 ORDER BY nufus DESC kalıbını kullanabilirsin.",
      cozumSql: "SELECT il, nufus FROM sehirler WHERE bolge = 'Karadeniz' AND nufus > 500000 ORDER BY nufus DESC;",
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
      soru: "WHERE bolge = 'Ege' AND nufus > 1000000; ifadesi hangi satırları getirir?",
      secenekler: [
        "Bölgesi Ege OLAN veya nüfusu 1 milyondan fazla OLAN satırları",
        "Bölgesi Ege OLAN ve nüfusu 1 milyondan fazla OLAN satırları (ikisi birden)",
        "Sadece bölgesi Ege olmayanları",
        "Sadece nüfusu 1 milyondan az olanları",
      ],
      dogruIndex: 1,
      aciklama: "AND, her iki koşulun da doğru olmasını gerektirir.",
    },
    {
      id: "1-t-q3",
      soru: "il LIKE '%kale%' ifadesi sehirler verisinde hangi ili eşleştirir?",
      secenekler: ["Kayseri", "Çanakkale", "Karabük", "Kastamonu"],
      dogruIndex: 1,
      aciklama: "'%kale%' deseni, adının herhangi bir yerinde 'kale' geçen metinleri eşleştirir — Çanakkale bu koşulu sağlar.",
    },
    {
      id: "1-t-q4",
      soru: "ORDER BY nufus DESC LIMIT 1; sorgusu ne getirir?",
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
      aciklama: "SQLite'ta ayrı bir BOOLEAN tipi yoktur; evet/hayır durumları genellikle INTEGER (0/1) ile temsil edilir — buyuksehir_mi sütunu gibi.",
    },
  ],
});
