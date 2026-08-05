import { defineLesson } from "@/types/content";
import { filmlerDb } from "@/content/databases/filmler";

export const veritabaniNedir = defineLesson({
  slug: "veritabani-nedir",
  uniteId: 1,
  dersNo: "1.1",
  baslik: "Veritabanı Nedir?",
  veritabaniId: filmlerDb.id,
  anlatim: `
SQL Atölyesi'ne hoş geldin! İlk dersimizde en temel soruyla başlıyoruz: **veritabanı** nedir ve **SQL** ne işe yarar?

## Tablo, satır, sütun

Bir veritabanı, birbiriyle ilişkili verileri düzenli bir şekilde saklayan bir sistemdir. Bu dersteki \`filmler\` tablosunu bir Excel sayfası gibi düşünebilirsin:

- **Tablo**: verinin saklandığı yer (ör. \`filmler\`)
- **Satır (kayıt)**: tek bir varlığı temsil eder — tablomuzda bir satır, tek bir filmi ifade eder
- **Sütun (alan)**: her satırın ortak özelliklerini tanımlar — ör. \`ad\`, \`yonetmen\`, \`yil\`

## RDBMS nedir?

Verileri bu şekilde tablolar halinde saklayan ve yöneten sistemlere **RDBMS** (İlişkisel Veritabanı Yönetim Sistemi — *Relational Database Management System*) denir. SQLite, MySQL, PostgreSQL, SQL Server hepsi birer RDBMS örneğidir. Bu sitede tarayıcında çalışan **SQLite** kullanıyoruz.

## SQL ne işe yarar?

**SQL** (*Structured Query Language*), bu tablolardaki veriyi sorgulamak, filtrelemek ve yönetmek için kullanılan bir dildir. En temel SQL komutu \`SELECT\`'tir — veri **getirmek** için kullanılır.

## İlk sorgun: SELECT *

Bir tablodaki **tüm** sütunları ve **tüm** satırları getirmek için \`*\` (yıldız) karakterini kullanırız:

\`\`\`sql
SELECT * FROM filmler;
\`\`\`

Bu sorgu "filmler tablosundaki her şeyi getir" demektir. Aşağıdaki örnek veri tablosunda \`filmler\`'in tüm satır ve sütunlarını görebilirsin — alıştırmalara geçmeden önce göz gezdir.
`,
  ornekler: [
    { aciklama: "filmler tablosundaki tüm satır ve sütunları getir:", sql: "SELECT * FROM filmler;" },
  ],
  onizlemeTablolari: ["filmler"],
  alistirmalar: [
    {
      id: "1-1-1",
      seviye: "Kolay",
      baslik: "Tüm Filmleri Gör",
      soru: "filmler tablosundaki tüm satırları ve sütunları getiren bir sorgu yaz.",
      ipucu: "Tüm sütunları getirmek için * (yıldız) kullanılır: SELECT * FROM tablo_adi;",
      cozumSql: "SELECT * FROM filmler;",
      mod: "sonuc",
    },
    {
      id: "1-1-2",
      seviye: "Kolay",
      baslik: "Sadece Film Adları",
      soru: "filmler tablosundaki sadece ad sütununu getiren bir sorgu yaz.",
      ipucu: "SELECT'ten sonra istediğin sütunun adını * yerine yazabilirsin.",
      cozumSql: "SELECT ad FROM filmler;",
      mod: "sonuc",
    },
    {
      id: "1-1-3",
      seviye: "Kolay",
      baslik: "Sadece Yönetmenler",
      soru: "filmler tablosundaki sadece yonetmen sütununu getiren bir sorgu yaz.",
      ipucu: "SELECT yonetmen FROM filmler; kalıbını kullanabilirsin.",
      cozumSql: "SELECT yonetmen FROM filmler;",
      mod: "sonuc",
    },
    {
      id: "1-1-4",
      seviye: "Orta",
      baslik: "Ad ve Yıl Birlikte",
      soru: "Her filmin adını ve çıkış yılını (ad, yil) birlikte getiren bir sorgu yaz.",
      ipucu: "Birden fazla sütun istiyorsan SELECT'ten sonra aralarına virgül koyarak yaz: SELECT sutun1, sutun2 FROM tablo;",
      cozumSql: "SELECT ad, yil FROM filmler;",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "1-1-q1",
      soru: "Bir veritabanı tablosundaki her satır neyi temsil eder?",
      secenekler: [
        "Tablonun adını",
        "Tek bir kaydı/varlığı (ör. tek bir film)",
        "Bir sütunun veri tipini",
        "Veritabanının tamamını",
      ],
      dogruIndex: 1,
      aciklama: "Satır (kayıt), o tablodaki tek bir varlığı temsil eder — filmler tablosunda her satır bir filmi ifade eder.",
    },
    {
      id: "1-1-q2",
      soru: "RDBMS ne anlama gelir?",
      secenekler: [
        "Rastgele Dosya Bazlı Metin Sistemi",
        "İlişkisel Veritabanı Yönetim Sistemi",
        "Raporlama ve Değerlendirme Bilgi Modülü",
        "Rapor Dosyası Biçimlendirme Servisi",
      ],
      dogruIndex: 1,
      aciklama: "RDBMS, Relational Database Management System (İlişkisel Veritabanı Yönetim Sistemi) kısaltmasıdır — SQLite, MySQL, PostgreSQL bunlara örnektir.",
    },
    {
      id: "1-1-q3",
      soru: "Bir tablodaki tüm sütunları getirmek için hangi karakter kullanılır?",
      secenekler: ["#", "%", "*", "@"],
      dogruIndex: 2,
      aciklama: "Yıldız (*) karakteri, 'tüm sütunları getir' anlamına gelir.",
    },
    {
      id: "1-1-q4",
      soru: "SELECT * FROM filmler; sorgusu ne yapar?",
      secenekler: [
        "filmler tablosunu siler",
        "filmler tablosundaki tüm satır ve sütunları getirir",
        "filmler tablosuna yeni bir satır ekler",
        "Sadece filmler tablosunun adını gösterir",
      ],
      dogruIndex: 1,
      aciklama: "SELECT * FROM tablo_adi; o tablodaki tüm veriyi (tüm satır ve sütunlar) getiren en temel sorgudur.",
    },
  ],
});
