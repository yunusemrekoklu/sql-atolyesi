import { defineLesson } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const leftJoin = defineLesson({
  slug: "left-join",
  uniteId: 3,
  dersNo: "3.3",
  baslik: "LEFT JOIN",
  veritabaniId: superligDb.id,
  anlatim: `
\`INNER JOIN\`, sadece eşleşmesi olan satırları getirir. Ama bazen "eşleşmesi **olmayanları**" bulmak istersin — hiç gol atmamış oyuncular gibi. İşte bunun için \`LEFT JOIN\` var.

## LEFT JOIN nedir?

\`\`\`sql
SELECT p.full_name, g.minute
FROM players p
LEFT JOIN goals g ON p.player_id = g.player_id;
\`\`\`

\`LEFT JOIN\`, **sol** tablodaki (\`players\`) **tüm satırları** korur — sağ tabloda (\`goals\`) eşleşme olsun ya da olmasın. Eşleşme yoksa sağ tablonun sütunları o satırda \`NULL\` olur. Yani hiç gol atmamış bir oyuncu için \`minute\` sütunu \`NULL\` görünür ama oyuncu yine de sonuçta yer alır.

## RIGHT JOIN ve FULL JOIN

- **RIGHT JOIN**: \`LEFT JOIN\`'in aynası — bu sefer sağ tablonun tüm satırları korunur. \`A RIGHT JOIN B\`, \`B LEFT JOIN A\` ile aynı sonucu verir; bu yüzden pratikte genelde LEFT JOIN tercih edilir.
- **FULL JOIN (FULL OUTER JOIN)**: her iki taraftaki tüm satırları korur, eşleşmeyenler için ilgili tarafta NULL bırakır. Bazı veritabanları (MySQL gibi) FULL JOIN'i doğrudan desteklemez; bu yüzden pratikte en çok LEFT JOIN göreceksin.

## En önemli desen: Anti-Join (eşleşmeyenleri bulma)

LEFT JOIN'in en güçlü kullanımı, \`WHERE <sağ_tablo>.<kolon> IS NULL\` ile birleştirildiğinde ortaya çıkar — buna **anti-join** denir:

\`\`\`sql
SELECT p.full_name
FROM players p
LEFT JOIN goals g ON p.player_id = g.player_id
WHERE g.goal_id IS NULL;
\`\`\`

Bu sorgu, \`goals\` tablosunda **hiç karşılığı olmayan** oyuncuları getirir — yani hiç gol atmamış oyuncuları. \`INNER JOIN\` ile bunu yapamazsın, çünkü \`INNER JOIN\` zaten eşleşmeyenleri baştan eler.

## LEFT JOIN + GROUP BY: 0'ları unutma

\`COUNT(*)\` ile \`COUNT(kolon)\` arasındaki fark burada kritik hale gelir: \`COUNT(g.goal_id)\`, \`NULL\` olan \`goal_id\`'leri saymaz (yani gol atmamış oyuncu için 0 verir); \`COUNT(*)\` ise LEFT JOIN'in ürettiği satırı yine de sayar ve yanlışlıkla 1 döner.
`,
  ornekler: [
    { aciklama: "Galatasaray oyuncularını ve varsa gol dakikalarını getir:", sql: "SELECT p.full_name, g.minute FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE p.team_id = 1;" },
  ],
  onizlemeTablolari: ["players", "goals"],
  alistirmalar: [
    {
      id: "3-3-1",
      seviye: "Kolay",
      baslik: "Galatasaray Kadrosu ve Golleri",
      soru: "team_id'si 1 olan takımın (Galatasaray) oyuncularının full_name'ini ve varsa attıkları golün minute'ünü getiren bir sorgu yaz — gol atmamış oyuncular da sonuçta görünmeli (minute NULL olarak).",
      ipucu: "players'ı goals'a LEFT JOIN'le, sonra WHERE p.team_id = 1 ekle.",
      cozumSql: "SELECT p.full_name, g.minute FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE p.team_id = 1;",
      mod: "sonuc",
    },
    {
      id: "3-3-2",
      seviye: "Orta",
      baslik: "Hiç Gol Atmamış Oyuncular",
      soru: "Hiç gol atmamış oyuncuların full_name ve position sütunlarını getiren bir sorgu yaz (anti-join deseni).",
      ipucu: "players'ı goals'a LEFT JOIN'le, sonra WHERE g.goal_id IS NULL ekle.",
      cozumSql: "SELECT p.full_name, p.position FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE g.goal_id IS NULL;",
      mod: "sonuc",
    },
    {
      id: "3-3-3",
      seviye: "Orta",
      baslik: "Kaleci Golcü mü?",
      soru: "position'ı 'Kaleci' olan oyunculardan hiç gol atmamış olanların full_name'ini getiren bir sorgu yaz.",
      ipucu: "LEFT JOIN + WHERE g.goal_id IS NULL desenine, p.position = 'Kaleci' koşulunu AND ile ekle.",
      cozumSql:
        "SELECT p.full_name FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE p.position = 'Kaleci' AND g.goal_id IS NULL;",
      mod: "sonuc",
    },
    {
      id: "3-3-4",
      seviye: "Orta",
      baslik: "Kayserispor'un Golleri",
      soru: "team_id'si 8 olan takımın (Kayserispor) oyuncularının full_name'ini ve varsa attıkları golün minute'ünü getiren bir sorgu yaz.",
      ipucu: "players'ı goals'a LEFT JOIN'le, sonra WHERE p.team_id = 8 ekle.",
      cozumSql: "SELECT p.full_name, g.minute FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE p.team_id = 8;",
      mod: "sonuc",
    },
    {
      id: "3-3-5",
      seviye: "Zor",
      baslik: "Oyuncu Başına Gol Sayısı (0 Dahil)",
      soru: "Her oyuncunun full_name'ini ve attığı toplam gol sayısını (gol_sayisi olarak, hiç atmamışsa 0) getiren bir sorgu yaz; sonucu gol sayısına göre çoktan aza sırala.",
      ipucu: "players'ı goals'a LEFT JOIN'le, GROUP BY p.player_id ile grupla, COUNT(g.goal_id) kullan (COUNT(*) değil!) ve ORDER BY ... DESC ekle.",
      cozumSql:
        "SELECT p.full_name, COUNT(g.goal_id) AS gol_sayisi FROM players p LEFT JOIN goals g ON p.player_id = g.player_id GROUP BY p.player_id ORDER BY gol_sayisi DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "3-3-6",
      seviye: "Zor",
      baslik: "Takım Başına Oyuncu Sayısı",
      soru: "Her takımın team_name'ini ve o takımdaki toplam oyuncu sayısını (oyuncu_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "teams'i players'a LEFT JOIN'le, GROUP BY t.team_id ile grupla, COUNT(p.player_id) kullan.",
      cozumSql:
        "SELECT t.team_name, COUNT(p.player_id) AS oyuncu_sayisi FROM teams t LEFT JOIN players p ON t.team_id = p.team_id GROUP BY t.team_id;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-3-q1",
      soru: "LEFT JOIN, INNER JOIN'den farklı olarak ne yapar?",
      secenekler: [
        "Sadece eşleşen satırları getirir, INNER JOIN ile tamamen aynıdır",
        "Sol tablodaki tüm satırları korur, eşleşme olmayan sağ tablo sütunlarını NULL yapar",
        "Sadece sağ tablodaki satırları korur",
        "İki tabloyu birleştirmez, sadece filtreler",
      ],
      dogruIndex: 1,
      aciklama: "LEFT JOIN, sol tablonun tüm satırlarını korur; sağ tabloda eşleşme yoksa o sütunlar NULL olarak görünür.",
    },
    {
      id: "3-3-q2",
      soru: "'Anti-join' deseni nasıl kurulur?",
      secenekler: [
        "INNER JOIN + WHERE kolon IS NOT NULL",
        "LEFT JOIN + WHERE sağ_tablo.kolon IS NULL",
        "RIGHT JOIN + ORDER BY",
        "UNION ALL ile iki tabloyu birleştirerek",
      ],
      dogruIndex: 1,
      aciklama: "LEFT JOIN yaptıktan sonra sağ tablodan gelen bir sütunun NULL olduğu satırları filtrelemek, 'eşleşmesi olmayanları' (anti-join) bulmanın standart yoludur.",
    },
    {
      id: "3-3-q3",
      soru: "LEFT JOIN sonrası GROUP BY ile sayım yaparken neden COUNT(*) yerine COUNT(kolon_adi) kullanmak daha güvenlidir?",
      secenekler: [
        "Aralarında hiçbir fark yoktur",
        "COUNT(*), eşleşmesi olmayan (NULL) satırları da 1 olarak sayar; COUNT(kolon_adi) ise NULL'ları saymaz",
        "COUNT(*) sadece INNER JOIN ile çalışır",
        "COUNT(kolon_adi) her zaman daha yavaştır ve kaçınılmalıdır",
      ],
      dogruIndex: 1,
      aciklama: "LEFT JOIN'den gelen bir satırda eşleşme yoksa COUNT(*) yine de o satırı sayar (1 döner); COUNT(sağ_tablo.kolon) ise NULL olduğu için doğru şekilde 0 sayar.",
    },
    {
      id: "3-3-q4",
      soru: "RIGHT JOIN ile LEFT JOIN arasındaki ilişki nedir?",
      secenekler: [
        "Birbirleriyle hiç ilgileri yoktur",
        "A RIGHT JOIN B, B LEFT JOIN A ile aynı sonucu verir — sadece tablo sırası tersine döner",
        "RIGHT JOIN her zaman daha fazla satır döndürür",
        "RIGHT JOIN, SQL'de hiçbir veritabanında desteklenmez",
      ],
      dogruIndex: 1,
      aciklama: "RIGHT JOIN, LEFT JOIN'in aynasıdır; A RIGHT JOIN B ifadesi B LEFT JOIN A ile mantıksal olarak eşdeğerdir.",
    },
  ],
});
