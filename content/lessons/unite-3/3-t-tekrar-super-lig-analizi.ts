import { defineLesson } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const tekrarSuperLigAnalizi = defineLesson({
  slug: "tekrar-super-lig-analizi",
  uniteId: 3,
  dersNo: "3.T",
  baslik: "Tekrar: Süper Lig Analizi",
  veritabaniId: superligDb.id,
  anlatim: `
Ünite 3'ü tamamladın! \`INNER JOIN\`, \`LEFT JOIN\`, self JOIN, çok tablolu sorgular ve küme işlemleri — hepsini \`superlig\` verisi üzerinde, gerçek bir maç/gol analizi senaryosunda pekiştireceksin.

## Hatırlatma: CASE + JOIN bir arada

Ünite 2'de öğrendiğin \`CASE WHEN\`, JOIN'li sorgularla da rahatça kullanılır. Örneğin bir takımın oynadığı her maçta "rakibin" kim olduğunu bulmak için, o takımın ev sahibi mi deplasman mı olduğuna göre farklı bir sütunu seçmen gerekir:

\`\`\`sql
SELECT match_date,
       CASE WHEN home_team_id = 1 THEN away_team_id ELSE home_team_id END AS rakip_id
FROM matches
WHERE home_team_id = 1 OR away_team_id = 1;
\`\`\`

Aşağıdaki alıştırmalarda bu ünitedeki tüm teknikleri karma olarak kullanacaksın.
`,
  ornekler: [
    { aciklama: "Tüm maçları ev sahibi/deplasman adlarıyla getir:", sql: "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m JOIN teams ev ON m.home_team_id = ev.team_id JOIN teams deplasman ON m.away_team_id = deplasman.team_id;" },
  ],
  onizlemeTablolari: ["teams", "players", "matches", "goals"],
  alistirmalar: [
    {
      id: "3-t-1",
      seviye: "Kolay",
      baslik: "Tüm Maçlar",
      soru: "Tüm maçların match_date, ev sahibi takım adı (ev_sahibi) ve deplasman takım adını (deplasman) getiren bir sorgu yaz.",
      ipucu: "matches'ı teams'e iki farklı takma adla JOIN'le (bkz. Ders 3.2).",
      cozumSql:
        "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m JOIN teams ev ON m.home_team_id = ev.team_id JOIN teams deplasman ON m.away_team_id = deplasman.team_id;",
      mod: "sonuc",
    },
    {
      id: "3-t-2",
      seviye: "Kolay",
      baslik: "En Golcü Oyuncu",
      soru: "En çok gol atan oyuncunun full_name'ini ve toplam gol sayısını (gol_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "goals'u players'a JOIN'le, GROUP BY ile grupla, COUNT ile say, ORDER BY ... DESC LIMIT 1 ekle.",
      cozumSql:
        "SELECT p.full_name, COUNT(*) AS gol_sayisi FROM goals g JOIN players p ON g.player_id = p.player_id GROUP BY p.player_id ORDER BY gol_sayisi DESC LIMIT 1;",
      mod: "sonuc",
    },
    {
      id: "3-t-3",
      seviye: "Orta",
      baslik: "Takım Başına Toplam Gol",
      soru: "Her takımın team_name'ini ve oyuncularının attığı toplam gol sayısını (toplam_gol olarak) getiren bir sorgu yaz; sonucu gol sayısına göre çoktan aza sırala.",
      ipucu: "teams'i players'a, players'ı goals'a LEFT JOIN'le; GROUP BY t.team_id, COUNT(g.goal_id) kullan.",
      cozumSql:
        "SELECT t.team_name, COUNT(g.goal_id) AS toplam_gol FROM teams t LEFT JOIN players p ON t.team_id = p.team_id LEFT JOIN goals g ON p.player_id = g.player_id GROUP BY t.team_id ORDER BY toplam_gol DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "3-t-4",
      seviye: "Orta",
      baslik: "Golsüz Oyuncular",
      soru: "Hiç gol atmamış oyuncuların full_name'ini ve bağlı oldukları team_name'i getiren bir sorgu yaz.",
      ipucu: "players'ı goals'a LEFT JOIN'le, teams'e INNER JOIN'le, WHERE g.goal_id IS NULL ekle.",
      cozumSql:
        "SELECT p.full_name, t.team_name FROM players p JOIN teams t ON p.team_id = t.team_id LEFT JOIN goals g ON p.player_id = g.player_id WHERE g.goal_id IS NULL;",
      mod: "sonuc",
    },
    {
      id: "3-t-5",
      seviye: "Orta",
      baslik: "Gollü Geçen Maçlar",
      soru: "match_date'i '2025-08-13' ile '2025-08-20' arasında (dahil) olan ve toplam 3 veya daha fazla gol atılan maçların match_id'sini ve toplam gol sayısını (toplam_gol olarak) getiren bir sorgu yaz.",
      ipucu: "matches'ı goals'a JOIN'le, WHERE ile tarih aralığını filtrele, GROUP BY m.match_id, HAVING COUNT(*) >= 3 ekle.",
      cozumSql:
        "SELECT m.match_id, COUNT(*) AS toplam_gol FROM matches m JOIN goals g ON m.match_id = g.match_id WHERE m.match_date BETWEEN '2025-08-13' AND '2025-08-20' GROUP BY m.match_id HAVING COUNT(*) >= 3;",
      mod: "sonuc",
    },
    {
      id: "3-t-6",
      seviye: "Zor",
      baslik: "Penaltı Golcüleri",
      soru: "Penaltıdan gol atmış (is_penalty = 1) oyuncuların full_name'ini ve bağlı oldukları team_name'i getiren bir sorgu yaz.",
      ipucu: "goals'u players ve teams'e JOIN'le, WHERE g.is_penalty = 1 ekle.",
      cozumSql:
        "SELECT p.full_name, t.team_name FROM goals g JOIN players p ON g.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id WHERE g.is_penalty = 1;",
      mod: "sonuc",
    },
    {
      id: "3-t-7",
      seviye: "Zor",
      baslik: "Galatasaray'ın Rakipleri",
      soru: "team_id'si 1 olan takımın (Galatasaray) oynadığı tüm maçların match_date'ini ve rakip takımın team_id'sini (rakip_id olarak) getiren bir sorgu yaz — Galatasaray ev sahibiyse away_team_id'yi, deplasmansa home_team_id'yi rakip say.",
      ipucu: "CASE WHEN home_team_id = 1 THEN away_team_id ELSE home_team_id END AS rakip_id kalıbını, WHERE home_team_id = 1 OR away_team_id = 1 ile birlikte kullan.",
      cozumSql:
        "SELECT match_date, CASE WHEN home_team_id = 1 THEN away_team_id ELSE home_team_id END AS rakip_id FROM matches WHERE home_team_id = 1 OR away_team_id = 1;",
      mod: "sonuc",
    },
    {
      id: "3-t-8",
      seviye: "Zor",
      baslik: "Çok Gollü Oyuncular",
      soru: "En az 2 gol atmış oyuncuların full_name'ini ve gol sayısını (gol_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "goals'u players'a JOIN'le, GROUP BY p.player_id, HAVING COUNT(*) >= 2 ekle.",
      cozumSql:
        "SELECT p.full_name, COUNT(*) AS gol_sayisi FROM goals g JOIN players p ON g.player_id = p.player_id GROUP BY p.player_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-t-q1",
      soru: "Bir tabloyu, farklı FK sütunları üzerinden aynı sorguda birden fazla kez kullanmak istediğinde ne yaparsın?",
      secenekler: [
        "Tabloyu farklı takma adlarla birden fazla kez JOIN'lersin",
        "Bu mümkün değildir",
        "UNION kullanman gerekir",
        "Sadece son JOIN geçerli sayılır",
      ],
      dogruIndex: 0,
      aciklama: "matches örneğinde olduğu gibi, teams tablosunu ev sahibi ve deplasman için farklı takma adlarla iki kez JOIN'leyebilirsin.",
    },
    {
      id: "3-t-q2",
      soru: "LEFT JOIN + WHERE sağ_tablo.kolon IS NULL deseni neyi bulur?",
      secenekler: [
        "Sağ tabloda eşleşmesi olan satırları",
        "Sağ tabloda eşleşmesi OLMAYAN satırları (anti-join)",
        "Her iki tablodaki tüm satırları",
        "Sadece sağ tablonun boş olduğu durumları",
      ],
      dogruIndex: 1,
      aciklama: "Bu, anti-join desenidir — sol tabloda olup sağ tabloda karşılığı olmayan satırları bulmanın standart yoludur.",
    },
    {
      id: "3-t-q3",
      soru: "UNION ile INTERSECT arasındaki fark nedir?",
      secenekler: [
        "UNION iki sonucu birleştirir (tekrarsız), INTERSECT sadece ortak olanları getirir",
        "Aralarında fark yoktur",
        "INTERSECT her zaman UNION'dan daha fazla satır döndürür",
        "UNION sadece sayısal verilerle çalışır",
      ],
      dogruIndex: 0,
      aciklama: "UNION iki sorgunun sonucunu birleştirip tekrarları eler; INTERSECT ise sadece her iki sorguda da ortak olan satırları getirir.",
    },
    {
      id: "3-t-q4",
      soru: "Self JOIN ne zaman kullanılır?",
      secenekler: [
        "Bir tablonun satırları aynı tablodaki başka satırlarla ilişkili olduğunda (ör. bölüm başkanı hiyerarşisi)",
        "Sadece iki farklı veritabanı birleştirilirken",
        "Sadece PRIMARY KEY'i olmayan tablolarda",
        "Hiçbir zaman, self JOIN modern SQL'de kullanılmaz",
      ],
      dogruIndex: 0,
      aciklama: "Self JOIN, bir tablodaki satırların aynı tablodaki başka satırlarla (ör. bir öğretmenin bölüm başkanıyla) ilişkilendirilmesi gerektiğinde kullanılır.",
    },
    {
      id: "3-t-q5",
      soru: "Çok tablolu bir JOIN'de ON koşulunu yanlış (ya da eksik) yazmanın en tipik belirtisi nedir?",
      secenekler: [
        "Sorgu hiç çalışmaz, her zaman hata verir",
        "Beklenenden çok daha fazla satır dönmesi (kartezyen çarpıma yakın bir sonuç)",
        "Sonuç her zaman boş döner",
        "SQLite otomatik olarak doğru koşulu tahmin eder",
      ],
      dogruIndex: 1,
      aciklama: "Eksik ya da yanlış bir ON koşulu genellikle sorguyu hatasız çalıştırır ama beklenenden çok daha fazla (anlamsız) satır döndürür — bu, JOIN hatalarının en sık görülen belirtisidir.",
    },
  ],
});
