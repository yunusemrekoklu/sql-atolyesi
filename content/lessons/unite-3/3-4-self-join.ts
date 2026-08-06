import { defineLesson } from "@/types/content";
import { okulDb } from "@/content/databases/okul";

export const selfJoin = defineLesson({
  slug: "self-join",
  uniteId: 3,
  dersNo: "3.4",
  baslik: "Self JOIN",
  veritabaniId: okulDb.id,
  anlatim: `
Bazen bir tablonun bir satırı, **aynı tablodaki başka bir satırla** ilişkilidir. Klasik örnek: bir çalışanın yöneticisi de bir çalışandır. Bu derste yeni bir veritabanı olan \`okul\`'u kullanacağız — \`teachers\` tablosunda her öğretmenin bağlı olduğu **bölüm başkanı da bir öğretmendir**.

## teachers tablosunun şeması

\`\`\`
teachers (teacher_id PK, full_name, branch, department_head_id FK → teachers.teacher_id)
\`\`\`

\`department_head_id\`, \`teachers\` tablosunun **kendi kendine** işaret eden bir Foreign Key'i — bir öğretmenin bağlı olduğu bölüm başkanının \`teacher_id\`'sini tutar. Bölüm başkanlarının kendisinin \`department_head_id\`'si \`NULL\`'dur (onlar kimseye bağlı değil).

## Self JOIN: aynı tabloyu iki kez kullanmak

Bir öğretmenin adını **ve** bölüm başkanının adını aynı satırda görmek istersen, \`teachers\` tablosunu kendisiyle JOIN'lersin — ama iki farklı takma adla, yoksa SQL hangi \`full_name\`'den bahsettiğini ayırt edemez:

\`\`\`sql
SELECT ogretmen.full_name AS ogretmen, baskan.full_name AS bolum_baskani
FROM teachers ogretmen
LEFT JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id;
\`\`\`

Burada \`teachers\` tablosu iki kez kullanılıyor: \`ogretmen\` takma adıyla "öğretmen" rolünde, \`baskan\` takma adıyla "bölüm başkanı" rolünde. \`LEFT JOIN\` kullandık çünkü bölüm başkanlarının kendisinin bağlı olduğu bir başkan yok (\`department_head_id IS NULL\`) — \`INNER JOIN\` olsaydı başkanlar sonuçtan tamamen düşerdi.

Self JOIN sadece hiyerarşi için değil, aynı tablodaki satırları **birbirleriyle karşılaştırmak** için de kullanılır — örneğin aynı branştaki öğretmen çiftlerini bulmak gibi.
`,
  ornekler: [
    { aciklama: "Her öğretmeni bağlı olduğu bölüm başkanıyla birlikte listele:", sql: "SELECT ogretmen.full_name AS ogretmen, baskan.full_name AS bolum_baskani FROM teachers ogretmen LEFT JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id;" },
  ],
  onizlemeTablolari: ["teachers"],
  alistirmalar: [
    {
      id: "3-4-1",
      seviye: "Kolay",
      baslik: "Öğretmen ve Bölüm Başkanı",
      soru: "Her öğretmenin full_name'ini ve bağlı olduğu bölüm başkanının full_name'ini (ogretmen, bolum_baskani sütun adlarıyla) getiren bir sorgu yaz — bölüm başkanları da NULL bolum_baskani ile sonuçta görünmeli.",
      ipucu: "teachers tablosunu kendisiyle LEFT JOIN'le: FROM teachers ogretmen LEFT JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id",
      cozumSql:
        "SELECT ogretmen.full_name AS ogretmen, baskan.full_name AS bolum_baskani FROM teachers ogretmen LEFT JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id;",
      mod: "sonuc",
    },
    {
      id: "3-4-2",
      seviye: "Kolay",
      baslik: "Bölüm Başkanları",
      soru: "Kendisi bir bölüm başkanına bağlı OLMAYAN (yani kendisi başkan olan) öğretmenlerin full_name ve branch sütunlarını getiren bir sorgu yaz.",
      ipucu: "WHERE department_head_id IS NULL kalıbını kullanabilirsin — bu sorgu için JOIN gerekmez.",
      cozumSql: "SELECT full_name, branch FROM teachers WHERE department_head_id IS NULL;",
      mod: "sonuc",
    },
    {
      id: "3-4-3",
      seviye: "Orta",
      baslik: "Bir Başkana Bağlı Öğretmenler",
      soru: "Sadece bir bölüm başkanına bağlı OLAN öğretmenlerin full_name'ini ve bağlı oldukları başkanın full_name'ini (ogretmen, bolum_baskani sütun adlarıyla) getiren bir sorgu yaz — bu sefer INNER JOIN kullan.",
      ipucu: "LEFT JOIN yerine INNER JOIN kullanırsan department_head_id'si NULL olanlar otomatik elenir.",
      cozumSql:
        "SELECT ogretmen.full_name AS ogretmen, baskan.full_name AS bolum_baskani FROM teachers ogretmen INNER JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id;",
      mod: "sonuc",
    },
    {
      id: "3-4-4",
      seviye: "Orta",
      baslik: "Mehmet Yılmaz'a Bağlı Öğretmenler",
      soru: "full_name'i 'Mehmet Yılmaz' olan bölüm başkanına bağlı öğretmenlerin full_name ve branch sütunlarını getiren bir sorgu yaz.",
      ipucu: "teachers'ı kendisiyle JOIN'le, sonra WHERE baskan.full_name = 'Mehmet Yılmaz' ekle.",
      cozumSql:
        "SELECT ogretmen.full_name, ogretmen.branch FROM teachers ogretmen INNER JOIN teachers baskan ON ogretmen.department_head_id = baskan.teacher_id WHERE baskan.full_name = 'Mehmet Yılmaz';",
      mod: "sonuc",
    },
    {
      id: "3-4-5",
      seviye: "Zor",
      baslik: "Aynı Branştaki Öğretmen Çiftleri",
      soru: "Aynı branch'e sahip iki farklı öğretmenin full_name'lerini (t1_adi, t2_adi sütun adlarıyla) getiren bir sorgu yaz — her çift yalnızca bir kez görünmeli (aynı çiftin tersini tekrar getirme).",
      ipucu: "teachers'ı kendisiyle t1.branch = t2.branch VE t1.teacher_id < t2.teacher_id koşuluyla JOIN'le — < koşulu aynı çiftin tekrarını ve bir öğretmenin kendisiyle eşleşmesini önler.",
      cozumSql:
        "SELECT t1.full_name AS t1_adi, t2.full_name AS t2_adi FROM teachers t1 INNER JOIN teachers t2 ON t1.branch = t2.branch AND t1.teacher_id < t2.teacher_id;",
      mod: "sonuc",
    },
    {
      id: "3-4-6",
      seviye: "Zor",
      baslik: "Kalabalık Bölüm Başkanları",
      soru: "Kendisine bağlı en az 3 öğretmeni olan bölüm başkanlarının full_name'ini ve bağlı öğretmen sayısını (ogretmen_sayisi olarak) getiren bir sorgu yaz.",
      ipucu: "teachers'ı kendisiyle LEFT JOIN'le (baskan.department_head_id IS NULL olanlar başkan adayı), GROUP BY baskan.teacher_id ile grupla, HAVING COUNT(ogretmen.teacher_id) >= 3 ekle.",
      cozumSql:
        "SELECT baskan.full_name, COUNT(ogretmen.teacher_id) AS ogretmen_sayisi FROM teachers baskan LEFT JOIN teachers ogretmen ON ogretmen.department_head_id = baskan.teacher_id WHERE baskan.department_head_id IS NULL GROUP BY baskan.teacher_id HAVING COUNT(ogretmen.teacher_id) >= 3;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "3-4-q1",
      soru: "Self JOIN nedir?",
      secenekler: [
        "Bir tabloyu, farklı takma adlarla kendisiyle JOIN'lemek",
        "Bir tabloyu silmeden önce yedeklemek",
        "Sadece PRIMARY KEY sütunları arasında yapılan JOIN",
        "İki farklı veritabanını birleştirmek",
      ],
      dogruIndex: 0,
      aciklama: "Self JOIN, bir tablonun satırlarını aynı tablodaki başka satırlarla ilişkilendirmek için tabloyu farklı takma adlarla kendisine JOIN'lemektir.",
    },
    {
      id: "3-4-q2",
      soru: "Self JOIN yaparken takma ad (alias) kullanmak neden zorunludur?",
      secenekler: [
        "Zorunlu değildir, sadece stil tercihidir",
        "Aynı tablo iki kez FROM'da geçtiği için SQL, hangi kopyadan bahsettiğini takma ad olmadan ayırt edemez",
        "Takma ad, sorguyu otomatik olarak hızlandırır",
        "SQLite, takma ad olmadan self JOIN'i çalıştırmayı reddeder",
      ],
      dogruIndex: 1,
      aciklama: "Aynı tablo sorguda iki kez yer aldığında, sütun adları belirsizleşir; farklı takma adlar bu belirsizliği ortadan kaldırır.",
    },
    {
      id: "3-4-q3",
      soru: "teachers tablosunda department_head_id'si NULL olan bir öğretmen ne anlama gelir?",
      secenekler: [
        "O öğretmen henüz sisteme tam kaydedilmemiştir",
        "O öğretmenin bağlı olduğu bir bölüm başkanı yoktur — muhtemelen kendisi başkandır",
        "O öğretmen okuldan ayrılmıştır",
        "Bir veri hatasıdır, düzeltilmesi gerekir",
      ],
      dogruIndex: 1,
      aciklama: "department_head_id NULL olduğunda, o öğretmenin bağlı olduğu bir üst yoktur; veri setimizde bu, bölüm başkanlarını temsil eder.",
    },
    {
      id: "3-4-q4",
      soru: "Öğretmen-bölüm başkanı hiyerarşisini getirirken neden INNER JOIN yerine LEFT JOIN tercih edilebilir?",
      secenekler: [
        "LEFT JOIN her zaman daha hızlıdır",
        "Bölüm başkanlarının kendisinin department_head_id'si NULL olduğu için INNER JOIN kullanılırsa başkanlar sonuçtan tamamen düşer",
        "INNER JOIN, self JOIN ile hiç kullanılamaz",
        "Aralarında fark yoktur",
      ],
      dogruIndex: 1,
      aciklama: "INNER JOIN sadece eşleşenleri getirdiği için, department_head_id'si NULL olan (yani bir başkana bağlı olmayan) bölüm başkanları sonuçtan düşer; LEFT JOIN onları da (bolum_baskani sütunu NULL olarak) korur.",
    },
  ],
});
