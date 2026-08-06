import { defineLesson } from "@/types/content";
import { okulDb } from "@/content/databases/okul";

export const pencereFonksiyonlari1 = defineLesson({
  slug: "pencere-fonksiyonlari-1",
  uniteId: 4,
  dersNo: "4.4",
  baslik: "Pencere Fonksiyonları I",
  veritabaniId: okulDb.id,
  anlatim: `
\`GROUP BY\`, satırları gruplayıp özetlerken tek tek satırları **kaybettirir** — 34 kayıt, \`GROUP BY course_id\` sonrası 10 satıra iner. **Pencere fonksiyonları (window functions)**, satırları kaybetmeden her satıra "kendi grubundaki konumunu" ekler.

## OVER() ve PARTITION BY

\`\`\`sql
SELECT student_id, final_grade,
       ROW_NUMBER() OVER (ORDER BY final_grade DESC) AS sira
FROM enrollments
WHERE course_id = 1;
\`\`\`

- \`OVER(...)\`, bir pencere fonksiyonunun hangi satır kümesi ve sırası üzerinde çalışacağını tanımlar.
- \`PARTITION BY course_id\` eklersen, satırlar \`course_id\`'ye göre gruplara ayrılır — \`GROUP BY\`'a benzer, ama satırlar **tek tek korunur**; sadece her grup için sıralama sıfırdan başlar.
- \`OVER\` içindeki \`ORDER BY\`, satırların hangi sırayla numaralandırılacağını belirler — sorgunun genel \`ORDER BY\`'ından bağımsızdır.

## ROW_NUMBER, RANK, DENSE_RANK farkı

Aynı \`course_id\`'de iki öğrenci aynı \`final_grade\`'i aldıysa (eşitlik durumu), üç fonksiyon farklı davranır:

| final_grade | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 95 | 1 | 1 | 1 |
| 70 | 2 | 2 | 2 |
| 60 | 3 | 3 | 3 |
| 60 | 4 | 3 | 3 |
| 55 | 5 | 5 | 4 |

- **ROW_NUMBER()**: her satıra benzersiz, ardışık bir sıra numarası verir — eşitlik olsa bile ikisine farklı numara verilir.
- **RANK()**: eşit değerlere aynı sırayı verir ama sonraki sırayı **atlar** (3, 3, sonra 5 — sanki 4. sıra hiç yokmuş gibi).
- **DENSE_RANK()**: eşit değerlere aynı sırayı verir ve **atlama yapmaz** (3, 3, sonra 4).

## Önemli kısıtlama: WHERE içinde kullanılamaz

Pencere fonksiyonlarını doğrudan \`WHERE\`'de filtreleyemezsin (\`WHERE ROW_NUMBER() OVER (...) = 1\` hata verir) — çünkü \`WHERE\`, pencere fonksiyonlarından **önce** çalışır. Filtrelemek istiyorsan, pencere fonksiyonunu bir alt sorguda hesapla, sonra dış sorguda filtrele (Ders 4.3'teki türetilmiş tablo tekniği).
`,
  ornekler: [
    { aciklama: "Matematik I dersindeki öğrencileri final notuna göre sırala:", sql: "SELECT student_id, final_grade, ROW_NUMBER() OVER (ORDER BY final_grade DESC) AS sira FROM enrollments WHERE course_id = 1;" },
  ],
  onizlemeTablolari: ["enrollments"],
  alistirmalar: [
    {
      id: "4-4-1",
      seviye: "Kolay",
      baslik: "ROW_NUMBER ile Sıralama",
      soru: "course_id'si 1 olan (Matematik I) kayıtların student_id, final_grade ve final_grade'e göre çoktan aza sıra numarasını (sira olarak, ROW_NUMBER ile) getiren bir sorgu yaz.",
      ipucu: "ROW_NUMBER() OVER (ORDER BY final_grade DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT student_id, final_grade, ROW_NUMBER() OVER (ORDER BY final_grade DESC) AS sira FROM enrollments WHERE course_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-4-2",
      seviye: "Kolay",
      baslik: "RANK ile Eşitlik Durumu",
      soru: "Aynı sorguyu bu sefer RANK() ile yaz — course_id'si 1 olan kayıtların student_id, final_grade ve RANK() ile hesaplanan sira'sını getir.",
      ipucu: "ROW_NUMBER yerine RANK() OVER (ORDER BY final_grade DESC) AS sira kullan.",
      cozumSql: "SELECT student_id, final_grade, RANK() OVER (ORDER BY final_grade DESC) AS sira FROM enrollments WHERE course_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-4-3",
      seviye: "Orta",
      baslik: "DENSE_RANK Farkı",
      soru: "Aynı sorguyu bu sefer DENSE_RANK() ile yaz ve sonucu bir önceki RANK() sonucuyla zihninde karşılaştır — course_id'si 1 olan kayıtların student_id, final_grade ve DENSE_RANK() ile hesaplanan sira'sını getir.",
      ipucu: "DENSE_RANK() OVER (ORDER BY final_grade DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql: "SELECT student_id, final_grade, DENSE_RANK() OVER (ORDER BY final_grade DESC) AS sira FROM enrollments WHERE course_id = 1;",
      mod: "sonuc",
    },
    {
      id: "4-4-4",
      seviye: "Orta",
      baslik: "Her Derste Ayrı Sıralama",
      soru: "Tüm kayıtların course_id, student_id, final_grade ve HER DERSTE KENDİ İÇİNDE final_grade'e göre çoktan aza sırasını (sira olarak, RANK ile) getiren bir sorgu yaz — PARTITION BY kullan.",
      ipucu: "RANK() OVER (PARTITION BY course_id ORDER BY final_grade DESC) AS sira kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT course_id, student_id, final_grade, RANK() OVER (PARTITION BY course_id ORDER BY final_grade DESC) AS sira FROM enrollments;",
      mod: "sonuc",
    },
    {
      id: "4-4-5",
      seviye: "Zor",
      baslik: "Ders Şampiyonları",
      soru: "Her dersteki (course_id) en yüksek final_grade'e sahip kaydı/kayıtları (course_id, student_id, final_grade) getiren bir sorgu yaz — pencere fonksiyonunu bir alt sorguda hesapla, dış sorguda sira = 1 ile filtrele.",
      ipucu: "FROM içinde RANK() OVER (PARTITION BY course_id ORDER BY final_grade DESC) AS sira hesaplayan bir alt sorgu yaz, dış sorguda WHERE sira = 1 ekle — pencere fonksiyonu doğrudan WHERE'de kullanılamaz.",
      cozumSql:
        "SELECT course_id, student_id, final_grade FROM (SELECT course_id, student_id, final_grade, RANK() OVER (PARTITION BY course_id ORDER BY final_grade DESC) AS sira FROM enrollments) AS t WHERE sira = 1;",
      mod: "sonuc",
    },
    {
      id: "4-4-6",
      seviye: "Zor",
      baslik: "Okul Birincisi",
      soru: "Tüm okulda final_grade'i en yüksek olan kaydı/kayıtları (student_id, course_id, final_grade) getiren bir sorgu yaz — PARTITION BY kullanmadan, DENSE_RANK ile tüm enrollments üzerinde sırala ve dış sorguda sira = 1 ile filtrele.",
      ipucu: "FROM içinde DENSE_RANK() OVER (ORDER BY final_grade DESC) AS sira hesapla (PARTITION BY yok), dış sorguda WHERE sira = 1 ekle.",
      cozumSql:
        "SELECT student_id, course_id, final_grade FROM (SELECT student_id, course_id, final_grade, DENSE_RANK() OVER (ORDER BY final_grade DESC) AS sira FROM enrollments) AS t WHERE sira = 1;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "4-4-q1",
      soru: "Pencere fonksiyonları GROUP BY'dan temel olarak nasıl farklıdır?",
      secenekler: [
        "Pencere fonksiyonları satırları kaybetmez; GROUP BY satırları gruplara indirger",
        "Aralarında hiçbir fark yoktur",
        "Pencere fonksiyonları sadece sayısal sütunlarla çalışır",
        "GROUP BY her zaman daha fazla satır döndürür",
      ],
      dogruIndex: 0,
      aciklama: "GROUP BY, gruplanan satırları tek bir özet satıra indirger; pencere fonksiyonları ise tüm satırları korur ve her birine bir hesaplama ekler.",
    },
    {
      id: "4-4-q2",
      soru: "PARTITION BY, OVER() içinde ne işe yarar?",
      secenekler: [
        "Satırları filtreler (WHERE gibi)",
        "Satırları belirtilen sütuna göre gruplara ayırır; her grup için hesaplama sıfırdan başlar",
        "Sonucu sıralar (ORDER BY gibi, sorgunun geneli için)",
        "Bir tabloyu ikiye böler",
      ],
      dogruIndex: 1,
      aciklama: "PARTITION BY, GROUP BY'a benzer şekilde satırları gruplara ayırır ama satırları tek tek korur; her pencere fonksiyonu kendi grubu içinde çalışır.",
    },
    {
      id: "4-4-q3",
      soru: "İki satır aynı final_grade değerine sahipse, RANK() ile DENSE_RANK() arasındaki fark nedir?",
      secenekler: [
        "Aralarında fark yoktur",
        "RANK, eşitlikten sonraki sırayı atlar; DENSE_RANK atlamaz",
        "DENSE_RANK, eşitlikten sonraki sırayı atlar; RANK atlamaz",
        "RANK sadece metin sütunlarında çalışır",
      ],
      dogruIndex: 1,
      aciklama: "RANK, eşit değerlere aynı sırayı verip bir sonraki sırayı atlar (1,2,2,4); DENSE_RANK ise atlama yapmaz (1,2,2,3).",
    },
    {
      id: "4-4-q4",
      soru: "Bir pencere fonksiyonunun sonucuna göre satırları filtrelemek istediğinde ne yapman gerekir?",
      secenekler: [
        "Doğrudan WHERE içinde pencere fonksiyonunu kullanabilirsin",
        "Pencere fonksiyonunu bir alt sorguda (türetilmiş tabloda) hesaplayıp dış sorguda WHERE ile filtrelemen gerekir",
        "Bu, SQL'de hiçbir şekilde mümkün değildir",
        "HAVING kullanman yeterlidir, WHERE gerekmez",
      ],
      dogruIndex: 1,
      aciklama: "WHERE, pencere fonksiyonlarından önce çalıştığı için onları doğrudan filtreleyemez; pencere fonksiyonunu bir alt sorguda hesaplayıp dış sorguda filtrelemek gerekir.",
    },
  ],
});
