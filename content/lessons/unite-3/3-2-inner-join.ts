import { defineLesson } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const innerJoin = defineLesson({
  slug: "inner-join",
  uniteId: 3,
  dersNo: "3.2",
  baslik: "INNER JOIN",
  veritabaniId: superligDb.id,
  anlatim: `
Önceki derste \`players.team_id\`'nin \`teams.team_id\`'ye işaret ettiğini gördün ama bu bağlantıyı hiç kullanmadık. \`JOIN\`, tam olarak bunu yapar: iki tabloyu ortak bir sütun üzerinden **birleştirir**.

## Temel söz dizimi

\`\`\`sql
SELECT p.full_name, t.team_name
FROM players p
INNER JOIN teams t ON p.team_id = t.team_id;
\`\`\`

- \`INNER JOIN <tablo> ON <koşul>\`: iki tabloyu, \`ON\`'daki koşulu sağlayan satırlar üzerinden eşleştirir.
- \`p\` ve \`t\`, sırasıyla \`players\` ve \`teams\` için **takma ad (alias)**. Sütun adları çakışabileceği için (\`team_id\` her iki tabloda da var) hangi tablodan geldiğini \`p.team_id\` / \`t.team_id\` şeklinde belirtiriz.
- **INNER JOIN**, sadece **her iki tarafta da eşleşmesi olan** satırları getirir. Bir oyuncunun \`team_id\`'si \`teams\` tablosunda yoksa (bu veri setinde olmaz ama teorik olarak), o oyuncu sonuçta **görünmez**.

\`INNER JOIN\` yerine kısaca \`JOIN\` da yazabilirsin — SQL'de \`JOIN\` varsayılan olarak \`INNER JOIN\` demektir.

## Aynı tabloya iki kez JOIN

Bir maçta hem ev sahibi hem deplasman takımı \`teams\` tablosundan gelir. Aynı tabloyu **iki farklı takma adla** iki kez JOIN'leyebilirsin:

\`\`\`sql
SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman
FROM matches m
INNER JOIN teams ev ON m.home_team_id = ev.team_id
INNER JOIN teams deplasman ON m.away_team_id = deplasman.team_id;
\`\`\`

Burada \`teams\` tablosu iki kez kullanılıyor ama her seferinde farklı bir takma adla (\`ev\`, \`deplasman\`) ve farklı bir FK sütunuyla (\`home_team_id\`, \`away_team_id\`) eşleştiriliyor. Takma adlar olmasaydı SQL hangi \`team_name\`'den bahsettiğini ayırt edemezdi.
`,
  ornekler: [
    { aciklama: "Oyuncuları takım adlarıyla birlikte listele:", sql: "SELECT p.full_name, t.team_name FROM players p INNER JOIN teams t ON p.team_id = t.team_id;" },
    { aciklama: "Maçları ev sahibi ve deplasman takım adlarıyla getir:", sql: "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m INNER JOIN teams ev ON m.home_team_id = ev.team_id INNER JOIN teams deplasman ON m.away_team_id = deplasman.team_id;" },
  ],
  onizlemeTablolari: ["players", "teams"],
  alistirmalar: [
    {
      id: "3-2-1",
      seviye: "Kolay",
      baslik: "Oyuncu ve Takımı",
      soru: "Tüm oyuncuların full_name'ini ve bağlı oldukları takımın team_name'ini getiren bir sorgu yaz (players ile teams'i JOIN'le).",
      ipucu: "FROM players p INNER JOIN teams t ON p.team_id = t.team_id kalıbını kullanabilirsin.",
      cozumSql: "SELECT p.full_name, t.team_name FROM players p INNER JOIN teams t ON p.team_id = t.team_id;",
      mod: "sonuc",
    },
    {
      id: "3-2-2",
      seviye: "Kolay",
      baslik: "Sadece Forvetler",
      soru: "position'ı 'Forvet' olan oyuncuların full_name'ini ve team_name'ini getiren bir sorgu yaz.",
      ipucu: "JOIN'den sonra WHERE p.position = 'Forvet' ekle.",
      cozumSql: "SELECT p.full_name, t.team_name FROM players p INNER JOIN teams t ON p.team_id = t.team_id WHERE p.position = 'Forvet';",
      mod: "sonuc",
    },
    {
      id: "3-2-3",
      seviye: "Orta",
      baslik: "Ev Sahibi ve Deplasman",
      soru: "Tüm maçların match_date, ev sahibi takım adı (ev_sahibi) ve deplasman takım adını (deplasman) getiren bir sorgu yaz — teams tablosuna iki kez JOIN yapman gerekecek.",
      ipucu: "matches tablosunu teams'e iki farklı takma adla (ör. ev, deplasman) JOIN'le: biri home_team_id, diğeri away_team_id üzerinden.",
      cozumSql:
        "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m INNER JOIN teams ev ON m.home_team_id = ev.team_id INNER JOIN teams deplasman ON m.away_team_id = deplasman.team_id;",
      mod: "sonuc",
    },
    {
      id: "3-2-4",
      seviye: "Orta",
      baslik: "Golün Maçı",
      soru: "goals tablosundaki her golün match_id'sini ve o golün atıldığı maçın match_date'ini getiren bir sorgu yaz (goals ile matches'ı JOIN'le).",
      ipucu: "FROM goals g INNER JOIN matches m ON g.match_id = m.match_id kalıbını kullanabilirsin.",
      cozumSql: "SELECT g.match_id, m.match_date FROM goals g INNER JOIN matches m ON g.match_id = m.match_id;",
      mod: "sonuc",
    },
    {
      id: "3-2-5",
      seviye: "Orta",
      baslik: "Golcü ve Takımı",
      soru: "Her golü atan oyuncunun full_name'ini ve golün dakikasını (minute) getiren bir sorgu yaz (goals ile players'ı JOIN'le).",
      ipucu: "FROM goals g INNER JOIN players p ON g.player_id = p.player_id kalıbını kullanabilirsin.",
      cozumSql: "SELECT p.full_name, g.minute FROM goals g INNER JOIN players p ON g.player_id = p.player_id;",
      mod: "sonuc",
    },
    {
      id: "3-2-6",
      seviye: "Zor",
      baslik: "Golcü, Takımı ve Maç Tarihi",
      soru: "Her golü atan oyuncunun full_name'ini, golü attığı takımın team_name'ini ve golün atıldığı maçın match_date'ini getiren bir sorgu yaz — üç tabloyu (goals, players, matches) JOIN'lemen gerekecek.",
      ipucu: "goals'u önce players'a (g.player_id = p.player_id), sonra matches'a (g.match_id = m.match_id) JOIN'le; team_name için players'ı da teams'e bağla.",
      cozumSql:
        "SELECT p.full_name, t.team_name, m.match_date FROM goals g INNER JOIN players p ON g.player_id = p.player_id INNER JOIN teams t ON p.team_id = t.team_id INNER JOIN matches m ON g.match_id = m.match_id;",
      mod: "sonuc",
    },
    {
      id: "3-2-7",
      seviye: "Zor",
      baslik: "Penaltı Golleri",
      soru: "Sadece penaltıdan atılan (is_penalty = 1) gollerin, atan oyuncunun full_name'i ve maçın match_date'i ile birlikte getiren bir sorgu yaz.",
      ipucu: "goals'u players ve matches'a JOIN'le, sonra WHERE g.is_penalty = 1 ekle.",
      cozumSql:
        "SELECT p.full_name, m.match_date FROM goals g INNER JOIN players p ON g.player_id = p.player_id INNER JOIN matches m ON g.match_id = m.match_id WHERE g.is_penalty = 1;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-2-q1",
      soru: "INNER JOIN hangi satırları sonuca dahil eder?",
      secenekler: [
        "Sadece sol tablodaki tüm satırları",
        "Sadece her iki tabloda da ON koşulunu sağlayan (eşleşen) satırları",
        "Her iki tablodaki tüm satırları, eşleşme olmasa bile",
        "Sadece sağ tablodaki tüm satırları",
      ],
      dogruIndex: 1,
      aciklama: "INNER JOIN, ON koşulunu sağlayan (yani her iki tabloda da karşılığı olan) satırları getirir; eşleşmeyenler sonuçtan düşer.",
    },
    {
      id: "3-2-q2",
      soru: "SELECT p.full_name FROM players p JOIN teams t ON p.team_id = t.team_id; ifadesindeki 'p' ve 't' nedir?",
      secenekler: [
        "Sütun adları",
        "Tablolar için takma ad (alias)",
        "Zorunlu SQL anahtar kelimeleri",
        "Veritabanı adları",
      ],
      dogruIndex: 1,
      aciklama: "p ve t, sırasıyla players ve teams tabloları için tanımlanmış takma adlardır; sorguyu kısaltmak ve sütun kökenini netleştirmek için kullanılır.",
    },
    {
      id: "3-2-q3",
      soru: "Aynı tabloyu (ör. teams) bir sorguda iki farklı amaçla kullanmak istediğinde ne yapman gerekir?",
      secenekler: [
        "Tabloyu iki farklı takma adla iki kez JOIN'lemen gerekir",
        "Bu SQL'de mümkün değildir",
        "Tabloyu önce geçici bir tabloya kopyalaman gerekir",
        "JOIN yerine UNION kullanman gerekir",
      ],
      dogruIndex: 0,
      aciklama: "Bir tabloyu farklı FK sütunları üzerinden birden fazla kez JOIN'lemek istediğinde, her JOIN'e farklı bir takma ad vermen gerekir (ör. matches örneğindeki ev/deplasman).",
    },
    {
      id: "3-2-q4",
      soru: "JOIN yazıp INNER kelimesini eklemezsen ne olur?",
      secenekler: [
        "SQL hata verir",
        "Varsayılan olarak INNER JOIN uygulanır",
        "Otomatik olarak LEFT JOIN uygulanır",
        "Tüm satırlar kartezyen çarpım olarak döner",
      ],
      dogruIndex: 1,
      aciklama: "SQL'de tek başına JOIN yazmak, INNER JOIN ile aynı anlama gelir — INNER, varsayılan JOIN türüdür.",
    },
  ],
});
