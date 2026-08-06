import { defineLesson } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const iliskiselModel = defineLesson({
  slug: "iliskisel-model",
  uniteId: 3,
  dersNo: "3.1",
  baslik: "İlişkisel Model",
  veritabaniId: superligDb.id,
  anlatim: `
Şimdiye kadar tek tabloluk veritabanlarıyla çalıştın. Ama gerçek hayatta veriler tek bir devasa tabloya sığdırılmaz — birden fazla tabloya **bölünür** ve bu tablolar birbirine bağlanır. Bu derste yeni bir veritabanı olan \`superlig\`'i tanıyacaksın: takımlar, oyuncular, maçlar ve goller — dört ayrı tablo, birbirine bağlı.

## Neden tek tablo yeterli değil?

Diyelim ki tüm golleri tek bir devasa tabloda tutmaya çalıştın: her satırda golü atan oyuncunun adı, pozisyonu, takımı, takımın şehri, kurulduğu yıl, maçın tarihi... Bu durumda:

- Aynı oyuncunun adı, pozisyonu ve takım bilgisi **her golde tekrar tekrar** yazılır (veri tekrarı = güncelleme kabusu).
- Bir oyuncunun takımı değişirse, o oyuncuya ait **tüm eski gol satırlarını** güncellemen gerekir.
- Henüz hiç gol atmamış bir oyuncuyu bu tabloya hiç ekleyemezsin (çünkü "gol" satırı yok).

Çözüm: veriyi mantıksal parçalara **böl** ve bu parçaları birbirine bağla. Buna **normalizasyon** sezgisi denir.

## Primary Key (PK) ve Foreign Key (FK)

- **Primary Key (birincil anahtar):** Bir tablodaki her satırı benzersiz şekilde tanımlayan sütun — \`teams.team_id\`, \`players.player_id\` gibi. Şimdiye kadar gördüğün tüm \`_id\` sütunları PK'ydi.
- **Foreign Key (yabancı anahtar):** Bir tablodaki bir sütunun, **başka bir tablonun** birincil anahtarına işaret etmesi. Bu, iki tablo arasındaki bağlantıyı kurar.

\`superlig\` veritabanının şeması:

\`\`\`
teams   (team_id PK, team_name, city, founded_year, stadium_name)
players (player_id PK, team_id FK → teams, full_name, position, jersey_number, birth_year)
matches (match_id PK, home_team_id FK → teams, away_team_id FK → teams, match_date, home_score, away_score)
goals   (goal_id PK, match_id FK → matches, player_id FK → players, minute, is_penalty)
\`\`\`

\`players.team_id\`, bir oyuncunun hangi takıma ait olduğunu söyler — \`teams\` tablosundaki bir \`team_id\`'ye işaret eder. Aynı şekilde \`goals.player_id\` ve \`goals.match_id\`, bir golü hem atan oyuncuya hem de oynandığı maça bağlar.

Bu derste henüz tabloları **birbirine bağlamayacağız** (bu, bir sonraki dersin konusu: \`JOIN\`). Şimdilik amacımız bu dört tabloyu ve aralarındaki bağlantı mantığını tanımak — her tabloyu tek başına sorgulayarak.

\`\`\`sql
SELECT team_name, city, founded_year FROM teams ORDER BY founded_year;
\`\`\`
`,
  ornekler: [
    { aciklama: "Takımları kuruluş yılına göre eskiden yeniye sırala:", sql: "SELECT team_name, city, founded_year FROM teams ORDER BY founded_year;" },
    { aciklama: "team_id'si 1 olan takımın (Galatasaray) oyuncularını getir:", sql: "SELECT full_name, position FROM players WHERE team_id = 1;" },
  ],
  onizlemeTablolari: ["teams", "players"],
  alistirmalar: [
    {
      id: "3-1-1",
      seviye: "Kolay",
      baslik: "Tüm Takımlar",
      soru: "teams tablosundaki tüm takımları, tüm sütunlarıyla getiren bir sorgu yaz.",
      ipucu: "SELECT * FROM teams; yeterli.",
      cozumSql: "SELECT * FROM teams;",
      mod: "sonuc",
    },
    {
      id: "3-1-2",
      seviye: "Kolay",
      baslik: "Eski Takımlar",
      soru: "1960'tan önce kurulmuş (founded_year < 1960) takımların team_name ve founded_year'ını getiren bir sorgu yaz.",
      ipucu: "WHERE founded_year < 1960 kalıbını kullanabilirsin.",
      cozumSql: "SELECT team_name, founded_year FROM teams WHERE founded_year < 1960;",
      mod: "sonuc",
    },
    {
      id: "3-1-3",
      seviye: "Orta",
      baslik: "Bir Takımın Kadrosu",
      soru: "team_id'si 3 olan takımın (Beşiktaş) tüm oyuncularının full_name ve jersey_number'ını getiren bir sorgu yaz.",
      ipucu: "players tablosunda WHERE team_id = 3 filtresini kullan — henüz JOIN'e gerek yok, players zaten team_id'yi tutuyor.",
      cozumSql: "SELECT full_name, jersey_number FROM players WHERE team_id = 3;",
      mod: "sonuc",
    },
    {
      id: "3-1-4",
      seviye: "Orta",
      baslik: "Bir Günün Maçları",
      soru: "match_date'i '2025-08-13' olan maçların tüm sütunlarını getiren bir sorgu yaz.",
      ipucu: "WHERE match_date = '2025-08-13' kalıbını kullanabilirsin.",
      cozumSql: "SELECT * FROM matches WHERE match_date = '2025-08-13';",
      mod: "sonuc",
    },
    {
      id: "3-1-5",
      seviye: "Zor",
      baslik: "Son Dakika Golleri",
      soru: "90. dakikada (minute = 90) atılan gollerin match_id, player_id ve is_penalty sütunlarını getiren bir sorgu yaz.",
      ipucu: "goals tablosunda WHERE minute = 90 kalıbını kullanabilirsin.",
      cozumSql: "SELECT match_id, player_id, is_penalty FROM goals WHERE minute = 90;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-1-q1",
      soru: "Primary Key (birincil anahtar) ne işe yarar?",
      secenekler: [
        "Bir tablodaki her satırı benzersiz şekilde tanımlar",
        "Sadece metin sütunlarında kullanılır",
        "Bir tablonun kaç satırı olduğunu sayar",
        "Sütunun NULL olamayacağını garanti etmez",
      ],
      dogruIndex: 0,
      aciklama: "Primary Key, bir tablodaki her satırı benzersiz şekilde tanımlayan sütun ya da sütun grubudur.",
    },
    {
      id: "3-1-q2",
      soru: "players.team_id sütunu ne işe yarar?",
      secenekler: [
        "Oyuncunun forma numarasını tutar",
        "teams tablosundaki bir team_id'ye işaret ederek oyuncuyu bir takıma bağlar (Foreign Key)",
        "Takımın kuruluş yılını tutar",
        "Hiçbir işe yaramaz, sadece dekoratiftir",
      ],
      dogruIndex: 1,
      aciklama: "players.team_id, teams tablosunun birincil anahtarına (team_id) işaret eden bir Foreign Key'dir — oyuncuyu takımına bağlar.",
    },
    {
      id: "3-1-q3",
      soru: "Neden verileri tek bir devasa tabloya sığdırmak yerine birden fazla tabloya bölersin?",
      secenekler: [
        "SQL sadece tek tabloyla çalışabildiği için",
        "Veri tekrarını azaltmak ve güncellemeleri kolaylaştırmak için",
        "Tablo sayısı arttıkça sorgular otomatik hızlanır",
        "Hiçbir teknik nedeni yok, sadece gelenek",
      ],
      dogruIndex: 1,
      aciklama: "Veriyi mantıksal parçalara bölmek (normalizasyon), aynı bilginin tekrar tekrar yazılmasını önler ve güncellemeleri tek bir yerde yapmanı sağlar.",
    },
    {
      id: "3-1-q4",
      soru: "goals tablosundaki match_id ve player_id sütunları için ne söylenebilir?",
      secenekler: [
        "İkisi de aynı tabloya işaret eder",
        "match_id matches tablosuna, player_id players tablosuna işaret eden birer Foreign Key'dir",
        "İkisi de birincil anahtardır ve başka hiçbir şeye işaret etmez",
        "Sadece raporlama için eklenmiş, işlevsel değildir",
      ],
      dogruIndex: 1,
      aciklama: "Bir golü hem oynandığı maça (match_id → matches) hem de atan oyuncuya (player_id → players) bağlayan iki ayrı Foreign Key'dir.",
    },
    {
      id: "3-1-q5",
      soru: "Bu derste tabloları birbirine bağlayan bir SQL komutu (JOIN) kullandık mı?",
      secenekler: [
        "Evet, her alıştırmada JOIN kullandık",
        "Hayır, sadece tabloların şemasını ve tek tablo sorgularını inceledik — JOIN bir sonraki derste",
        "JOIN, sadece INSERT ile birlikte kullanılabilir",
        "JOIN, SQLite'ta desteklenmiyor",
      ],
      dogruIndex: 1,
      aciklama: "Bu ders bir hazırlık dersiydi; tabloları JOIN ile birbirine bağlamayı bir sonraki derste (INNER JOIN) öğreneceksin.",
    },
  ],
});
