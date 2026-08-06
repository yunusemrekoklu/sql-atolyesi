import type { SampleDatabase } from "@/types/content";

export const okulDb: SampleDatabase = {
  id: "okul",
  ad: "Okul",
  aciklama: "Bir okulun öğretmen, öğrenci, ders ve kayıt (vize/final notu) verileri.",
  ddl: `
CREATE TABLE teachers (
  teacher_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  department_head_id INTEGER REFERENCES teachers(teacher_id)
);

CREATE TABLE students (
  student_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  enrollment_year INTEGER NOT NULL
);

CREATE TABLE courses (
  course_id INTEGER PRIMARY KEY,
  course_name TEXT NOT NULL,
  credit INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES teachers(teacher_id)
);

CREATE TABLE enrollments (
  enrollment_id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(student_id),
  course_id INTEGER NOT NULL REFERENCES courses(course_id),
  midterm_grade REAL,
  final_grade REAL,
  semester TEXT NOT NULL
);

INSERT INTO teachers (teacher_id, full_name, branch, department_head_id) VALUES
  (1, 'Mehmet Yılmaz', 'Matematik', NULL),
  (2, 'Ayşe Kara', 'Matematik', 1),
  (3, 'Fatma Öz', 'Fizik', 1),
  (4, 'Ali Veli', 'Kimya', 1),
  (5, 'Zeynep Ak', 'Tarih', NULL),
  (6, 'Hüseyin Doğan', 'İngilizce', 5),
  (7, 'Elif Şahin', 'Bilgisayar', NULL),
  (8, 'Canan Ergün', 'Coğrafya', 5),
  (9, 'Gül Aydın', 'Biyoloji', 1),
  (10, 'Serkan Bal', 'Beden Eğitimi', NULL);

INSERT INTO students (student_id, full_name, department, enrollment_year) VALUES
  (1, 'Elif Aydın', 'Bilgisayar Mühendisliği', 2022),
  (2, 'Mert Kılıç', 'Matematik', 2021),
  (3, 'Sude Yıldız', 'Fizik', 2023),
  (4, 'Kerem Aksoy', 'Bilgisayar Mühendisliği', 2022),
  (5, 'Nil Demir', 'Tarih', 2021),
  (6, 'Burak Er', 'İşletme', 2023),
  (7, 'Ece Polat', 'Bilgisayar Mühendisliği', 2024),
  (8, 'Onur Şen', 'Matematik', 2022),
  (9, 'Melis Kaya', 'Fizik', 2021),
  (10, 'Yiğit Arslan', 'Tarih', 2023),
  (11, 'Ceren Bulut', 'İşletme', 2022),
  (12, 'Doruk Çelik', 'Bilgisayar Mühendisliği', 2023),
  (13, 'İrem Su Taş', 'Matematik', 2024),
  (14, 'Alp Kurt', 'Fizik', 2022),
  (15, 'Defne Öztürk', 'Tarih', 2024),
  (16, 'Aylin Er', 'Fizik', 2023),
  (17, 'Tuna Bay', 'İşletme', 2021);

INSERT INTO courses (course_id, course_name, credit, teacher_id) VALUES
  (1, 'Matematik I', 4, 1),
  (2, 'Matematik II', 4, 2),
  (3, 'Fizik I', 3, 3),
  (4, 'Kimya I', 3, 4),
  (5, 'Türkiye Tarihi', 2, 5),
  (6, 'İngilizce I', 2, 6),
  (7, 'Programlamaya Giriş', 3, 7),
  (8, 'Coğrafya', 2, 8),
  (9, 'Biyoloji', 3, 9),
  (10, 'Beden Eğitimi', 1, 10);

INSERT INTO enrollments (enrollment_id, student_id, course_id, midterm_grade, final_grade, semester) VALUES
  (1, 1, 7, 70, 80, '2024-Güz'),
  (2, 1, 1, 60, 55, '2024-Güz'),
  (3, 2, 1, 90, 95, '2024-Güz'),
  (4, 2, 2, 85, 88, '2025-Bahar'),
  (5, 3, 3, 50, 45, '2024-Güz'),
  (6, 4, 7, 95, 92, '2024-Güz'),
  (7, 4, 1, 40, 35, '2024-Güz'),
  (8, 5, 5, 78, 82, '2024-Güz'),
  (9, 6, 1, 65, 70, '2024-Güz'),
  (10, 7, 7, 88, NULL, '2025-Bahar'),
  (11, 8, 1, 55, 60, '2024-Güz'),
  (12, 8, 2, 72, 75, '2025-Bahar'),
  (13, 9, 3, 60, 58, '2024-Güz'),
  (14, 9, 4, 82, 79, '2024-Güz'),
  (15, 10, 5, 45, 50, '2024-Güz'),
  (16, 11, 1, 30, 25, '2024-Güz'),
  (17, 12, 7, 91, 89, '2024-Güz'),
  (18, 12, 3, 67, 71, '2025-Bahar'),
  (19, 13, 1, 58, 62, '2025-Bahar'),
  (20, 14, 3, 74, 77, '2024-Güz'),
  (21, 14, 4, 69, 65, '2024-Güz'),
  (22, 1, 6, 80, 85, '2025-Bahar'),
  (23, 3, 6, 55, 60, '2025-Bahar'),
  (24, 6, 8, 70, 68, '2024-Güz'),
  (25, 10, 8, 62, 66, '2024-Güz'),
  (26, 2, 6, 92, 90, '2025-Bahar'),
  (27, 5, 8, 58, 61, '2025-Bahar'),
  (28, 9, 6, 77, 80, '2025-Bahar'),
  (29, 12, 4, NULL, NULL, '2025-Bahar'),
  (30, 4, 6, 85, 88, '2025-Bahar'),
  (31, 16, 9, 68, 72, '2024-Güz'),
  (32, 17, 10, 85, 90, '2024-Güz'),
  (33, 7, 9, 74, 70, '2025-Bahar'),
  (34, 13, 10, 60, 65, '2025-Bahar');
`.trim(),
};
