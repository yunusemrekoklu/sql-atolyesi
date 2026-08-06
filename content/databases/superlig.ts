import type { SampleDatabase } from "@/types/content";

export const superligDb: SampleDatabase = {
  id: "superlig",
  ad: "Süper Lig",
  aciklama: "Kurgusal bir Süper Lig sezonundan takımlar, oyuncular, maçlar ve goller.",
  ddl: `
CREATE TABLE teams (
  team_id INTEGER PRIMARY KEY,
  team_name TEXT NOT NULL,
  city TEXT NOT NULL,
  founded_year INTEGER NOT NULL,
  stadium_name TEXT NOT NULL
);

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(team_id),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  jersey_number INTEGER NOT NULL,
  birth_year INTEGER NOT NULL
);

CREATE TABLE matches (
  match_id INTEGER PRIMARY KEY,
  home_team_id INTEGER NOT NULL REFERENCES teams(team_id),
  away_team_id INTEGER NOT NULL REFERENCES teams(team_id),
  match_date TEXT NOT NULL,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL
);

CREATE TABLE goals (
  goal_id INTEGER PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(match_id),
  player_id INTEGER NOT NULL REFERENCES players(player_id),
  minute INTEGER NOT NULL,
  is_penalty INTEGER NOT NULL
);

INSERT INTO teams (team_id, team_name, city, founded_year, stadium_name) VALUES
  (1, 'Galatasaray', 'İstanbul', 1905, 'Rams Park'),
  (2, 'Fenerbahçe', 'İstanbul', 1907, 'Şükrü Saracoğlu Stadyumu'),
  (3, 'Beşiktaş', 'İstanbul', 1903, 'Tüpraş Stadyumu'),
  (4, 'Trabzonspor', 'Trabzon', 1967, 'Şenol Güneş Stadyumu'),
  (5, 'Başakşehir', 'İstanbul', 2014, 'Fatih Terim Stadyumu'),
  (6, 'Adana Demirspor', 'Adana', 1954, 'Yeni Adana Stadyumu'),
  (7, 'Alanyaspor', 'Antalya', 1948, 'Bahçeşehir Okulları Stadyumu'),
  (8, 'Kayserispor', 'Kayseri', 1966, 'Kadir Has Stadyumu'),
  (9, 'Konyaspor', 'Konya', 1922, 'Konya Büyükşehir Stadyumu'),
  (10, 'Sivasspor', 'Sivas', 1967, 'Yeni 4 Eylül Stadyumu');

INSERT INTO players (player_id, team_id, full_name, position, jersey_number, birth_year) VALUES
  (1, 1, 'Uğur Demir', 'Forvet', 9, 1997),
  (2, 1, 'Kaan Öz', 'Orta Saha', 10, 1999),
  (3, 1, 'Baran Kurt', 'Defans', 4, 1995),
  (4, 2, 'Emirhan Taş', 'Forvet', 11, 1998),
  (5, 2, 'Tolga Şen', 'Orta Saha', 8, 1996),
  (6, 2, 'Yusuf Kaplan', 'Kaleci', 1, 1993),
  (7, 3, 'Berat Yıldırım', 'Forvet', 7, 2000),
  (8, 3, 'Onur Aksoy', 'Defans', 3, 1994),
  (9, 3, 'Deniz Çelik', 'Orta Saha', 6, 1997),
  (10, 4, 'Hakan Bulut', 'Forvet', 9, 1996),
  (11, 4, 'Serkan Avcı', 'Defans', 5, 1993),
  (12, 4, 'Mert Doğan', 'Kaleci', 1, 1992),
  (13, 5, 'Barış Kaya', 'Orta Saha', 8, 1998),
  (14, 5, 'Cem Aydemir', 'Forvet', 19, 2001),
  (15, 5, 'Fatih Er', 'Defans', 2, 1995),
  (16, 6, 'Volkan Tunç', 'Forvet', 10, 1997),
  (17, 6, 'Gökhan Sarı', 'Orta Saha', 7, 1996),
  (18, 6, 'Ali Turan', 'Defans', 4, 1994),
  (19, 7, 'Emrecan Yavaş', 'Forvet', 9, 1999),
  (20, 7, 'Sinan Polat', 'Orta Saha', 21, 1998),
  (21, 7, 'Metehan Gül', 'Kaleci', 1, 1995),
  (22, 8, 'Ozan Aktaş', 'Forvet', 17, 2000),
  (23, 8, 'Kerem Bozkurt', 'Defans', 3, 1996),
  (24, 8, 'Aras Yılmaz', 'Orta Saha', 6, 1997),
  (25, 9, 'Bora Şimşek', 'Forvet', 11, 1998),
  (26, 9, 'Erhan Uçar', 'Defans', 5, 1993),
  (27, 9, 'Tarık Karaca', 'Orta Saha', 8, 1997),
  (28, 10, 'İsmail Koç', 'Forvet', 9, 1999),
  (29, 10, 'Oğuzhan Er', 'Defans', 2, 1995),
  (30, 10, 'Yasin Aktepe', 'Kaleci', 1, 1994);

INSERT INTO matches (match_id, home_team_id, away_team_id, match_date, home_score, away_score) VALUES
  (1, 1, 2, '2025-08-10', 2, 1),
  (2, 3, 4, '2025-08-11', 1, 1),
  (3, 5, 6, '2025-08-12', 0, 0),
  (4, 7, 8, '2025-08-13', 2, 1),
  (5, 9, 10, '2025-08-13', 1, 0),
  (6, 2, 3, '2025-08-17', 2, 1),
  (7, 4, 1, '2025-08-18', 0, 2),
  (8, 6, 7, '2025-08-19', 1, 2),
  (9, 8, 9, '2025-08-20', 2, 0),
  (10, 10, 5, '2025-08-20', 1, 1),
  (11, 1, 3, '2025-08-24', 3, 0),
  (12, 2, 4, '2025-08-25', 1, 0);

INSERT INTO goals (goal_id, match_id, player_id, minute, is_penalty) VALUES
  (1, 1, 1, 23, 0),
  (2, 1, 2, 61, 0),
  (3, 1, 4, 77, 0),
  (4, 2, 7, 55, 0),
  (5, 2, 10, 80, 0),
  (6, 4, 19, 12, 0),
  (7, 4, 20, 68, 1),
  (8, 4, 22, 50, 0),
  (9, 5, 25, 34, 0),
  (10, 6, 4, 10, 0),
  (11, 6, 5, 44, 0),
  (12, 6, 9, 76, 0),
  (13, 7, 1, 15, 0),
  (14, 7, 2, 85, 0),
  (15, 8, 16, 40, 0),
  (16, 8, 19, 55, 0),
  (17, 8, 20, 90, 0),
  (18, 9, 22, 20, 0),
  (19, 9, 22, 60, 0),
  (20, 10, 28, 30, 0),
  (21, 10, 14, 70, 0),
  (22, 11, 1, 5, 0),
  (23, 11, 2, 48, 0),
  (24, 11, 3, 90, 1),
  (25, 12, 5, 66, 0);
`.trim(),
};
