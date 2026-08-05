# Kaynak Dosyaları — İnceleme Özeti

Bu klasördeki `moduller-seed.json` dışında, projenin başlangıcında incelenen ama bu bilgisayarda kalan iki kaynak dosya daha var. **Yeni bilgisayara geçerken bunları da kopyalaman lazım:**

- `C:\Users\btstajyer2\Desktop\datas.docx`
- `C:\Users\btstajyer2\Downloads\ilovepdf_merged_merged.pdf` (673 sayfa, 65.7 MB)
- Ayrıca sohbette W3Schools'un tam SQL konu listesinin ekran görüntüleri paylaşıldı (bkz. aşağıda "W3Schools konu listesi") — bunlar dosya değil, konu kontrol listesi olarak burada metne döküldü.

Aşağıda her kaynağın ne içerdiği, nasıl kullanılacağı özetlenmiştir (yeni oturumda tekrar analiz etmeye gerek kalmasın diye).

## 1. datas.docx (2 bölüm, ~175.000 karakter)

**Birinci yarı (satır 1–2938): SQLBolt'un 18 dersinin tamamı**
- Introduction to SQL → Lesson 1: SELECT queries 101 → Lesson 2/3: Queries with constraints (WHERE, LIKE, IN, BETWEEN) → Lesson 4: Filtering/sorting (DISTINCT, ORDER BY, LIMIT/OFFSET) → Review: Simple SELECT → Lesson 6: INNER JOIN → Lesson 7: OUTER JOINs → Lesson 8: NULL → Lesson 9: Expressions → Lesson 10/11: Aggregates (Pt.1/2), GROUP BY, HAVING → Lesson 12: Order of execution → Lesson 13: INSERT → Lesson 14: UPDATE → Lesson 15: DELETE → Lesson 16: CREATE TABLE → Lesson 17: ALTER TABLE → Lesson 18: DROP TABLE → Topic: Subqueries (genel + correlated + EXISTS) → Topic: UNION/INTERSECT/EXCEPT.
- Her ders: konu anlatımı + örnek tablo (ör. Pixar filmleri, kuzey Amerika şehirleri) + alıştırma görevleri (soru cümlesi, çözüm SQL'i yok — sadece görev tanımı).
- **Kullanım:** Ünite 1–5 müfredatının pedagojik iskeleti buradan alındı (bkz. `PROJE_PLANI.md` Ünite tabloları). Metinler birebir çevrilmeyecek, konu sırası ve öğretim mantığı örnek alınıp özgün Türkçe anlatım yazılacak.

**İkinci yarı (satır ~3640–7187): DataLemur mülakat soruları**
- Gerçek şirket SQL mülakat soruları: Facebook (Page With No Likes), Tesla (Unfinished Parts), Amazon (User Shopping Sprees), Google (Senior Managers), Twitter (Tweets' Rolling Averages), Snapchat (age_breakdown yüzde hesabı) ve daha fazlası.
- Her soru: senaryo metni + tablo şeması (kolon adı/tipi) + örnek girdi + örnek çıktı + açıklama + varsayımlar.
- **Kullanım:** `/mulakat` bölümündeki 12–15 sorunun tarzı ve zorluk kalibrasyonu buradan alındı (bkz. `PROJE_PLANI.md` → "/mulakat soruları" bölümü — Türk şirket senaryolarına uyarlanmış hali). Orijinal sorular kopyalanmayacak, sadece soru *deseni* (anti-join, correlated subquery, window function, self-join, yüzde hesabı) örnek alınacak.

## 2. ilovepdf_merged_merged.pdf (304 gerçek sayfa — SQLZoo çıktısı)

**Sayfa 1–144: SQLZoo konu dersleri + her dersin çoktan seçmeli quizi**
- SELECT basics → SELECT Quiz → SELECT from WORLD → BBC Quiz → SELECT from Nobel → Nobel Quiz → SELECT within SELECT (nested) → Nested SELECT Quiz → SUM and COUNT → SUM/COUNT Quiz → JOIN (dünya kupası temalı örnek) → JOIN Quiz → More JOIN operations → JOIN Quiz 2 → Using NULL → Using Null Quiz → Self join → Self join Quiz.
- **Kullanım:** `/pratik` setlerinin ve `/sinav` ünite quizlerinin soru tarzı (çoktan seçmeli format: "bu sorgunun çıktısı ne", "doğru sorguyu seç", "hatayı bul") buradan örneklendi.

**Sayfa 145–266: ~60 fonksiyon referans sayfası**
Alfabetik liste (her biri kendi sayfasında, söz dizimi + açıklama + örnek + "See also"): ABS, AVG, CASE, CAST, CEIL, COALESCE, CONCAT, COS, COUNT, CURRENT DATE, CURRENT TIMESTAMP, DATEPART, DAY, DIV, EXTRACT, FLOOR, HOUR, IFNULL, INSTR, LEFT, LEN, LENGTH, MAX, MIN, MINUTE, MOD, MONTH, NULLIF, NVL, PATINDEX, % MODULO, +(dates), +INTERVAL, +(string), POSITION, QUARTER, RANK, REPLACE, RIGHT, ROUND, SECOND, SIN, SUBSTR, SUBSTRING(ansi), SUBSTRING, SUM, TAN, TO CHAR(dates), TRIM, YEAR.
- **Kullanım:** `/fonksiyonlar` sekmesinin kapsam listesi doğrudan bu — 45+ fonksiyon burada zaten envanterlendi. Her biri farklı SQL lehçelerindeki karşılıklarını da içeriyor (ör. LEN=SQL Server, LENGTH=MySQL/SQLite) — bu, içerikteki `digerVeritabanlari` notu alanı için birebir kaynak.

**Sayfa 267–303: Komut referansları**
SELECT..WHERE, SELECT..GROUP BY, SELECT..JOIN, SELECT..SELECT, INSERT..VALUES, INSERT..SELECT, UPDATE, DELETE, CREATE TABLE, CREATE VIEW, CREATE INDEX, DROP, ALTER, UNION, LEFT JOIN, NULL — her biri kısa sözdizimi referans kartı formatında.
- **Kullanım:** Ünite 5 (Veri ve Tablo Yönetimi) derslerinin sözdizimi referans kutucukları için kaynak; ayrıca `/fonksiyonlar` sekmesinde "komutlar" alt kategorisi olarak eklenebilir.

## 3. W3Schools konu listesi (ekran görüntüleri, sohbette paylaşıldı)

Tam SQL Tutorial menüsü şu sırayı gösteriyor: Intro, Syntax, Select, Select Distinct, Where, Order By, And, Or, Not, Insert Into, Null Values, Update, Delete, Select Top, Aggregate Functions, Min/Max/Count/Sum/Avg, Like, Wildcards, In, Between, Aliases, Joins (Inner/Left/Right/Full/Self), Union/Union All, Group By, Having, Exists, Any/All, Select Into, Insert Into Select, Case, Null Functions, Stored Procedures, Comments, Operators — sonra Database bölümü: Create/Drop/Backup DB, Create/Drop/Alter Table, Constraints, Not Null, Unique, Primary Key, Foreign Key, Check, Default, Create Index, Auto Increment, Dates, Views, SQL Injection, Parameters, Prepared Statements.
- **Kullanım:** Eksik konu kalmadığını doğrulamak için çapraz kontrol listesi olarak kullanıldı. `PROJE_PLANI.md`'deki 5 ünite / 27 ders bu üç kaynağın (SQLBolt + SQLZoo + W3Schools) kesişimini kapsayacak şekilde tasarlandı — hiçbir ana konu dışarıda bırakılmadı (Stored Procedures ve SQL Injection bilinçli olarak "farkındalık" seviyesinde, kısa notlarla ele alınıyor; SQLite'ın stored procedure desteği olmadığı için bu konu derinlemesine işlenmeyecek).
