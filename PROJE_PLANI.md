# SQLCODEX — Proje Planı ve Teslim Dosyası

> Bu dosya, projenin şirket bilgisayarında planlanan ama kişisel bilgisayarda inşa edilecek olan tam teslim paketidir. Aşağıdaki "Yeni Bilgisayarda Başlarken" bölümündeki adımları izle.

## Bağlam

CV'de canlı proje olarak duracak, Türkiye'deki üniversite öğrencileri ve junior'lar için gerçek bir SQL öğrenme platformu inşa ediyoruz. Hedef: siteye giren biri (1) SQL'i sağlam öğrensin, (2) üniversite sınavlarına (vize/final) çalışıp yüksek alsın, (3) iş piyasasına çıktığında "SQL biliyorum" diyebilsin.

**Kesinleşen kararlar:**
- Site adı: **SQLCODEX** (eski adı: SQL Atölyesi — Faz 6a Takip Turu 2'de yeniden markalandı)
- Teknoloji: Next.js (App Router, static export) + Tailwind CSS + sql.js (SQLite WASM — tarayıcıda çalışır, sunucu/veritabanı maliyeti sıfır) + CodeMirror 6
- İlerleme: üyeliksiz, tarayıcı localStorage'da (Faz 2+ olarak ileride üyelik eklenebilir ama v1'de yok)
- Deploy: Vercel, ücretsiz katman
- Dil: UI ve anlatım tamamen Türkçe ("sen" hitabı), SQL anahtar kelimeleri İngilizce (piyasa gerçeği), MySQL/SQL Server farkları ders içi not kutularıyla belirtilecek

**Telif politikası (kritik):** Kaynak materyaller (SQLBolt, SQLZoo, DataLemur, W3Schools) birebir kopyalanmayacak. Yapı, konu sırası ve soru *tipleri* örnek alınıp tüm anlatım metinleri, alıştırmalar ve veri setleri **tamamen özgün Türkçe içerik** olarak yazılacak. Halka açık, CV'de gösterilecek bir proje için bu şart.

### Kaynak dosyaları

Bu klasörde (`kaynaklar/`):
- `moduller-seed.json` — kullanıcının verdiği 5 modüllük Türkçe içerik taslağı (içerik şemasının çekirdeği, alıştırmalar bundan genişletilerek yazılacak)
- `KAYNAK_OZET.md` — datas.docx (SQLBolt dersleri + DataLemur mülakat soruları) ve PDF'in (SQLZoo dersleri/quizleri + 60 fonksiyon referansı) detaylı analiz özeti

**Yeni bilgisayara ayrıca kopyalanması gerekenler** (orijinal büyük dosyalar, bu proje klasörüne dahil edilmedi):
- `datas.docx` (şirket bilgisayarında: Desktop'ta)
- `ilovepdf_merged_merged.pdf` (şirket bilgisayarında: Downloads'ta, 673 sayfa/65.7 MB — isteğe bağlı, `KAYNAK_OZET.md` zaten tam içerik haritasını çıkardı; dosyanın kendisi sadece ek referans/çapraz kontrol için gerekir, olmadan da devam edilebilir)

---

## Site Yapısı (8 bölüm)

1. **Ana Sayfa** — değer önerisi ("Kurulum yok. Tarayıcında gerçek SQL çalıştır. Türkçe."), yol haritası, istatistikler, CTA.
2. **/ogren** — 5 ünite, 27 ders + 5 ünite tekrarı. Ders akışı: anlatım (çalıştırılabilir örnek bloklarıyla) → 3–5 interaktif alıştırma (editör + otomatik kontrol + kademeli ipucu + çözüm) → 3–5 soruluk mini quiz → tamamlama.
3. **/pratik** — konu bazlı bağımsız soru setleri (Kolay/Orta/Zor).
4. **/sinav** — ünite quizleri + süreli **Sınav Simülasyonu** (vize/final/karma modları, sonunda konu kırılımlı karne + "bu konuyu tekrar et" linkleri).
5. **/mulakat** — gerçek mülakat sorusu tarzında, her biri kendi mini şemasıyla gelen sorular (senaryo + editör + çözüm + takip sorusu).
6. **/fonksiyonlar** — ayrı sekme: aranabilir referans, kategori sekmeli, her fonksiyon çalıştırılabilir mini örnekli, sınavda/mülakatta en çok çıkanlar "öncelikli" rozetli.
7. **/playground** — serbest sorgu alanı; örnek DB'ler arası geçiş, şema paneli, sıfırlama.
8. **/hakkinda** — proje hikâyesi, kaynaklar/ilham listesi, iletişim/GitHub + "Verilerin" (ilerleme export/import/sıfırla).

---

## Müfredat (İçerik Planı)

Her ders: `anlatim` (markdown + çalıştırılabilir örnekler + not/uyarı kutuları), örnek verinin tamamını gösteren bir önizleme tablosu (bkz. `DataPreviewTable`), 4–8 alıştırma (konu yoğunluğuna göre — basit/kavramsal derslerde taban 4, yoğun derslerde JOIN/alt sorgu/pencere fonksiyonu gibi konularda 7–8; kademeli ipuçlu), 3–5 quiz sorusu. Toplam hedef: **~150–170 alıştırma, ~120 quiz sorusu, ~80 pratik sorusu, 12–15 mülakat sorusu** (v1).

### Ünite 1 — SQL'e Giriş ve Temel Sorgulama (DB: `filmler`, `sehirler`)
| Ders | Konular |
|---|---|
| 1.1 Veritabanı Nedir? | tablo/satır/sütun, RDBMS, SQL ne işe yarar, ilk `SELECT *` |
| 1.2 SELECT ile Sütun Seçme | sütun listesi, `*`, `AS` takma ad, `DISTINCT` |
| 1.3 WHERE ile Filtreleme | karşılaştırma operatörleri, `AND/OR/NOT`, parantezleme |
| 1.4 Metin Arama ve Aralıklar | `LIKE` `%` `_`, `IN`, `BETWEEN`, `NOT` birleşimleri |
| 1.5 Sıralama ve Sınırlama | `ORDER BY` (çoklu kolon, ASC/DESC), `LIMIT/OFFSET` |
| 1.T Tekrar: Türkiye Turu | `sehirler` üzerinde 6–8 karma soru |

### Ünite 2 — Hesaplama, Özetleme, Gruplama (DB: `eticaret`)
| Ders | Konular |
|---|---|
| 2.1 İfadeler ve Hesaplamalar | aritmetik, metin birleştirme, ifadelere `AS` |
| 2.2 NULL ile Çalışmak | `IS NULL`, NULL aritmetiği/tuzakları, `COALESCE/IFNULL` tanıtımı |
| 2.3 CASE WHEN | koşullu değerler, CASE + toplulaştırma (sınav klasiği) |
| 2.4 Toplulaştırma Fonksiyonları | `COUNT/SUM/AVG/MIN/MAX`, `COUNT(*)` vs `COUNT(kolon)` |
| 2.5 GROUP BY | tek/çoklu kolon gruplama, gruplama hataları |
| 2.6 HAVING | WHERE vs HAVING (mülakat klasiği) |
| 2.7 Sorgunun Çalışma Sırası | FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT; neden WHERE'de alias olmaz |
| 2.T Tekrar: E-Ticaret Raporu | karma set |

### Ünite 3 — Çoklu Tablolar: JOIN'ler (DB: `superlig`, `okul`)
| Ders | Konular |
|---|---|
| 3.1 İlişkisel Model | PK/FK, normalizasyon sezgisi, neden tablolar bölünür |
| 3.2 INNER JOIN | ON eşleşmesi, tablo takma adları |
| 3.3 LEFT JOIN | NULL üretimi, RIGHT/FULL açıklaması, anti-join (`IS NULL`) deseni |
| 3.4 Self JOIN | hiyerarşi (çalışan–yönetici), aynı tabloyu iki kez kullanma |
| 3.5 Çok Tablolu Sorgular | 3+ tablo zinciri, JOIN + GROUP BY birlikte |
| 3.6 Küme İşlemleri | `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT` |
| 3.T Tekrar: Süper Lig Analizi | gol/maç soruları |

### Ünite 4 — Alt Sorgular ve İleri Sorgulama (DB: `eticaret`, `okul`)
| Ders | Konular |
|---|---|
| 4.1 Alt Sorgu Temelleri | WHERE içinde tek değer döndüren alt sorgu |
| 4.2 IN / EXISTS | listeyle karşılaştırma, `NOT IN` NULL tuzağı, `EXISTS` |
| 4.3 FROM'da Alt Sorgu ve Correlated | türetilmiş tablo, ilişkili alt sorgu (kategori şampiyonu deseni) |
| 4.4 Pencere Fonksiyonları I | `ROW_NUMBER/RANK/DENSE_RANK`, `OVER(PARTITION BY … ORDER BY …)` |
| 4.5 Pencere Fonksiyonları II *(İleri rozetli)* | `LAG/LEAD`, yürüyen toplam/ortalama |
| 4.T Tekrar | karma set |

### Ünite 5 — Veri ve Tablo Yönetimi (DB: `kargo`)
| Ders | Konular |
|---|---|
| 5.1 INSERT | tekli/çoklu satır, kolon listesi |
| 5.2 UPDATE | SET + WHERE, WHERE'siz UPDATE felaketi uyarısı |
| 5.3 DELETE | koşullu silme, TRUNCATE farkı (not) |
| 5.4 CREATE TABLE ve Kısıtlar | veri tipleri, PK/FK/NOT NULL/UNIQUE/DEFAULT/CHECK, AUTO_INCREMENT |
| 5.5 ALTER ve DROP | kolon ekleme/silme, tablo silme |
| 5.6 VIEW ve INDEX | kavram + CREATE VIEW/INDEX, ne zaman kullanılır |
| 5.7 SQL Injection'a Giriş | farkındalık dersi (okuma ağırlıklı): neden `' OR 1=1 --` tehlikeli, parametreli sorgu fikri |
| 5.T Tekrar: Kargo Operasyonu | karma set |

### Örnek veritabanları (6 adet, hepsi özgün Türkçe temalı — DB adı proje içi anahtar, iç tablo/sütun adları İngilizce)
1. **filmler** (DB anahtarı; tablo: `movies`) — Türk sineması (Yeşilçam + güncel): `title`, `director`, `release_year`, `duration_min`, `genre`, `rating` (~20 satır)
2. **sehirler** (DB anahtarı; tablo: `cities`) — 81 il: `region`, `population`, `plate_code`, `elevation`, `is_metropolitan` (gerçek veriler)
3. **eticaret** (DB anahtarı; tablolar: `customers`, `products`, `orders`, `order_items`) — `moduller-seed.json`'daki tablolardan genişletme
4. **superlig** — takımlar, oyuncular, maçlar, goller (İngilizce tablo/sütun adları belirlenecek, ör. `teams`, `players`, `matches`, `goals`)
5. **okul** — öğrenciler, dersler, kayıtlar (vize/final notu senaryoları — `moduller-seed.json` modül 3'ten; İngilizce tablo/sütun adları, ör. `students`, `courses`, `enrollments`)
6. **kargo** — şubeler, kuryeler, gönderiler (kullanıcının lojistik projesine tematik selam; İngilizce tablo/sütun adları, ör. `branches`, `couriers`, `shipments`)

**Dil kuralı (kritik, Faz 2'de netleşti):** SQL tablo/sütun adları **İngilizce** yazılır (ör. `products`, `price`, `stock_quantity`) — gerçek şirket veritabanlarının büyük çoğunluğu İngilizce şema kullanır, SQL anahtar kelimeleri zaten İngilizcedir. Veri **değerleri** (kategori adları, durum metinleri, şehir/film adları vb.) ve anlatım/soru/ipucu/quiz metninin tamamı Türkçe kalır — `soru`, `ipucu`, `cozumSql` gibi içerik şeması alan adları (TypeScript tarafı) da Türkçe kalır, bu kural sadece SQL DDL kimliklerini kapsar. Faz 3'ün `superlig`/`okul`/`kargo` veritabanları da baştan bu standartla yazılacak.

Diğer kurallar: tablo başına 10–50 satır (göz ile doğrulanabilir), tarihler ISO `YYYY-MM-DD`, Türkçe büyük/küçük harf tuzağına (SQLite `UPPER`/`LIKE` ASCII sınırı — 'ı'→'I' dönüşmez) veri değerleri yazarken dikkat.

### /pratik setleri (~8 set × 8–12 soru)
SELECT temelleri · Filtreleme · Toplulaştırma+GROUP BY · JOIN'ler · Alt sorgular · Pencere fonksiyonları · DML/DDL · Zorlu Karışık (her soru Kolay/Orta/Zor etiketli).

### /sinav içeriği
- **Ünite quizleri:** ünite başına 10–15 çoktan seçmeli; soru tipleri: "bu sorgunun çıktısı nedir", "doğru sorguyu seç", "hatayı bul", "eşleştir".
- **Sınav Simülasyonu:** varsayılan 20 soru / 25 dk; modlar: Vize (Ünite 1–3), Final (tümü), Özel. Süre mutlak deadline ile tutulur, yenilemeye dayanıklı (sessionStorage). Karne: toplam skor + konu kırılımı barları + yanlış analizi + ders linkleri. Geçmiş sınavlar localStorage'da (son 20).

### /mulakat soruları (v1: 12–15 soru, DataLemur tarzının Türkçe uyarlaması)
Kurgusal Türk şirket senaryoları ("bir e-ticaret devi", "bir sosyal medya uygulaması", "bir kargo şirketi"…). Örnek plan:
- **Kolay:** Hiç beğeni almamış sayfalar (anti-join) · Teslim edilmemiş gönderiler (IS NULL) · Mükerrer kayıt bulma (GROUP BY+HAVING)
- **Orta:** Departman ortalaması üstü maaş (correlated) · Aylık aktif kullanıcı (tarih gruplama) · Kategori şampiyonu ürün (window/correlated) · Yüzde hesabı (CAST tuzağı)
- **Zor:** 3 günlük yürüyen ortalama (window frame) · Ay bazında geri dönen kullanıcı (LAG/self join) · Üst yönetici raporu (self join + GROUP BY) · Ardışık gün harcama serisi

Her soru: senaryo + kendi mini DDL'i + kademeli ipuçları + çözüm + açıklama + "takip sorusu" (mülakat klasiği "peki ya…?"). Beklenen çıktı, çözüm SQL'i çalıştırılarak runtime'da gösterilir (elle yazılmaz — tek kaynak ilkesi).

### /fonksiyonlar sekmesi (~50 kayıt; PDF'teki SQLZoo referansı kapsam listesi — bkz. `kaynaklar/KAYNAK_OZET.md`)
- **Metin:** LENGTH, SUBSTR, UPPER/LOWER, TRIM/LTRIM/RTRIM, REPLACE, INSTR, `||` (CONCAT)
- **Sayısal:** ROUND, ABS, CEIL/FLOOR, MOD/%, POWER, RANDOM
- **Tarih:** DATE, STRFTIME, CURRENT_DATE/TIMESTAMP, tarih aritmetiği; MySQL karşılıkları (YEAR, MONTH, DATEDIFF, DATE_FORMAT) not alanında
- **NULL/Koşul:** COALESCE, IFNULL, NULLIF, CASE
- **Toplulaştırma:** COUNT, SUM, AVG, MIN, MAX, GROUP_CONCAT

Her kayıt: söz dizimi + açıklama + çalıştırılabilir mini örnek + `digerVeritabanlari` notu + `oncelikli` rozeti. Türkçe-normalize istemci tarafı arama.

---

## Teknik Mimari

**Stack:** Next.js güncel stable (App Router, TS, `output:'export'`, `trailingSlash:true`), Tailwind v4, `next-themes` (dark/light), sql.js, CodeMirror 6 (granüler paketler, ~100 satırlık kendi wrapper'ımız), `react-markdown` (server-only render), vitest.

**Klasör yapısı:**
```
app/            layout, page (ana sayfa), ogren/[dersSlug], pratik/[setSlug],
                sinav/{[konuSlug],simulasyon}, mulakat/[soruSlug], fonksiyonlar,
                playground, hakkinda, sitemap.ts, robots.ts
components/     layout/ sql/ (SqlEditor, RunnableExample, ExerciseCard, ResultTable,
                SchemaPanel, QueryError) quiz/ (QuizRunner, ExamSimulation, ReportCard)
                lesson/ progress/ markdown/ ui/
content/        databases/ lessons/unite-1..5/ practice/ exams/ interview/ functions/
lib/            sql/ (engine, db, grader, errors-tr, schema) editor/ progress/ utils
types/content.ts   scripts/ (copy-sqljs, validate-content)   tests/   public/vendor/sqljs-x.y.z/
```

**Kritik teknik kararlar:**

1. **sql.js bundler'a sokulmaz** — `dist/sql-wasm.{js,wasm}` `public/vendor/sqljs-<sürüm>/` altına kopyalanır (predev/prebuild script), script-tag + `window.initSqlJs` ile yüklenir. Webpack/Turbopack wasm konfigürasyon derdi sıfır; wasm (~500 KB br) sayfa bundle'ı dışında, `vercel.json` ile immutable cache.
2. **Promise-singleton engine** (`lib/sql/engine.ts`) — StrictMode çift-effect'e dayanıklı; tüm `window` erişimi effect/handler içinde (client component'ler de build'de prerender edilir!).
3. **Snapshot DB fabrikası** (`lib/sql/db.ts`) — DDL bir kez kurulur, `db.export()` Uint8Array cache; her "Çalıştır"/grade taze kopya açar, `finally{close()}` (wasm heap sızıntısı önlemi). Playground istisna: oturum boyu yaşar + Sıfırla butonu.
4. **Autograder** (`lib/sql/grader.ts`, saf fonksiyon — vitest'le test edilir):
   - Mod `'sonuc'`: kolon sayısı → satır sayısı → tip-etiketli hücre normalizasyonu (null/string/int/float-toleranslı) → `siralamaOnemli` ise sıralı, değilse multiset karşılaştırma. Kolon adları varsayılan serbest (`kolonAdiOnemli` alias derslerinde açılır). "İçerik doğru ama sıra farklı" özel mesajı.
   - Mod `'tabloDurumu'` (INSERT/UPDATE/CREATE dersleri): kullanıcı ve çözüm ayrı DB'lerde koşturulur, sonra `dogrulamaSorgulari` (ya da otomatik tam-durum: sqlite_master + tüm tablolar + pragma_table_info) iki DB'de karşılaştırılır.
   - Hatalar `errors-tr.ts` regex tablosuyla Türkçeleştirilir, orijinal mesaj altta gösterilir.
5. **İçerik TS dosyalarında** (`defineLesson` helper'larıyla; şema alan adları Türkçe: `soru`, `ipucu`, `cozumSql`) — tipler `types/content.ts`: `Lesson/Exercise/QuizQuestion/PracticeSet/InterviewQuestion/FunctionRef/SampleDatabase`. `moduller-seed.json` şemasının evrimleşmiş hali.
6. **`scripts/validate-content.ts` = kalite sigortası:** tüm DDL'leri kurar, tüm örnek/çözüm/doğrulama SQL'lerini çalıştırır, slug/id/dogruIndex kontrolleri; `npm run check` (tsc + vitest + validate) CI'da build öncesi zorunlu. İçerik hatası prod'a inemez.
7. **RSC sınırı = SEO:** ders anlatımı server component'te render → statik HTML'de tam metin (Google JS'siz görür); client'a yalnızca o sayfanın verisi prop geçer. `generateStaticParams` + `generateMetadata` + sitemap/robots + JSON-LD (`LearningResource`) + `next/font` `latin-ext` (Türkçe karakter şart).
8. **İlerleme:** `sqlatolyesi.progress.v1` anahtarı, `ProgressProvider` (context + storage event ile sekme senkronu + `mounted` bayrağıyla hydration güvenliği + safeStorage fallback + migrasyon zinciri). `'cozuldu' | 'cozumGoruldu'` ayrımı — çözüme bakan "çözdü" sayılmaz, karne dürüst kalır. Export/import JSON.
9. **Mobil:** editör font ≥16px (iOS zoom önlemi), alıştırmalar akordeonda tek-açık (sayfada tek canlı editör), "Çalıştır" butonu sticky, gerçek cihaz testi her fazda.
10. **Bilinen sınırlar (v1 kabul):** `db.exec` main-thread (küratörlü içerik + minik DB'lerle risk düşük; Web Worker post-MVP), çözümler bundle'da görünür (öğrenme sitesi için sorun değil).

---

## Uygulama Fazları

> Önkoşul: Node.js LTS kur/doğrula, `git init` + GitHub repo + Vercel bağlantısı. **Bu adım tamamlandı** — bkz. "Mevcut Durum" bölümü.

- ✅ **TAMAMLANDI — Faz 0 — İskele + yayın hattı:** create-next-app (TS/Tailwind/App Router), config (export/trailingSlash), tema + layout kabuğu + tüm rotaların boş sayfaları, copy-sqljs script, vercel.json, ilk deploy.
  *Doğrulama geçti: `npm run build` → `out/`; site Vercel'de canlı; tema geçişi FOUC'suz.*
- ✅ **TAMAMLANDI — Faz 1 — Çekirdek dikey dilim:** engine + db + `eticaret` DB'si; SqlEditor + ResultTable + QueryError + SchemaPanel; grader + errors-tr (vitest); tek gerçek ders uçtan uca.
  *Doğrulama geçti: vitest yeşil; manuel senaryolar; statik çıktı testi; mobil viewport.*
- ✅ **TAMAMLANDI — Faz 2 — İçerik altyapısı + Ünite 1–2:** tipler + defineLesson + ders şablon sayfası (akordeon alıştırmalar, mini quiz, tamamlama, önceki/sonraki), ProgressProvider, validate-content + `npm run check`; Ünite 1–2'nin tüm dersleri/alıştırmaları/quizleri + `filmler`, `sehirler`, `eticaret` DB'leri. Ek olarak: alıştırma sayısı politikası 4–8'e çıkarıldı, `DataPreviewTable` (zebra tablo tasarımı) eklendi, **tüm SQL tablo/sütun adları İngilizceye çevrildi** (veri değerleri Türkçe kaldı — bkz. "Örnek veritabanları" bölümündeki dil kuralı).
  *Doğrulama geçti: `npm run check` yeşil (14/14 ders); ilerleme kalıcı; tarayıcıda uçtan uca test edildi.*
- ✅ **TAMAMLANDI — Faz 3 — Ünite 3–5 + /pratik:** `superlig` (takım/oyuncu/maç/gol), `okul` (öğretmen/öğrenci/ders/kayıt — self-join için bölüm başkanlığı hiyerarşisi dahil) ve `kargo` (şube/kurye/gönderi) DB'leri eklendi. Ünite 3 (7 ders: İlişkisel Model, INNER/LEFT/Self JOIN, Çok Tablolu Sorgular, Küme İşlemleri, tekrar), Ünite 4 (6 ders: Alt Sorgu Temelleri, IN/EXISTS, FROM'da Alt Sorgu ve Correlated, Pencere Fonksiyonları I-II, tekrar) ve Ünite 5 (8 ders: INSERT, UPDATE, DELETE, CREATE TABLE ve Kısıtlar, ALTER/DROP, VIEW/INDEX, SQL Injection'a Giriş, tekrar) tamamlandı — toplam 35 ders. `/pratik` sayfası hayata geçirildi: `types/content.ts`'e `PracticeSet` tipi eklendi, `app/pratik/[setSlug]/page.tsx` (ExerciseCard/AlistirmalarAkordeonu yeniden kullanılarak) oluşturuldu, 8 konu bazlı set (SELECT temelleri, Filtreleme, Toplulaştırma+GROUP BY, JOIN'ler, Alt Sorgular, Pencere Fonksiyonları, DML/DDL, Zorlu Karışık) toplam 80 soruyla eklendi. `scripts/validate-content.ts` artık pratik setlerini de doğruluyor (alıştırma id benzersizliği ders+pratik genelinde kontrol ediliyor). Unite 5'in DML/DDL alıştırmaları `tabloDurumu` autograder modunu, VIEW/INDEX alıştırmaları oluştur+doğrula deseniyle `sonuc` modunu kullanıyor.
  *Doğrulama geçti: `npm run check` yeşil (35 ders + 8 pratik seti); `npm run build` ile 57 statik sayfa üretildi; tarayıcıda uçtan uca test edildi (JOIN alıştırması, çoklu ifadeli CREATE INDEX+PRAGMA alıştırması, mobil+dark mode, ilerleme kalıcılığı).*
- ✅ **TAMAMLANDI — Faz 4 — /sinav + /mulakat:** `types/content.ts`'e `ExamQuestion` ve `InterviewQuestion` eklendi; `lib/exam/` (types, store — sessionStorage oturum + localStorage geçmiş son 20, pool — havuz seçimi + saf değerlendirme, birim testli) kuruldu. `components/quiz/QuizRunner.tsx` (ünite quizi), `ExamSimulation.tsx` (Vize/Final/Özel mod, mutlak deadline sayaç, soru paleti, sessionStorage ile yenilemeye dayanıklı, süre bitince otomatik teslim), `ReportCard.tsx` (skor + konu kırılımı barları + yanlış analizi + "bu konuyu tekrar et" ders linkleri) yazıldı. `components/interview/InterviewCard.tsx`, ExerciseCard desenini kademeli ipuçları (dizi) ve kendi özgün mini DDL'i (soru.slug databaseId olarak) ile genişletir. Rotalar: `/sinav` (hub), `/sinav/[konuSlug]` (ünite quizi), `/sinav/simulasyon`, `/mulakat` (liste), `/mulakat/[soruSlug]` (detay). İçerik: 5 ünite × 12 soru = 60 sınav sorusu (çıktı nedir/doğru sorguyu seç/hatayı bul/eşleştir tarzları karışık, her soruda konu+dersSlug); 13 mülakat sorusu (4 Kolay, 5 Orta, 4 Zor — kurgusal Türk şirket senaryoları, her biri özgün şema+veri+kademeli ipucu+takip sorusuyla, ör. CAST tuzağı, 3 günlük yürüyen ortalama, self-join ile ay bazlı retention). `scripts/validate-content.ts` artık sınav+mülakat içeriğini de kapsıyor (dogruIndex sınırları, dersSlug referansları, mülakat DDL/çözüm SQL çalıştırma).
  *Doğrulama geçti: `npm run check` yeşil (27 test, 35 ders + 8 pratik seti + 60 sınav sorusu + 13 mülakat sorusu); `npm run build` ile 75 statik sayfa üretildi; tarayıcıda uçtan uca test edildi — sınav simülasyonu başlatıldı, cevap verildi, sayfa yenilendi (oturum ve cevap korundu, sayaç doğru geri saydı), sınav bitirildi, karne (skor/konu kırılımı/yanlış analizi/ders linkleri) doğru render oldu, geçmiş sınav localStorage'da göründü; ünite quizi ve mülakat sorusu (CAST tuzağı hem yanlış hem doğru sürümüyle) autograder'da doğru derecelendirildi; mobil+dark mode sorunsuz.*
- ✅ **TAMAMLANDI — Faz 5 — /fonksiyonlar + /playground:** `types/content.ts`'e `FunctionRef` eklendi; `bosDb` (tablosuz, sadece SELECT ile fonksiyon test etmek için) yeni bir örnek veritabanı olarak eklendi, `content/databases/index.ts` artık `TUM_VERITABANLARI`'yı da export ediyor. `lib/search/turkce.ts` — `toLocaleLowerCase('tr-TR')` tabanlı Türkçe-doğru normalizasyon (İ→i, I→ı; JS'in locale-siz toLowerCase'i bunu yanlış yapar), birim testli. `components/sql/SchemaPanel.tsx`'ten salt-render `SchemaList` bileşeni çıkarıldı (Playground'da canlı şema göstermek için yeniden kullanılıyor). `components/functions/FunctionExplorer.tsx` (arama kutusu + 5 kategori sekmesi + RunnableExample listesi, Öncelikli rozeti) ve `components/playground/Playground.tsx` (DB seçici, `getSqlJs` ile oturum boyu yaşayan TEK canlı DB örneği — diğer tüm alıştırma yüzeylerinin aksine her sorguda taze DB açmaz, Sıfırla DDL'den yeniden kurar, şema paneli her sorgudan sonra canlı güncellenir) yazıldı. İçerik: 47 fonksiyon kaydı (Metin 14, Sayısal 9, Tarih 10, NULL/Koşul 7, Toplulaştırma 7) — her biri sözdizimi+açıklama+çalıştırılabilir örnek+digerVeritabanlari notu; sql.js'te desteklenmeyenler (MOD(), CEILING(), CONCAT(), LEFT(), RIGHT()) doğrulanıp SQLite karşılığıyla (%, CEIL, ||, SUBSTR) gösterildi, desteklenenler (POWER, SQRT, IIF, skaler MAX/MIN, TOTAL, TYPEOF) test edilerek eklendi. `scripts/validate-content.ts` fonksiyon referanslarını da kapsıyor.
  *Doğrulama geçti: `npm run check` yeşil (34 test, +47 fonksiyon kaydı); `npm run build` ile statik export sorunsuz. Tarayıcıda uçtan uca test edildi — arama Türkçe 'ı/i' duyarlılığı canlı doğrulandı ("KISA" araması "kısa" geçen IFNULL/IIF kayıtlarını doğru buldu), kategori filtreleme ve örnek çalıştırma çalıştı; Playground'da DB değiştirme (editör+şema+açıklama güncellendi), INSERT'in oturum boyunca kalıcılığı (sonraki SELECT'te göründü, UNIQUE ihlali doğru yakalandı), Sıfırla'nın veriyi DDL'den temizlemesi ve Türkçe karakterlerin (ı) doğru işlenmesi doğrulandı; mobil+dark mode sorunsuz.*
- ✅ **TAMAMLANDI — Faz 6a — Görsel/UX Yenileme:** Kullanıcının canlı site geri bildirimi üzerine hazırlanan plan (`C:\Users\yunus\.claude\plans\ren-k-sm-kutulu-bir-partitioned-hare.md`) baştan sona uygulandı, işlev değişmedi. (1) `app/globals.css`'e krem (`#faf8f3`) / koyu-antrasit (`#14110d`) renk tokenleri, proje genelinde `zinc-*` → `stone-*` mekanik geçiş, birincil aksiyon butonları mavi (`blue-600`/dark `blue-500`), "Çalıştır" butonları yeşil (`green-600`). (2) `@lezer/highlight` ile `lib/editor/sqlTema.ts` (açık mod SQL syntax highlighting teması), `SqlEditor` light/dark reconfigure, yeni salt-okunur `components/sql/SqlCodeBlock.tsx` (RunnableExample/ExerciseCard/InterviewCard çözüm gösterimi + ders anlatım markdown'ındaki ```sql``` blokları). (3) `lib/ui/seviye.ts` paylaşılan Kolay/Orta/Zor rozet+kenarlık renkleri (AlistirmalarAkordeonu + mülakat kartları). (4) MiniQuiz/QuizRunner/ExamSimulation'da seçili-ama-gönderilmemiş seçenek artık dolgu+kenarlık (`border-blue-500 bg-blue-50`). (5) Alıştırma akışı yumuşak yönlendirme: sıradaki ilk çözülmemiş soru varsayılan açık, doğru cevap sonrası otomatik sıradakine geçiş (`ExerciseCard` `onDogruCozuldu` prop), manuel tıklama her zaman serbest — hem `/ogren/[dersSlug]` hem `/pratik/[setSlug]`'ı kapsıyor. (6) Playground DB seçici büyütüldü. (7) `/ogren`: `lib/content/uniteler.ts` paylaşılan ünite başlıkları, yeni `UniteListesi` bileşeni ile 5 ünite kutusu (aynı sayfada aç/kapa, ilerleme özeti, URL değişmiyor). (8) "Sınav" → "Test Sınavı" (nav linki, `/sinav` ve `/sinav/simulasyon` başlık/metinleri; rotalar aynı kaldı). (9) Mülakat kartları seviyeye göre `border-l-4` + shadow + büyütülmüş başlık.
  *Doğrulama geçti: `npm run check` yeşil (34 test, 35 ders + 8 pratik seti + 60 sınav sorusu + 13 mülakat sorusu + 47 fonksiyon kaydı); `npm run build` ile 75 statik sayfa sorunsuz üretildi. Tarayıcıda uçtan uca test edildi — açık mod (`#faf8f3`/`#1c1917`) ve karanlık mod (`#14110d`/`#f5f5f4`) arka plan/metin renkleri doğrulandı, SQL syntax highlighting canlı sorgulandı (SELECT/FROM mavi, virgül nötr), `/ogren`'de ünite kutusu tıklanıp URL değişmeden genişlediği doğrulandı, bir derste alıştırma doğru çözülünce ✓ ile kapanıp sıradaki sorunun otomatik açıldığı uçtan uca doğrulandı, `/mulakat` kartlarının seviyeye göre renkli sol kenarlıkla render olduğu, Playground DB seçicinin büyüdüğü, `/sinav` ve `/sinav/simulasyon` başlıklarının "Test Sınavı" olduğu, mobil (375px) genişlikte hiçbir sayfada yatay taşma olmadığı doğrulandı.*
- ✅ **TAMAMLANDI — Faz 6a Takip — Görsel/UX İnce Ayar:** Kullanıcının Faz 6a sonrası ikinci tur, 8 ekran görüntülü geri bildirimi üzerine hazırlanan plan (`C:\Users\yunus\.claude\plans\1-1-foto-rafta-g-r-yorsun-ki-woolly-taco.md`) uygulandı, işlev değişmedi. (1) Yeni `lib/editor/formatSql.ts` — hafif dokunuşlu SQL biçimlendirici (genel amaçlı kütüphaneler yerine özel yazıldı): kısa sorgular tek satırda kalır, uzun sorgularda sadece ana klozlardan (WHERE/GROUP BY/HAVING/ORDER BY/JOIN/UNION/...) önce satır kırılır (`SELECT ... FROM ...` bir arada kalır), `CREATE TABLE` gövdesi sütun sütun ayrılır; `SqlCodeBlock`'ta kullanılıyor, 6 birim testi var. (2) Kart yüzeyi kararı ("yumuşak ton farkı"): kutulanmış tüm öğelere (akordeon satırları, quiz/liste kartları, şema paneli, editör/kod bloğu, fonksiyon kartları) `bg-stone-50 dark:bg-stone-900` (+ tıklanabilir olanlara `hover:bg-stone-100 dark:hover:bg-stone-800`) eklendi; iç içe geçen yerlerde (ör. ünite kutusu içindeki ders satırı, editör/kod bloğu) bir üst tonun (`bg-white dark:bg-stone-950`) kullanılmasıyla katmanlar birbirinden ayrıştı. (3) "← Tüm sınavlar/pratik setleri/mülakat soruları" geri linkleri buton haline getirildi. (4) `AlistirmalarAkordeonu`: ziyaret edilen alıştırmalar artık kapanınca unmount edilmiyor, `hidden` ile gizleniyor — CodeMirror örneği canlı kaldığı için başka soruya geçip geri dönünce yazılan sorgu/sonuç silinmiyor. (5) "İpucu göster"/"Çözümü göster" metin-linkleri butona çevrildi (amber/yeşil), ipucu kutusu turuncu tona (`bg-orange-50`) geçti, `SqlCodeBlock`'a `cozum?: boolean` prop'u eklenip true olduğunda yeşil çerçeve/hafif yeşil arka plan uygulanıyor (sadece "çözümü göster" çağrılarında — örnek/anlatım kod blokları nötr kaldı). (6) Ders ve pratik sayfalarındaki `<section>` blokları (Örnekler/Örnek Veri/Alıştırmalar/Mini Quiz/Sorular) `rounded-2xl border shadow-sm` çerçeveye alındı, başlıklara mavi aksan çubuğu eklendi. (7) Playground "Sıfırla" butonlaştırıldı.
  *Doğrulama geçti: `npm run check` yeşil (40 test, tüm içerik); `npm run build` ile 75 statik sayfa sorunsuz üretildi. Tarayıcıda uçtan uca test edildi — uzun bir WHERE'li sorgunun kullanıcının verdiği örnekle birebir aynı şekilde (`SELECT title FROM movies` / `WHERE (...)`) iki satıra bölündüğü doğrulandı; bir alıştırmaya sorgu yazıp başka bir alıştırmaya geçip geri dönünce sorgunun editörde durduğu ve ardından doğru cevap sonrası otomatik sıradaki soruya geçişin hâlâ çalıştığı uçtan uca doğrulandı; İpucu/Çözüm butonlarının renkleri, turuncu ipucu kutusu ve yeşil çerçeveli çözüm kod bloğu; "← Tüm sınavlar" linkinin buton stiline döndüğü; bölüm çerçevelerinin (Örnekler/Alıştırmalar/Mini Quiz) doğru render olduğu; karanlık modda arka plan/kenarlık renklerinin doğru olduğu; mobilde (375px) hiçbir sayfada yatay taşma olmadığı doğrulandı.*
- ✅ **TAMAMLANDI — Faz 6a Takip Turu 2 — Bug Fix + Navigasyon Cilası + Header/Marka Yenileme:** Kullanıcının Faz 6a Takip sonrası üçüncü tur geri bildirimi üzerine hazırlanan plan (`C:\Users\yunus\.claude\plans\1-1-foto-rafta-g-r-yorsun-ki-woolly-taco.md`) uygulandı, işlev değişmedi (bug fix hariç, o da sadece UX akışı). (1) Alıştırma akordeonunda "çözümü gördükten sonra doğru cevap verilince sıradakine geçmeme" hatası düzeltildi (`onDogruCozuldu` artık kalıcı `cozumGoruldu` durumuna değil dizi sırasına göre ilerliyor). (2) Yeni `components/ui/ChevronIcon.tsx` (kalın SVG ok) — "Tüm sınavlar/pratik setleri/mülakat soruları" geri linkleri (4 yer, `/sinav/[konuSlug]` dahil — daha önce atlanmıştı) ve ders önceki/sonraki navigasyonu bu ikonu kullanan buton stiline geçti; sınav Önceki/Sonraki/Sınavı Bitir butonlarından ok karakteri kaldırılıp `select-none` eklendi. (3) **Header yeniden tasarımı:** `components/layout/Header.tsx` client component'e çevrildi, `sticky top-4` + `rounded-full` + kalın kenarlık (`border-2 border-stone-800 dark:border-stone-200`) ile sayfa kenarından boşluklu "yüzen hap" konteynerine geçti; `usePathname()` ile aktif sayfa altında mavi alt çizgi vurgusu eklendi; `ThemeToggle` `rounded-full` yapıldı. (4) **SQLCODEX marka değişikliği:** "SQL Atölyesi" adı 7 yerde (Header, Footer, `app/layout.tsx` metadata, ana sayfa, ders 1.1 hoş geldin metni, `package.json`/`package-lock.json` `name` alanı, bu dosya) "SQLCODEX" olarak güncellendi — `content/functions/metin.ts`'teki örnek veri kullanımları bilinçli olarak dışarıda bırakıldı (marka değil, string fonksiyonu örneği); GitHub repo adı ve Vercel canlı adresi de kapsam dışı (hesap/altyapı seviyesinde, ayrı iş). (5) **Logo entegrasyonu:** kullanıcının verdiği `SqlCodex.svg` aslında gerçek vektör değil, biri renk/metin biri de luminance-tabanlı alfa maskesi için kullanılan iki gömülü PNG'yi SVG `<mask>`/`feColorMatrix` ile birleştiren bir kapsayıcıydı; her iki PNG de tek başına opaktı (şeffaflık yoktu) — doğru şeffaf logo, `sharp` ile SVG'nin luminance-maskeleme matematiği (alfa = 0.2126R+0.7152G+0.0722B) elle uygulanarak iki gömülü görüntüden yeniden birleştirildi. Sonuç: koyu çizgi sanatı + yeşil vurgu noktalı, şeffaf arka planlı ikon (`public/sqlcodex-icon.png`, header rozetinde açık renkli daire arka plan üzerinde kullanılıyor — karanlık modda da okunur) ve `app/icon.png` (aynı ikon, favicon için beyaz arka plana düzleştirilmiş, eski `app/favicon.ico` kaldırıldı). Kullanılmayan/yanlış ara dosyalar (`public/logo-sqlcodex.svg`, bozuk ilk `sqlcodex-icon.png` denemesi, maske-kaynağı `sqlcodex-icon-raw.png`) silindi; `public/sqlcodex-logo-full.png` (ikon+"SQLCODEX" yazılı tam logo, şeffaf) ileride (Faz 6b OG görseli/README) kullanılabilecek şekilde saklandı.
  *Doğrulama geçti: `npm run check` yeşil (40 test, tüm içerik); `npm run build` ile 75 statik sayfa (yeni `/icon.png` route'u dahil) sorunsuz üretildi. Tarayıcıda uçtan uca test edildi — header'ın açık/karanlık modda hap şeklinde, kalın kenarlıklı render olduğu; aktif sayfada (`/ogren`) nav linkinin mavi alt çizgiyle vurgulandığı, diğerlerinin vurgusuz kaldığı (computed style ile doğrulandı); logo görselinin 404 vermeden yüklendiği; karanlık modda rozet arka planının açık renkte sabit kalıp logo çizgi sanatının okunur kaldığı; sekme başlığının "SQLCODEX" / "Öğren — SQLCODEX" şeklinde doğru template'lendiği; mobilde (375px) header dahil hiçbir yerde yatay taşma olmadığı; "SQL Atölyesi" metninin `content/functions/metin.ts` ve bu dosyanın bilinçli olarak korunan tarihi bölümleri (başlangıç promptu, Site adı kararının eski-ad notu) dışında hiçbir yerde kalmadığı doğrulandı.*
- ⬜ **SIRADA — Faz 6b — Ana sayfa + cila + yayın:** ana sayfa/hakkında, SEO tamamlama (metadata/sitemap/JSON-LD/OG görseli), a11y turu, bundle analizi, Lighthouse ≥95 hedefi, README (mimari + ekran görüntüleri + canlı link — CV varlığı), Search Console'a sitemap.
  *Doğrulama: Lighthouse; gerçek kullanıcı testi.*

## Mevcut Durum (2026-08-07 itibarıyla)

- **Canlı site:** https://sql-atolyesi-ebon.vercel.app
- **GitHub:** https://github.com/yunusemrekoklu/sql-atolyesi (public, `master` branch, Vercel'e bağlı — her push otomatik deploy tetikler)
- **Yerel proje kökü:** `C:\Users\yunus\OneDrive\Masaüstü\SQL_Website`
- **İçerik durumu:** Ünite 1-5 tamamlandı — 35 ders (Ünite 1: 6, Ünite 2: 8, Ünite 3: 7, Ünite 4: 6, Ünite 5: 8), hepsi alıştırma+mini quiz+önizleme tablosuyla. `/pratik` sayfası 8 set × 10 soru (80 soru) ile tamamlandı. `/sinav` (5 ünite × 12 soru = 60 sınav sorusu + süreli Sınav Simülasyonu) ve `/mulakat` (13 soru, kendi özgün mini şemalarıyla) tamamlandı. `/fonksiyonlar` (47 kayıt, aranabilir) ve `/playground` (6 DB arası geçiş, oturum boyu kalıcı sorgu alanı) tamamlandı. 7 örnek veritabanı hazır: `eticaret`, `filmler`, `sehirler`, `superlig`, `okul`, `kargo`, `bos`. Faz 6a (görsel/UX yenileme), takip turu (ikinci geri bildirim) ve takip turu 2 (bug fix + navigasyon cilası + header/marka yenileme — site artık **SQLCODEX**) tamamlandı. Sırada Faz 6b (Ana sayfa + cila + yayın) var.
- **Kritik alışkanlık:** İçerik eklerken/değiştirirken her zaman `npm run validate-content` (veya `npm run check`) çalıştır — tüm ders/pratik SQL'lerini gerçek sql.js ile çalıştırıp hataları build'den önce yakalar.

## Genel Doğrulama

Her fazda: `npm run check` (tsc + vitest + validate-content) → `npm run build` → tarayıcıda canlı test (editörde sorgu çalıştırma, quiz çözme, mobil viewport + dark mode) → Vercel preview. Grader ve errors-tr birim testli; içerik SQL'lerinin tamamı build öncesi otomatik çalıştırılıyor.

## Kritik dosyalar (uygulama sırasında öncelik)

- `lib/sql/engine.ts` — wasm singleton (tüm sql.js erişiminin tek kapısı)
- `lib/sql/grader.ts` — autograder (projenin kalbi)
- `components/sql/SqlEditor.tsx` — CodeMirror wrapper
- `types/content.ts` — içerik tip sözleşmesi
- `app/ogren/[dersSlug]/page.tsx` — server/client sınırı referans deseni
- `scripts/validate-content.ts` — içerik kalite sigortası
- `content/databases/*.ts` — 6 örnek veritabanı (tek gerçek kaynak: DDL)

---

## Yeni Bilgisayarda Başlarken

1. **Bu klasörü taşı:** `SQL_Website` klasörünün tamamını (bu plan + `kaynaklar/`) kişisel bilgisayarına kopyala (USB, bulut, Git — hangisi kolaysa). İstersen `kaynaklar/` içine `datas.docx` ve PDF'i de ekle (zorunlu değil, `KAYNAK_OZET.md` yeterli özet çıkardı).
2. **Node.js LTS kur:** https://nodejs.org adresinden (veya `winget install OpenJS.NodeJS.LTS`). Kurulumdan sonra yeni bir terminal aç, `node -v` ve `npm -v` ile doğrula.
3. **Git kontrolü:** `git --version` — yoksa https://git-scm.com'dan kur.
4. **Claude Code'u proje klasöründe aç** ve aşağıdaki başlangıç promptunu yapıştır.

### Başlangıç Promptu (kopyala-yapıştır)

```
Bu klasörde PROJE_PLANI.md adında, önceden onaylanmış detaylı bir proje planı var —
"SQL Atölyesi" adında Türkçe bir SQL öğrenme platformu inşa edeceğiz (Next.js +
Tailwind + sql.js/SQLite WASM + CodeMirror 6, static export, Vercel'e deploy).
kaynaklar/ klasöründe de içerik kaynak dosyaları var (moduller-seed.json ve
KAYNAK_OZET.md).

Önce PROJE_PLANI.md ve kaynaklar/KAYNAK_OZET.md dosyalarını oku. Plan zaten
onaylandı, tekrar planlamaya gerek yok — doğrudan "Faz 0"dan başlayarak
uygulamaya geç:

1. Bu makinede Node.js, npm ve git kurulu mu kontrol et.
2. create-next-app ile projeyi bu klasörde kur (TypeScript, Tailwind, App Router,
   ESLint) — PROJE_PLANI.md'deki klasör yapısına ve next.config.ts ayarlarına
   (output: 'export', trailingSlash: true) sadık kal.
3. git init yap, ardından GitHub'da repo oluşturmam ve Vercel'e bağlamam için
   bana adımları söyle (bu ikisi benim onayımı gerektiren hesap işlemleri).
4. Faz 0'ı tamamla: tema + layout kabuğu + tüm rotaların boş sayfaları +
   sql.js kopyalama scripti + vercel.json.
5. Faz 0 bittiğinde bana durumu raporla, sonra Faz 1'e (çekirdek: sql.js motoru +
   CodeMirror editör + otomatik değerlendirme + tek gerçek ders uçtan uca) geç.

Her fazın sonunda PROJE_PLANI.md'deki "Doğrulama" adımlarını çalıştır ve bana
kısaca sonucu bildir. Faz sırası ve mimari kararlar plan dosyasında net —
sapman gereken bir durum olursa önce bana sor.
```

---

*Bu dosya, şirket bilgisayarında yapılan kaynak analizi ve mimari planlama oturumunun tam çıktısıdır (2026-08-04). Kaynak dosyaların derinlemesine incelenmesi (datas.docx tam metin çıkarımı, PDF'in 304 sayfalık haritası, JSON şema analizi) ve teknik mimarinin bir Plan ajanı tarafından tasarlanması bu oturumda tamamlandı.*
