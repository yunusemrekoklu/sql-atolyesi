import { defineLesson } from "@/types/content";
import { filmlerDb } from "@/content/databases/filmler";

export const metinAramaVeAraliklar = defineLesson({
  slug: "metin-arama-ve-araliklar",
  uniteId: 1,
  dersNo: "1.4",
  baslik: "Metin Arama ve Aralıklar",
  veritabaniId: filmlerDb.id,
  anlatim: `
\`WHERE\` ile öğrendiğin \`=\`, \`>\`, \`<\` gibi kesin karşılaştırmaların yanında, SQL'de "içinde geçiyor mu", "şu değerlerden biri mi" veya "iki değer arasında mı" gibi soruları sormanı sağlayan özel operatörler de var.

## LIKE ile metin arama

\`LIKE\`, bir metin sütununda **desen (pattern) eşleştirme** yapmanı sağlar. İki joker karakter kullanılır:

- \`%\` — sıfır veya daha fazla karakteri temsil eder
- \`_\` — tam olarak bir karakteri temsil eder

\`\`\`sql
SELECT title FROM movies WHERE title LIKE 'K%';
\`\`\`

Bu sorgu, adı **K** harfiyle **başlayan** tüm filmleri getirir. \`%kelime%\` ise kelimenin metnin **herhangi bir yerinde** geçtiği satırları bulur.

## IN ile bir listeyle karşılaştırma

Bir sütunun birden fazla olası değerden birine eşit olup olmadığını kontrol etmek için art arda \`OR\` yazmak yerine \`IN\` kullanabilirsin:

\`\`\`sql
SELECT title FROM movies WHERE genre IN ('Dram', 'Komedi');
\`\`\`

Bu, \`WHERE genre = 'Dram' OR genre = 'Komedi'\` ile aynı sonucu verir ama daha okunaklıdır. Tersi için \`NOT IN\` kullanılır.

## BETWEEN ile aralık kontrolü

İki değer arasında (her iki uç **dahil**) olup olmadığını kontrol etmek için \`BETWEEN ... AND ...\` kullanılır:

\`\`\`sql
SELECT title, release_year FROM movies WHERE release_year BETWEEN 1970 AND 1979;
\`\`\`

Bu operatörleri \`AND\`, \`OR\`, \`NOT\` ile birleştirerek oldukça güçlü filtreler yazabilirsin.
`,
  ornekler: [
    { aciklama: "Adı 'K' harfiyle başlayan filmleri listele:", sql: "SELECT title FROM movies WHERE title LIKE 'K%';" },
  ],
  onizlemeTablolari: ["movies"],
  alistirmalar: [
    {
      id: "1-4-1",
      seviye: "Kolay",
      baslik: "K ile Başlayan Filmler",
      soru: "title'ı 'K' harfiyle başlayan filmlerin title'ını getiren bir sorgu yaz.",
      ipucu: "LIKE 'K%' — % karakteri, sıfır veya daha fazla karakter yerine geçer.",
      cozumSql: "SELECT title FROM movies WHERE title LIKE 'K%';",
      mod: "sonuc",
    },
    {
      id: "1-4-2",
      seviye: "Kolay",
      baslik: "Adında \"Vadi\" Geçenler",
      soru: "title'ında \"Vadi\" kelimesi geçen filmlerin title'ını getiren bir sorgu yaz.",
      ipucu: "Kelimenin metnin herhangi bir yerinde geçmesi için desenin başına ve sonuna % koy: '%Vadi%'",
      cozumSql: "SELECT title FROM movies WHERE title LIKE '%Vadi%';",
      mod: "sonuc",
    },
    {
      id: "1-4-3",
      seviye: "Orta",
      baslik: "Belirli Türler (IN)",
      soru: "genre'ı 'Dram' veya 'Komedi' olan filmlerin title ve genre'ını getiren bir sorgu yaz — IN kullan.",
      ipucu: "WHERE genre IN ('Dram', 'Komedi') kalıbını kullanabilirsin.",
      cozumSql: "SELECT title, genre FROM movies WHERE genre IN ('Dram', 'Komedi');",
      mod: "sonuc",
    },
    {
      id: "1-4-4",
      seviye: "Orta",
      baslik: "1970'ler Filmleri",
      soru: "1970 ile 1979 (her ikisi dahil) arasında çekilen filmlerin title ve release_year'ını getiren bir sorgu yaz — BETWEEN kullan.",
      ipucu: "WHERE release_year BETWEEN 1970 AND 1979 kalıbını kullanabilirsin.",
      cozumSql: "SELECT title, release_year FROM movies WHERE release_year BETWEEN 1970 AND 1979;",
      mod: "sonuc",
    },
    {
      id: "1-4-5",
      seviye: "Orta",
      baslik: "Komedi ve Aksiyon Dışındakiler",
      soru: "genre'ı 'Komedi' VE 'Aksiyon' OLMAYAN filmlerin title ve genre'ını getiren bir sorgu yaz — NOT IN kullan.",
      ipucu: "WHERE genre NOT IN ('Komedi', 'Aksiyon') kalıbını kullanabilirsin.",
      cozumSql: "SELECT title, genre FROM movies WHERE genre NOT IN ('Komedi', 'Aksiyon');",
      mod: "sonuc",
    },
    {
      id: "1-4-6",
      seviye: "Zor",
      baslik: "Karma Filtre",
      soru:
        "2000 ile 2015 arasında (BETWEEN) çekilen, genre'ı 'Dram' veya 'Savaş' olan (IN), title'ı 'K' harfiyle BAŞLAMAYAN filmlerin title, release_year ve genre'ını getiren bir sorgu yaz.",
      ipucu: "Üç koşulu AND ile birleştir: release_year BETWEEN 2000 AND 2015 AND genre IN ('Dram', 'Savaş') AND title NOT LIKE 'K%'",
      cozumSql:
        "SELECT title, release_year, genre FROM movies WHERE release_year BETWEEN 2000 AND 2015 AND genre IN ('Dram', 'Savaş') AND title NOT LIKE 'K%';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "1-4-q1",
      soru: "LIKE 'A%' ifadesi neyi eşleştirir?",
      secenekler: [
        "Sadece tam olarak 'A' olan metinleri",
        "'A' ile başlayan metinleri",
        "'A' ile biten metinleri",
        "İçinde 'A' geçmeyen metinleri",
      ],
      dogruIndex: 1,
      aciklama: "'A%' deseni, 'A' harfiyle başlayan ve ardından sıfır veya daha fazla karakter gelen metinleri eşleştirir.",
    },
    {
      id: "1-4-q2",
      soru: "% ve _ karakterlerinin LIKE içindeki farkı nedir?",
      secenekler: [
        "Aralarında fark yoktur, ikisi de aynı işi yapar",
        "% sıfır veya daha fazla karakteri, _ tam olarak bir karakteri temsil eder",
        "% sadece sayılar için, _ sadece harfler için kullanılır",
        "_ sıfır veya daha fazla karakteri, % tam olarak bir karakteri temsil eder",
      ],
      dogruIndex: 1,
      aciklama: "% joker karakteri değişken uzunlukta, _ ise tam olarak tek bir karakter yerine geçer.",
    },
    {
      id: "1-4-q3",
      soru: "WHERE release_year BETWEEN 2000 AND 2010; ifadesi 2000 ve 2010 yıllarını da kapsar mı?",
      secenekler: [
        "Evet, her iki uç değer de dahildir",
        "Hayır, sadece aradaki yılları kapsar, uçlar hariçtir",
        "Sadece 2000'i kapsar, 2010'u kapsamaz",
        "Sadece 2010'u kapsar, 2000'i kapsamaz",
      ],
      dogruIndex: 0,
      aciklama: "BETWEEN x AND y, hem x hem de y değerlerini sonuca dahil eder (kapsayıcıdır).",
    },
    {
      id: "1-4-q4",
      soru: "WHERE genre IN ('Dram', 'Komedi') ifadesi hangi OR ifadesine eşdeğerdir?",
      secenekler: [
        "genre = 'Dram' AND genre = 'Komedi'",
        "genre = 'Dram' OR genre = 'Komedi'",
        "genre != 'Dram' OR genre != 'Komedi'",
        "genre LIKE 'Dram' AND genre LIKE 'Komedi'",
      ],
      dogruIndex: 1,
      aciklama: "IN, listedeki değerlerden herhangi birine eşit olma durumunu kontrol eder — bir dizi OR karşılaştırmasının kısayoludur.",
    },
  ],
});
