import type { SampleDatabase } from "@/types/content";

export const kargoDb: SampleDatabase = {
  id: "kargo",
  ad: "Kargo",
  aciklama: "Bir kargo şirketinin şube, kurye ve gönderi verileri.",
  ddl: `
CREATE TABLE branches (
  branch_id INTEGER PRIMARY KEY,
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  opening_date TEXT NOT NULL
);

CREATE TABLE couriers (
  courier_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  branch_id INTEGER NOT NULL REFERENCES branches(branch_id),
  vehicle_type TEXT NOT NULL,
  hire_date TEXT NOT NULL
);

CREATE TABLE shipments (
  shipment_id INTEGER PRIMARY KEY,
  courier_id INTEGER NOT NULL REFERENCES couriers(courier_id),
  origin_branch_id INTEGER NOT NULL REFERENCES branches(branch_id),
  destination_city TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  status TEXT NOT NULL,
  ship_date TEXT NOT NULL,
  delivery_date TEXT
);

INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES
  (1, 'Kadıköy Şube', 'İstanbul', '2018-03-01'),
  (2, 'Çankaya Şube', 'Ankara', '2019-06-15'),
  (3, 'Konak Şube', 'İzmir', '2020-01-10'),
  (4, 'Nilüfer Şube', 'Bursa', '2021-09-01'),
  (5, 'Muratpaşa Şube', 'Antalya', '2022-02-20'),
  (6, 'Selçuklu Şube', 'Konya', '2022-11-05');

INSERT INTO couriers (courier_id, full_name, branch_id, vehicle_type, hire_date) VALUES
  (1, 'Serdar Yalçın', 1, 'Motosiklet', '2018-04-01'),
  (2, 'Pınar Uslu', 1, 'Minivan', '2019-05-12'),
  (3, 'Tolga Işık', 2, 'Motosiklet', '2019-07-01'),
  (4, 'Selin Er', 2, 'Kamyonet', '2020-03-15'),
  (5, 'Barış Toprak', 3, 'Motosiklet', '2020-02-01'),
  (6, 'Gamze Sağlam', 3, 'Minivan', '2021-01-10'),
  (7, 'Emrah Duman', 4, 'Motosiklet', '2021-10-01'),
  (8, 'Aslı Korkmaz', 4, 'Kamyonet', '2022-01-05'),
  (9, 'Kaan Bilgin', 5, 'Motosiklet', '2022-03-01'),
  (10, 'Derya Aktaş', 5, 'Minivan', '2022-06-20'),
  (11, 'Fırat Can', 6, 'Motosiklet', '2022-12-01'),
  (12, 'Nur Gündüz', 6, 'Kamyonet', '2023-02-15');

INSERT INTO shipments (shipment_id, courier_id, origin_branch_id, destination_city, weight_kg, status, ship_date, delivery_date) VALUES
  (1, 1, 1, 'Ankara', 2.5, 'Teslim Edildi', '2025-01-05', '2025-01-07'),
  (2, 1, 1, 'İzmir', 1.2, 'Teslim Edildi', '2025-01-08', '2025-01-10'),
  (3, 2, 1, 'Bursa', 5.0, 'Yolda', '2025-01-15', NULL),
  (4, 2, 1, 'Konya', 3.3, 'Teslim Edildi', '2025-01-16', '2025-01-19'),
  (5, 3, 2, 'İstanbul', 0.8, 'Teslim Edildi', '2025-01-06', '2025-01-08'),
  (6, 3, 2, 'Antalya', 4.1, 'Beklemede', '2025-01-20', NULL),
  (7, 4, 2, 'İzmir', 2.0, 'Teslim Edildi', '2025-01-10', '2025-01-13'),
  (8, 4, 2, 'İstanbul', 1.5, 'İptal', '2025-01-11', NULL),
  (9, 5, 3, 'Ankara', 6.2, 'Teslim Edildi', '2025-01-09', '2025-01-12'),
  (10, 5, 3, 'Bursa', 2.7, 'Yolda', '2025-01-22', NULL),
  (11, 6, 3, 'Konya', 3.0, 'Teslim Edildi', '2025-01-14', '2025-01-17'),
  (12, 6, 3, 'İstanbul', 1.1, 'Teslim Edildi', '2025-01-18', '2025-01-20'),
  (13, 7, 4, 'Antalya', 4.4, 'Beklemede', '2025-01-23', NULL),
  (14, 7, 4, 'Ankara', 2.2, 'Teslim Edildi', '2025-01-12', '2025-01-15'),
  (15, 8, 4, 'İzmir', 3.6, 'Teslim Edildi', '2025-01-13', '2025-01-16'),
  (16, 8, 4, 'Konya', 1.9, 'İptal', '2025-01-19', NULL),
  (17, 9, 5, 'İstanbul', 5.5, 'Teslim Edildi', '2025-01-07', '2025-01-10'),
  (18, 9, 5, 'Ankara', 2.8, 'Yolda', '2025-01-24', NULL),
  (19, 10, 5, 'Bursa', 3.3, 'Teslim Edildi', '2025-01-16', '2025-01-19'),
  (20, 10, 5, 'Konya', 1.4, 'Teslim Edildi', '2025-01-21', '2025-01-23'),
  (21, 11, 6, 'İstanbul', 4.9, 'Beklemede', '2025-01-25', NULL),
  (22, 11, 6, 'İzmir', 2.3, 'Teslim Edildi', '2025-01-17', '2025-01-20'),
  (23, 11, 6, 'Antalya', 1.7, 'Teslim Edildi', '2025-01-26', '2025-01-29'),
  (24, 10, 5, 'İstanbul', 0.9, 'Teslim Edildi', '2025-01-27', '2025-01-30');
`.trim(),
};
