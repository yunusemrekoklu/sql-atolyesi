import { defineLesson } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const kumeIslemleri = defineLesson({
  slug: "kume-islemleri",
  uniteId: 3,
  dersNo: "3.6",
  baslik: "Küme İşlemleri",
  veritabaniId: superligDb.id,
  anlatim: `
JOIN, tabloları **yan yana** (sütun ekleyerek) birleştirir. Küme işlemleri ise iki sorgunun sonuçlarını **alt alta** (satır ekleyerek) birleştirir. Bunun için iki sorgunun **aynı sayıda sütunu** ve **uyumlu tipleri** olmalı.

## UNION ve UNION ALL

\`\`\`sql
SELECT home_team_id AS team_id FROM matches
UNION
SELECT away_team_id AS team_id FROM matches;
\`\`\`

- **UNION**: iki sorgunun sonuçlarını birleştirir ve **tekrar eden satırları eler** (otomatik \`DISTINCT\`). Bu sorgu, en az bir maça (ev sahibi ya da deplasman olarak) katılmış tüm takımların \`team_id\`'lerini, tekrarsız olarak getirir.
- **UNION ALL**: aynısını yapar ama tekrarları **elemez** — daha hızlıdır (tekrar kontrolü yapmaz) ve bir takım hem ev sahibi hem deplasman olarak birden çok kez göründüyse, \`UNION ALL\` sonucunda da birden çok kez görünür.

## INTERSECT ve EXCEPT

\`\`\`sql
SELECT team_id FROM players WHERE position = 'Forvet'
INTERSECT
SELECT team_id FROM players WHERE position = 'Orta Saha';
\`\`\`

- **INTERSECT**: sadece **her iki sorguda da** ortak olan satırları getirir. Yukarıdaki örnek, hem forvet hem orta saha oyuncusu olan takımların \`team_id\`'lerini bulur.
- **EXCEPT**: birinci sorgunun sonucundan, **ikinci sorguda da olan** satırları çıkarır (fark kümesi):

\`\`\`sql
SELECT player_id FROM players
EXCEPT
SELECT player_id FROM goals;
\`\`\`

Bu sorgu, \`players\`'taki tüm oyuncu id'lerinden, \`goals\`'ta en az bir kez geçenleri çıkarır — yani **hiç gol atmamış** oyuncuları bulur. Dikkat edersen bu, bir önceki derste \`LEFT JOIN ... WHERE ... IS NULL\` ile yaptığımız anti-join ile **aynı sonucu** verir; sadece farklı bir teknik.
`,
  ornekler: [
    { aciklama: "En az bir maça katılmış takımların id'lerini (tekrarsız) getir:", sql: "SELECT home_team_id AS team_id FROM matches UNION SELECT away_team_id AS team_id FROM matches;" },
  ],
  onizlemeTablolari: ["matches", "players"],
  alistirmalar: [
    {
      id: "3-6-1",
      seviye: "Kolay",
      baslik: "Maça Katılan Takımlar",
      soru: "En az bir maça (ev sahibi ya da deplasman olarak) katılmış takımların team_id'lerini, tekrarsız olarak getiren bir sorgu yaz (UNION kullan).",
      ipucu: "SELECT home_team_id AS team_id FROM matches UNION SELECT away_team_id AS team_id FROM matches; kalıbını kullanabilirsin.",
      cozumSql: "SELECT home_team_id AS team_id FROM matches UNION SELECT away_team_id AS team_id FROM matches;",
      mod: "sonuc",
    },
    {
      id: "3-6-2",
      seviye: "Kolay",
      baslik: "UNION ALL ile Katılım Sayısı",
      soru: "Aynı sorguyu UNION ALL ile yaz — bu sefer her takımın ev sahibi VEYA deplasman olarak kaç kez göründüğünü tekrarlarla birlikte gösterecek (satır sayısı UNION'dakinden daha fazla olacak).",
      ipucu: "UNION yerine UNION ALL yaz — tekrarlar elenmeyecek.",
      cozumSql: "SELECT home_team_id AS team_id FROM matches UNION ALL SELECT away_team_id AS team_id FROM matches;",
      mod: "sonuc",
    },
    {
      id: "3-6-3",
      seviye: "Orta",
      baslik: "Hem Forvet Hem Orta Saha Olan Takımlar",
      soru: "Hem 'Forvet' hem 'Orta Saha' pozisyonunda oyuncusu olan takımların team_id'lerini getiren bir sorgu yaz (INTERSECT kullan).",
      ipucu: "SELECT team_id FROM players WHERE position = 'Forvet' INTERSECT SELECT team_id FROM players WHERE position = 'Orta Saha'; kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT team_id FROM players WHERE position = 'Forvet' INTERSECT SELECT team_id FROM players WHERE position = 'Orta Saha';",
      mod: "sonuc",
    },
    {
      id: "3-6-4",
      seviye: "Orta",
      baslik: "Hiç Gol Atmamış Oyuncular (EXCEPT ile)",
      soru: "players tablosundaki tüm player_id'lerden, goals tablosunda en az bir kez geçenleri çıkararak hiç gol atmamış oyuncuların player_id'lerini getiren bir sorgu yaz (EXCEPT kullan).",
      ipucu: "SELECT player_id FROM players EXCEPT SELECT player_id FROM goals; kalıbını kullanabilirsin.",
      cozumSql: "SELECT player_id FROM players EXCEPT SELECT player_id FROM goals;",
      mod: "sonuc",
    },
    {
      id: "3-6-5",
      seviye: "Zor",
      baslik: "Belirli Bir Haftanın Katılımcıları",
      soru: "match_date'i '2025-08-10' ile '2025-08-13' arasında (dahil) olan maçlarda ev sahibi VEYA deplasman olarak yer almış takımların team_id'lerini, tekrarsız olarak getiren bir sorgu yaz.",
      ipucu: "Her iki SELECT'e de WHERE match_date BETWEEN '2025-08-10' AND '2025-08-13' filtresini ekleyip UNION ile birleştir.",
      cozumSql:
        "SELECT home_team_id AS team_id FROM matches WHERE match_date BETWEEN '2025-08-10' AND '2025-08-13' UNION SELECT away_team_id AS team_id FROM matches WHERE match_date BETWEEN '2025-08-10' AND '2025-08-13';",
      mod: "sonuc",
    },
    {
      id: "3-6-6",
      seviye: "Zor",
      baslik: "Gol Atmamış Saha Oyuncuları",
      soru: "position'ı 'Kaleci' OLMAYAN oyunculardan, hiç gol atmamış olanların player_id'lerini getiren bir sorgu yaz (EXCEPT kullan).",
      ipucu: "SELECT player_id FROM players WHERE position != 'Kaleci' EXCEPT SELECT player_id FROM goals; kalıbını kullanabilirsin.",
      cozumSql: "SELECT player_id FROM players WHERE position != 'Kaleci' EXCEPT SELECT player_id FROM goals;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-6-q1",
      soru: "UNION ile UNION ALL arasındaki fark nedir?",
      secenekler: [
        "Aralarında hiçbir fark yoktur",
        "UNION tekrar eden satırları eler, UNION ALL elemez",
        "UNION ALL sadece sayısal sütunlarla çalışır",
        "UNION, sadece iki tablo JOIN'lendiğinde kullanılabilir",
      ],
      dogruIndex: 1,
      aciklama: "UNION, sonuçtaki tekrar eden satırları otomatik olarak eler (DISTINCT uygular); UNION ALL ise tüm satırları, tekrarlarıyla birlikte tutar.",
    },
    {
      id: "3-6-q2",
      soru: "İki sorguyu UNION ile birleştirmek için ne gereklidir?",
      secenekler: [
        "İki sorgunun aynı tablodan gelmesi gerekir",
        "İki sorgunun aynı sayıda sütun döndürmesi ve sütun tiplerinin uyumlu olması gerekir",
        "Hiçbir koşul yok, herhangi iki sorgu birleştirilebilir",
        "İki sorgunun da bir WHERE koşulu içermesi gerekir",
      ],
      dogruIndex: 1,
      aciklama: "UNION (ve diğer küme işlemleri) için her iki sorgunun döndürdüğü sütun sayısı eşit ve tipler uyumlu olmalıdır.",
    },
    {
      id: "3-6-q3",
      soru: "INTERSECT ne getirir?",
      secenekler: [
        "Sadece birinci sorguda olan satırları",
        "Her iki sorguda da ortak olan (kesişen) satırları",
        "İki sorgunun tüm satırlarını, tekrarlarla birlikte",
        "Sadece ikinci sorguda olan satırları",
      ],
      dogruIndex: 1,
      aciklama: "INTERSECT, iki sorgu sonucunun kesişimini — yani her iki sorguda da bulunan satırları — döndürür.",
    },
    {
      id: "3-6-q4",
      soru: "SELECT player_id FROM players EXCEPT SELECT player_id FROM goals; sorgusu neyi bulur?",
      secenekler: [
        "goals tablosunda olan ama players'ta olmayan oyuncuları",
        "players'ta olan ama goals'ta hiç geçmeyen oyuncuları — yani hiç gol atmamış oyuncuları",
        "Hem players hem goals'ta olan oyuncuları",
        "Tüm oyuncuları, tekrarsız olarak",
      ],
      dogruIndex: 1,
      aciklama: "EXCEPT, birinci sorgunun sonucundan ikinci sorguda da bulunan satırları çıkarır; burada bu, hiç gol atmamış oyuncuları verir.",
    },
    {
      id: "3-6-q5",
      soru: "LEFT JOIN + WHERE ... IS NULL (anti-join) ile EXCEPT arasındaki ilişki nedir?",
      secenekler: [
        "Tamamen farklı sonuçlar üretirler, karşılaştırılamazlar",
        "Çoğu zaman aynı problemi (bir kümede olup diğerinde olmayanları bulma) farklı tekniklerle çözerler",
        "EXCEPT sadece sayısal sütunlarda, anti-join sadece metin sütunlarında çalışır",
        "Anti-join her zaman EXCEPT'ten daha fazla satır döndürür",
      ],
      dogruIndex: 1,
      aciklama: "Her ikisi de 'bir kümede olup diğerinde olmayan' satırları bulma problemini çözer; hangisinin kullanılacağı çoğu zaman okunabilirlik tercihidir.",
    },
  ],
});
