import { definePracticeSet } from "@/types/content";
import { superligDb } from "@/content/databases/superlig";

export const joinler = definePracticeSet({
  slug: "joinler",
  baslik: "JOIN'ler",
  aciklama: "INNER JOIN, LEFT JOIN ve çok tablolu sorgular — Süper Lig veritabanı üzerinde.",
  veritabaniId: superligDb.id,
  sorular: [
    {
      id: "pr-join-1",
      seviye: "Kolay",
      baslik: "Oyuncu ve Takımı",
      soru: "Tüm oyuncuların full_name'ini ve bağlı oldukları team_name'i getiren bir sorgu yaz.",
      ipucu: "players'ı teams'e team_id üzerinden JOIN'le.",
      cozumSql: "SELECT p.full_name, t.team_name FROM players p JOIN teams t ON p.team_id = t.team_id;",
      mod: "sonuc",
    },
    {
      id: "pr-join-2",
      seviye: "Kolay",
      baslik: "Kaleciler",
      soru: "position'ı 'Kaleci' olan oyuncuların full_name'ini ve team_name'ini getiren bir sorgu yaz.",
      ipucu: "JOIN'den sonra WHERE p.position = 'Kaleci' ekle.",
      cozumSql: "SELECT p.full_name, t.team_name FROM players p JOIN teams t ON p.team_id = t.team_id WHERE p.position = 'Kaleci';",
      mod: "sonuc",
    },
    {
      id: "pr-join-3",
      seviye: "Orta",
      baslik: "Maçlar ve Takımlar",
      soru: "Tüm maçların match_date, ev sahibi takım adı (ev_sahibi) ve deplasman takım adını (deplasman) getiren bir sorgu yaz.",
      ipucu: "teams tablosunu iki farklı takma adla JOIN'le.",
      cozumSql:
        "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m JOIN teams ev ON m.home_team_id = ev.team_id JOIN teams deplasman ON m.away_team_id = deplasman.team_id;",
      mod: "sonuc",
    },
    {
      id: "pr-join-4",
      seviye: "Orta",
      baslik: "Golcüler ve Dakikaları",
      soru: "Golleri atan oyuncuların full_name'ini ve golün dakikasını (minute) getiren bir sorgu yaz.",
      ipucu: "goals'u players'a JOIN'le.",
      cozumSql: "SELECT p.full_name, g.minute FROM goals g JOIN players p ON g.player_id = p.player_id;",
      mod: "sonuc",
    },
    {
      id: "pr-join-5",
      seviye: "Orta",
      baslik: "Gol Atmamış Oyuncular",
      soru: "Hiç gol atmamış oyuncuların full_name'ini getiren bir sorgu yaz.",
      ipucu: "players'ı goals'a LEFT JOIN'le, WHERE g.goal_id IS NULL ekle (anti-join).",
      cozumSql: "SELECT p.full_name FROM players p LEFT JOIN goals g ON p.player_id = g.player_id WHERE g.goal_id IS NULL;",
      mod: "sonuc",
    },
    {
      id: "pr-join-6",
      seviye: "Orta",
      baslik: "Takım Başına Oyuncu Sayısı",
      soru: "Her takımın team_name'ini ve oyuncu sayısını (oyuncu_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "teams'i players'a LEFT JOIN'le, GROUP BY ile grupla, COUNT(p.player_id) kullan.",
      cozumSql: "SELECT t.team_name, COUNT(p.player_id) AS oyuncu_sayisi FROM teams t LEFT JOIN players p ON t.team_id = p.team_id GROUP BY t.team_id;",
      mod: "sonuc",
    },
    {
      id: "pr-join-7",
      seviye: "Zor",
      baslik: "Penaltı Golcüleri",
      soru: "Penaltıdan gol atmış (is_penalty = 1) oyuncuların full_name ve team_name'ini getiren bir sorgu yaz.",
      ipucu: "goals'u players ve teams'e JOIN'le, WHERE g.is_penalty = 1 ekle.",
      cozumSql:
        "SELECT p.full_name, t.team_name FROM goals g JOIN players p ON g.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id WHERE g.is_penalty = 1;",
      mod: "sonuc",
    },
    {
      id: "pr-join-8",
      seviye: "Zor",
      baslik: "En Çok Gol Atan 3 Oyuncu",
      soru: "En çok gol atan 3 oyuncunun full_name'ini ve gol sayısını (gol_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "goals'u players'a JOIN'le, GROUP BY, COUNT, ORDER BY DESC LIMIT 3 kullan.",
      cozumSql:
        "SELECT p.full_name, COUNT(*) AS gol_sayisi FROM goals g JOIN players p ON g.player_id = p.player_id GROUP BY p.player_id ORDER BY gol_sayisi DESC LIMIT 3;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "pr-join-9",
      seviye: "Zor",
      baslik: "Ağustos Sonu Maçları",
      soru: "match_date'i '2025-08-17' tarihinden SONRA (bu tarih hariç) olan maçların match_date, ev sahibi ve deplasman takım adlarını getiren bir sorgu yaz.",
      ipucu: "WHERE m.match_date > '2025-08-17' ekle.",
      cozumSql:
        "SELECT m.match_date, ev.team_name AS ev_sahibi, deplasman.team_name AS deplasman FROM matches m JOIN teams ev ON m.home_team_id = ev.team_id JOIN teams deplasman ON m.away_team_id = deplasman.team_id WHERE m.match_date > '2025-08-17';",
      mod: "sonuc",
    },
    {
      id: "pr-join-10",
      seviye: "Zor",
      baslik: "Takım Başına Toplam Gol",
      soru: "Her takımın team_name'ini ve oyuncularının attığı toplam gol sayısını (toplam_gol olarak) getiren, sonucu çoktan aza sıralayan bir sorgu yaz.",
      ipucu: "teams'i players'a, players'ı goals'a LEFT JOIN'le, GROUP BY, COUNT(g.goal_id) kullan.",
      cozumSql:
        "SELECT t.team_name, COUNT(g.goal_id) AS toplam_gol FROM teams t LEFT JOIN players p ON t.team_id = p.team_id LEFT JOIN goals g ON p.player_id = g.player_id GROUP BY t.team_id ORDER BY toplam_gol DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
});
