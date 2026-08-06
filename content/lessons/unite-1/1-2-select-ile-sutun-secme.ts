import { defineLesson } from "@/types/content";
import { filmlerDb } from "@/content/databases/filmler";

export const selectIleSutunSecme = defineLesson({
  slug: "select-ile-sutun-secme",
  uniteId: 1,
  dersNo: "1.2",
  baslik: "SELECT ile Sütun Seçme",
  veritabaniId: filmlerDb.id,
  anlatim: `
Önceki derste \`SELECT *\` ile tüm sütunları getirmeyi öğrendin. Bu derste sütunları daha kontrollü şekilde seçmeyi ve sonuçları düzenlemeyi öğreneceksin.

## Birden fazla sütun seçmek

İstediğin sütunları virgülle ayırarak, istediğin sırada yazabilirsin:

\`\`\`sql
SELECT director, title, release_year FROM movies;
\`\`\`

Sütunların sonuçta görüneceği sıra, senin \`SELECT\` listesinde yazdığın sıradır — tablodaki gerçek sütun sırasıyla aynı olmak zorunda değil.

## AS ile takma ad (alias)

Sonuç tablosundaki bir sütunun adını değiştirmek için \`AS\` kullanılır:

\`\`\`sql
SELECT title AS movie_title FROM movies;
\`\`\`

Bu, veritabanındaki gerçek sütun adını **değiştirmez** — sadece o sorgunun sonucunda görünen ismi değiştirir.

## DISTINCT ile tekrarları kaldırma

Bir sütunda aynı değer birden fazla satırda tekrar edebilir (ör. birçok film aynı türde olabilir). \`DISTINCT\` anahtar kelimesi, sonuçtaki **tekrar eden satırları** kaldırır:

\`\`\`sql
SELECT DISTINCT genre FROM movies;
\`\`\`

Bu sorgu, \`movies\` tablosundaki her türü **sadece bir kez** listeler. \`DISTINCT\` birden fazla sütunla da kullanılabilir — bu durumda o sütunların **birlikte** oluşturduğu tekrar eden kombinasyonlar kaldırılır.
`,
  ornekler: [
    { aciklama: "Veritabanındaki tüm farklı (tekrarsız) film türlerini listele:", sql: "SELECT DISTINCT genre FROM movies;" },
  ],
  onizlemeTablolari: ["movies"],
  alistirmalar: [
    {
      id: "1-2-1",
      seviye: "Kolay",
      baslik: "Ad ve Tür",
      soru: "Her filmin title ve genre'ını birlikte getiren bir sorgu yaz.",
      ipucu: "SELECT title, genre FROM movies; kalıbını kullanabilirsin.",
      cozumSql: "SELECT title, genre FROM movies;",
      mod: "sonuc",
    },
    {
      id: "1-2-2",
      seviye: "Kolay",
      baslik: "Takma Adlarla Getir",
      soru: "title sütununu movie_title, release_year sütununu movie_year takma adlarıyla getiren bir sorgu yaz.",
      ipucu: "Her sütundan sonra AS ile istediğin takma adı verebilirsin: sutun AS takma_ad",
      cozumSql: "SELECT title AS movie_title, release_year AS movie_year FROM movies;",
      mod: "sonuc",
      kolonAdiOnemli: true,
    },
    {
      id: "1-2-3",
      seviye: "Orta",
      baslik: "Farklı Türler",
      soru: "movies tablosundaki tekrarsız (farklı) genre listesini getiren bir sorgu yaz.",
      ipucu: "DISTINCT anahtar kelimesini SELECT'ten hemen sonra kullan: SELECT DISTINCT sutun FROM tablo;",
      cozumSql: "SELECT DISTINCT genre FROM movies;",
      mod: "sonuc",
    },
    {
      id: "1-2-4",
      seviye: "Orta",
      baslik: "Farklı Yönetmenler",
      soru: "movies tablosundaki tekrarsız director listesini getiren bir sorgu yaz.",
      ipucu: "SELECT DISTINCT director FROM movies;",
      cozumSql: "SELECT DISTINCT director FROM movies;",
      mod: "sonuc",
    },
    {
      id: "1-2-5",
      seviye: "Zor",
      baslik: "Yönetmen–Tür Kombinasyonları",
      soru:
        "Her yönetmenin çektiği her farklı (director, genre) kombinasyonunu tekrarsız olarak getiren bir sorgu yaz (aynı yönetmen birden fazla türde film çekmiş olabilir).",
      ipucu: "DISTINCT birden fazla sütunla kullanıldığında, o sütunların BİRLİKTE oluşturduğu tekrarları kaldırır: SELECT DISTINCT sutun1, sutun2 FROM tablo;",
      cozumSql: "SELECT DISTINCT director, genre FROM movies;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "1-2-q1",
      soru: "DISTINCT anahtar kelimesi ne işe yarar?",
      secenekler: [
        "Sonuçları alfabetik sıralar",
        "Tekrar eden satırları sonuçtan çıkarır",
        "Belirli bir satır sayısıyla sınırlar",
        "Sütun adını değiştirir",
      ],
      dogruIndex: 1,
      aciklama: "DISTINCT, seçilen sütun(lar)daki tekrar eden değer kombinasyonlarını sonuçtan kaldırır.",
    },
    {
      id: "1-2-q2",
      soru: "SELECT title AS movie_title FROM movies; sorgusunda \"movie_title\" nedir?",
      secenekler: [
        "Tablonun yeni adı",
        "title sütununa bu sorgu için verilen takma ad",
        "Veritabanının adı",
        "Bir hata mesajı",
      ],
      dogruIndex: 1,
      aciklama: "AS, sadece o sorgunun sonucunda görünen sütun adını değiştirir; veritabanındaki gerçek sütun adı aynı kalır.",
    },
    {
      id: "1-2-q3",
      soru: "SELECT DISTINCT genre FROM movies; sorgusu movies tablosundaki kaç farklı tür değeri döndürür?",
      secenekler: ["4", "5", "6", "20"],
      dogruIndex: 1,
      aciklama: "movies tablosunda Dram, Komedi, Bilim Kurgu, Aksiyon ve Savaş olmak üzere 5 farklı tür bulunur.",
    },
    {
      id: "1-2-q4",
      soru: "AS ile bir sütuna takma ad vermek, veritabanındaki gerçek sütun adını değiştirir mi?",
      secenekler: [
        "Evet, kalıcı olarak değiştirir",
        "Hayır, sadece o sorgunun sonucunda görünen ismi değiştirir",
        "Sadece DISTINCT ile birlikte kullanılırsa değiştirir",
        "Sadece sayısal sütunlarda değiştirir",
      ],
      dogruIndex: 1,
      aciklama: "AS bir görüntüleme (alias) özelliğidir — tablo yapısında hiçbir kalıcı değişiklik yapmaz.",
    },
  ],
});
