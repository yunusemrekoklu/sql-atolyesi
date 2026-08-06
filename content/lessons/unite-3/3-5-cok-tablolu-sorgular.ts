import { defineLesson } from "@/types/content";
import { okulDb } from "@/content/databases/okul";

export const cokTablolu = defineLesson({
  slug: "cok-tablolu-sorgular",
  uniteId: 3,
  dersNo: "3.5",
  baslik: "Çok Tablolu Sorgular",
  veritabaniId: okulDb.id,
  anlatim: `
Gerçek sorguların çoğu iki tabloyla sınırlı kalmaz. \`okul\` veritabanında dört tablo zincirleme bağlı: bir öğrencinin notunu görmek için \`students\` → \`enrollments\` → \`courses\` → \`teachers\` zincirini takip etmen gerekir.

## Zincirleme JOIN

\`\`\`sql
SELECT s.full_name, c.course_name, t.full_name AS ogretmen, e.final_grade
FROM enrollments e
JOIN students s ON e.student_id = s.student_id
JOIN courses c ON e.course_id = c.course_id
JOIN teachers t ON c.teacher_id = t.teacher_id;
\`\`\`

Burada \`enrollments\`'tan başlayıp iki farklı FK üzerinden \`students\`'a ve \`courses\`'a bağlanıyoruz, sonra \`courses.teacher_id\` üzerinden \`teachers\`'a bir adım daha atıyoruz. JOIN'lerin sırası genellikle sonucu etkilemez — SQL, hangi tabloların birbirine nasıl bağlandığını \`ON\` koşullarından anlar.

## JOIN + GROUP BY birlikte

Çok tablolu sorgularda toplulaştırma yapmak istediğinde, \`GROUP BY\`'ı JOIN'den **sonra** yazarsın — mantık aynı kalır, sadece gruplanan satırlar artık birden fazla tablodan gelir:

\`\`\`sql
SELECT c.course_name, AVG(e.final_grade) AS ortalama
FROM enrollments e
JOIN courses c ON e.course_id = c.course_id
GROUP BY c.course_id;
\`\`\`

## Dikkat: eksik bir JOIN koşulu satır sayısını patlatır

Bir \`JOIN\`'in \`ON\` koşulunu unutursan (ya da yanlış yazarsan), SQL o iki tablonun **kartezyen çarpımını** üretir — her satırın diğer tablonun her satırıyla eşleştiği, anlamsız derecede büyük bir sonuç. Zincir uzadıkça (3, 4 tablo) bu hatayı fark etmek zorlaşır; her JOIN'den sonra sonuç satır sayısının makul göründüğünden emin ol.
`,
  ornekler: [
    { aciklama: "Öğrencilerin aldığı dersleri, dersi veren öğretmenle birlikte getir:", sql: "SELECT s.full_name, c.course_name, t.full_name AS ogretmen FROM enrollments e JOIN students s ON e.student_id = s.student_id JOIN courses c ON e.course_id = c.course_id JOIN teachers t ON c.teacher_id = t.teacher_id;" },
  ],
  onizlemeTablolari: ["students", "courses", "enrollments", "teachers"],
  alistirmalar: [
    {
      id: "3-5-1",
      seviye: "Kolay",
      baslik: "Öğrenci, Ders ve Not",
      soru: "Öğrencilerin full_name'ini, aldıkları dersin course_name'ini ve final_grade'ini getiren bir sorgu yaz (enrollments, students ve courses'ı JOIN'le).",
      ipucu: "FROM enrollments e JOIN students s ON e.student_id = s.student_id JOIN courses c ON e.course_id = c.course_id kalıbını kullanabilirsin.",
      cozumSql:
        "SELECT s.full_name, c.course_name, e.final_grade FROM enrollments e JOIN students s ON e.student_id = s.student_id JOIN courses c ON e.course_id = c.course_id;",
      mod: "sonuc",
    },
    {
      id: "3-5-2",
      seviye: "Orta",
      baslik: "Dört Tablo Birden",
      soru: "Öğrencilerin full_name'ini, aldıkları dersin course_name'ini ve o dersi veren öğretmenin full_name'ini (ogretmen olarak) getiren bir sorgu yaz — dört tabloyu (enrollments, students, courses, teachers) JOIN'lemen gerekecek.",
      ipucu: "3.5 dersinin anlatım bölümündeki zincirleme JOIN örneğini temel alabilirsin.",
      cozumSql:
        "SELECT s.full_name, c.course_name, t.full_name AS ogretmen FROM enrollments e JOIN students s ON e.student_id = s.student_id JOIN courses c ON e.course_id = c.course_id JOIN teachers t ON c.teacher_id = t.teacher_id;",
      mod: "sonuc",
    },
    {
      id: "3-5-3",
      seviye: "Orta",
      baslik: "Öğretmen Başına Öğrenci Sayısı",
      soru: "Her öğretmenin full_name'ini ve verdiği derslere kayıtlı toplam kayıt (enrollment) sayısını (kayit_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "teachers'ı courses'a, courses'u enrollments'a JOIN'le; GROUP BY t.teacher_id ile grupla ve COUNT(e.enrollment_id) kullan.",
      cozumSql:
        "SELECT t.full_name, COUNT(e.enrollment_id) AS kayit_sayisi FROM teachers t JOIN courses c ON t.teacher_id = c.teacher_id JOIN enrollments e ON c.course_id = e.course_id GROUP BY t.teacher_id;",
      mod: "sonuc",
    },
    {
      id: "3-5-4",
      seviye: "Orta",
      baslik: "Elif Aydın'ın Dersleri",
      soru: "full_name'i 'Elif Aydın' olan öğrencinin aldığı derslerin course_name'ini ve final_grade'ini getiren bir sorgu yaz.",
      ipucu: "enrollments'ı students ve courses'a JOIN'le, sonra WHERE s.full_name = 'Elif Aydın' ekle.",
      cozumSql:
        "SELECT c.course_name, e.final_grade FROM enrollments e JOIN students s ON e.student_id = s.student_id JOIN courses c ON e.course_id = c.course_id WHERE s.full_name = 'Elif Aydın';",
      mod: "sonuc",
    },
    {
      id: "3-5-5",
      seviye: "Zor",
      baslik: "Ders Ortalamaları",
      soru: "Her dersin course_name'ini, o dersi veren öğretmenin full_name'ini ve final_grade ortalamasını (ortalama_not olarak) getiren bir sorgu yaz; sonucu ortalamaya göre çoktan aza sırala.",
      ipucu: "courses'u teachers ve enrollments'a JOIN'le, GROUP BY c.course_id ile grupla, AVG(e.final_grade) kullan, ORDER BY ... DESC ekle.",
      cozumSql:
        "SELECT c.course_name, t.full_name AS ogretmen, AVG(e.final_grade) AS ortalama_not FROM courses c JOIN teachers t ON c.teacher_id = t.teacher_id JOIN enrollments e ON c.course_id = e.course_id GROUP BY c.course_id ORDER BY ortalama_not DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "3-5-6",
      seviye: "Zor",
      baslik: "Yoğun Dönem Geçiren Öğrenciler",
      soru: "'2024-Güz' döneminde en az 2 derse kayıtlı olan öğrencilerin full_name'ini ve ders sayısını (ders_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "enrollments'ı students'a JOIN'le, WHERE e.semester = '2024-Güz' ekle, GROUP BY s.student_id ile grupla, HAVING COUNT(*) >= 2 ekle.",
      cozumSql:
        "SELECT s.full_name, COUNT(*) AS ders_sayisi FROM enrollments e JOIN students s ON e.student_id = s.student_id WHERE e.semester = '2024-Güz' GROUP BY s.student_id HAVING COUNT(*) >= 2;",
      mod: "sonuc",
    },
    {
      id: "3-5-7",
      seviye: "Zor",
      baslik: "Bölüm Başkanlarının Dersleri",
      soru: "Kendisi bir bölüm başkanı olan (department_head_id IS NULL) öğretmenlerin verdiği derslere kayıtlı toplam öğrenci sayısını, öğretmenin full_name'iyle birlikte (ogretmen, ogrenci_sayisi sütun adlarıyla) getiren bir sorgu yaz.",
      ipucu: "teachers'ı courses ve enrollments'a JOIN'le, WHERE t.department_head_id IS NULL ekle, GROUP BY t.teacher_id ile grupla.",
      cozumSql:
        "SELECT t.full_name AS ogretmen, COUNT(e.enrollment_id) AS ogrenci_sayisi FROM teachers t JOIN courses c ON t.teacher_id = c.teacher_id JOIN enrollments e ON c.course_id = e.course_id WHERE t.department_head_id IS NULL GROUP BY t.teacher_id;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-5-q1",
      soru: "Dört tabloyu zincirleme JOIN'lerken sıralamanın sonucu değiştirmesi beklenir mi?",
      secenekler: [
        "Evet, JOIN sırası her zaman farklı bir sonuç üretir",
        "Hayır, SQL hangi tabloların nasıl bağlandığını ON koşullarından anlar; JOIN sırası genellikle sonucu değiştirmez",
        "Sadece 2 tablo JOIN'lenirken sıra önemsizdir, 3+ tabloda önemlidir",
        "JOIN sırası sadece performansı değil, hiçbir şeyi etkilemez ve önemsizdir",
      ],
      dogruIndex: 1,
      aciklama: "SQL, JOIN'lerin mantıksal sırasını ON koşullarından çıkarır; yazım sıran genellikle sonucu değil (çoğunlukla) sadece okunabilirliği etkiler.",
    },
    {
      id: "3-5-q2",
      soru: "Bir JOIN'in ON koşulunu unutursan ne olur?",
      secenekler: [
        "SQL otomatik olarak en mantıklı sütunu bulup eşleştirir",
        "İki tablonun kartezyen çarpımı oluşur — her satır diğer tablonun her satırıyla eşleşir",
        "Sorgu hatasız çalışır ama boş sonuç döner",
        "SQLite bu durumda sorguyu çalıştırmayı reddeder",
      ],
      dogruIndex: 1,
      aciklama: "ON koşulu olmadan (ya da yanlış yazıldığında) JOIN, iki tablonun kartezyen çarpımını üretir — beklenenden çok daha fazla, anlamsız satır.",
    },
    {
      id: "3-5-q3",
      soru: "Çok tablolu bir sorguda GROUP BY nereye yazılır?",
      secenekler: [
        "Tüm JOIN'lerden önce, FROM'un hemen ardından",
        "Tüm JOIN'lerden sonra, WHERE'den sonra (varsa)",
        "SELECT'ten önce",
        "GROUP BY, JOIN ile aynı sorguda hiç kullanılamaz",
      ],
      dogruIndex: 1,
      aciklama: "GROUP BY, sorgunun çalışma sırasına uygun olarak JOIN'lerden ve WHERE'den sonra yazılır — gruplama, satırlar birleştirilip filtrelendikten sonra yapılır.",
    },
    {
      id: "3-5-q4",
      soru: "enrollments tablosu neden students ve courses arasında bir 'köprü' görevi görür?",
      secenekler: [
        "Çünkü enrollments hem student_id hem course_id'yi FK olarak tutar, ikisini birbirine bağlar",
        "Çünkü enrollments, students tablosunun bir kopyasıdır",
        "Çünkü enrollments'ta hiç FK yoktur",
        "Çünkü enrollments sadece raporlama amaçlıdır",
      ],
      dogruIndex: 0,
      aciklama: "enrollments, hem student_id hem course_id sütunlarını FK olarak tuttuğu için, öğrenciler ile dersler arasındaki çoktan-çoğa ilişkiyi kurar (köprü tablo).",
    },
  ],
});
