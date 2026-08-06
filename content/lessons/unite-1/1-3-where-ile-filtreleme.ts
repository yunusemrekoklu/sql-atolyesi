import { defineLesson } from "@/types/content";
import { filmlerDb } from "@/content/databases/filmler";

export const whereIleFiltreleme = defineLesson({
  slug: "where-ile-filtreleme",
  uniteId: 1,
  dersNo: "1.3",
  baslik: "WHERE ile Filtreleme",
  veritabaniId: filmlerDb.id,
  anlatim: `
Şimdiye kadar sorgularımız hep **tüm satırları** getirdi. Gerçek hayatta genellikle veriyi bir koşula göre filtrelemek isteriz — işte bunun için \`WHERE\` cümlesi var.

## Temel WHERE kullanımı

\`WHERE\`, \`FROM\`'dan sonra yazılır ve sadece koşulu **sağlayan** satırları sonuca dahil eder:

\`\`\`sql
SELECT title, release_year FROM movies WHERE release_year >= 2000;
\`\`\`

## Karşılaştırma operatörleri

| Operatör | Anlamı |
|---|---|
| \`=\` | eşit |
| \`!=\` veya \`<>\` | eşit değil |
| \`>\`, \`<\` | büyük, küçük |
| \`>=\`, \`<=\` | büyük eşit, küçük eşit |

Metin değerleri tek tırnak içinde yazılır: \`WHERE genre = 'Komedi'\`.

## AND, OR, NOT ile birden fazla koşul

Birden fazla koşulu birleştirmek için \`AND\` (her ikisi de doğru olmalı), \`OR\` (en az biri doğru olmalı) ve \`NOT\` (koşulun tersini al) kullanılır:

\`\`\`sql
SELECT title FROM movies WHERE genre = 'Dram' AND rating > 8;
\`\`\`

## Parantezleme neden önemli?

\`AND\` ve \`OR\` bir arada kullanıldığında, işlem önceliği kafa karıştırabilir (\`AND\`, \`OR\`'dan önce değerlendirilir). Niyetini netleştirmek ve hatalardan kaçınmak için parantez kullan:

\`\`\`sql
SELECT title FROM movies WHERE (genre = 'Dram' OR genre = 'Komedi') AND release_year >= 2000;
\`\`\`

Parantez olmadan bu sorgu farklı bir sonuç verebilirdi — her zaman niyetini açıkça yaz.
`,
  ornekler: [
    { aciklama: "2000 yılı ve sonrasında çekilen filmleri listele:", sql: "SELECT title, release_year FROM movies WHERE release_year >= 2000;" },
  ],
  onizlemeTablolari: ["movies"],
  alistirmalar: [
    {
      id: "1-3-1",
      seviye: "Kolay",
      baslik: "2000 Sonrası Filmler",
      soru: "Çıkış yılı (release_year) 2000 veya sonrası olan filmlerin title'ını getiren bir sorgu yaz.",
      ipucu: "WHERE release_year >= 2000 kalıbını kullanabilirsin.",
      cozumSql: "SELECT title FROM movies WHERE release_year >= 2000;",
      mod: "sonuc",
    },
    {
      id: "1-3-2",
      seviye: "Kolay",
      baslik: "Komedi Filmleri",
      soru: "genre'ı 'Komedi' olan filmlerin title ve release_year'ını getiren bir sorgu yaz.",
      ipucu: "Metin karşılaştırmalarında değeri tek tırnak içine al: WHERE genre = 'Komedi'",
      cozumSql: "SELECT title, release_year FROM movies WHERE genre = 'Komedi';",
      mod: "sonuc",
    },
    {
      id: "1-3-3",
      seviye: "Orta",
      baslik: "Yüksek Puanlı Filmler",
      soru: "rating'i 8'den yüksek olan filmlerin title ve rating'ini getiren bir sorgu yaz.",
      ipucu: "WHERE rating > 8 kalıbını kullanabilirsin (8 dahil değil).",
      cozumSql: "SELECT title, rating FROM movies WHERE rating > 8;",
      mod: "sonuc",
    },
    {
      id: "1-3-4",
      seviye: "Orta",
      baslik: "Uzun Dram Filmleri",
      soru: "genre'ı 'Dram' OLAN ve duration_min'i 110 dakikadan uzun olan filmlerin title'ını getiren bir sorgu yaz.",
      ipucu: "İki koşulun ikisinin de doğru olması gerekiyorsa AND kullanılır.",
      cozumSql: "SELECT title FROM movies WHERE genre = 'Dram' AND duration_min > 110;",
      mod: "sonuc",
    },
    {
      id: "1-3-5",
      seviye: "Orta",
      baslik: "Komedi veya Aksiyon",
      soru: "genre'ı 'Komedi' YA DA 'Aksiyon' olan filmlerin title ve genre'ını getiren bir sorgu yaz.",
      ipucu: "İki koşuldan en az birinin doğru olması yeterliyse OR kullanılır.",
      cozumSql: "SELECT title, genre FROM movies WHERE genre = 'Komedi' OR genre = 'Aksiyon';",
      mod: "sonuc",
    },
    {
      id: "1-3-6",
      seviye: "Zor",
      baslik: "Yeşilçam Dışı Yüksek Puanlılar",
      soru:
        "1990 ve sonrasında çekilen (release_year >= 1990), rating'i 7.8 ve üzeri olan, TÜRÜ DRAM OLMAYAN filmlerin title, release_year ve rating'ini getiren bir sorgu yaz.",
      ipucu: "Üç koşulu birleştirmen gerekiyor: release_year >= 1990 AND rating >= 7.8 AND NOT genre = 'Dram'. Karışıklığı önlemek için ilk iki koşulu parantez içine alabilirsin.",
      cozumSql: "SELECT title, release_year, rating FROM movies WHERE (release_year >= 1990 AND rating >= 7.8) AND NOT genre = 'Dram';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "1-3-q1",
      soru: "WHERE rating > 8; ifadesi hangi filmleri getirir?",
      secenekler: [
        "Puanı tam olarak 8 olanlar",
        "Puanı 8'den yüksek olanlar (8 dahil değil)",
        "Puanı 8 veya daha düşük olanlar",
        "Tüm filmleri",
      ],
      dogruIndex: 1,
      aciklama: "> operatörü 'büyüktür' anlamına gelir ve karşılaştırılan değeri (8) dahil etmez.",
    },
    {
      id: "1-3-q2",
      soru: "AND ve OR birlikte kullanılırken parantez kullanmak neden önemlidir?",
      secenekler: [
        "SQL parantezsiz çalışmaz",
        "İşlem önceliğini netleştirip yanlışlıkla farklı bir sonuç almanı önler",
        "Sorguyu daha hızlı çalıştırır",
        "Sadece görsel bir tercihtir, sonucu etkilemez",
      ],
      dogruIndex: 1,
      aciklama: "AND, OR'dan önce değerlendirilir; parantez, niyetini net bir şekilde ifade etmeni ve mantık hatalarından kaçınmanı sağlar.",
    },
    {
      id: "1-3-q3",
      soru: "WHERE genre != 'Dram'; ifadesi ne anlama gelir?",
      secenekler: [
        "genre sütunu boş olan satırlar",
        "genre'ı Dram OLMAYAN satırlar",
        "genre'ı Dram OLAN satırlar",
        "Bir söz dizimi (syntax) hatası",
      ],
      dogruIndex: 1,
      aciklama: "!= (veya <>) 'eşit değil' anlamına gelir; genre'ı Dram olmayan tüm satırları getirir.",
    },
    {
      id: "1-3-q4",
      soru: "WHERE NOT (genre = 'Komedi'); ile WHERE genre != 'Komedi'; bu durumda aynı sonucu verir mi?",
      secenekler: [
        "Evet, ikisi de genre'ı Komedi olmayan satırları getirir",
        "Hayır, NOT sadece sayısal sütunlarla çalışır",
        "Hayır, NOT bir söz dizimi hatasıdır",
        "Sadece DISTINCT ile birlikte kullanılırsa aynı olur",
      ],
      dogruIndex: 0,
      aciklama: "NOT (koşul), koşulun tersini alır; bir eşitlik koşulunun tersi pratikte != ile aynı sonucu üretir.",
    },
  ],
});
