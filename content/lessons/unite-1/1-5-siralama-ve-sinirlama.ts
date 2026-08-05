import { defineLesson } from "@/types/content";
import { filmlerDb } from "@/content/databases/filmler";

export const siralamaVeSinirlama = defineLesson({
  slug: "siralama-ve-sinirlama",
  uniteId: 1,
  dersNo: "1.5",
  baslik: "Sıralama ve Sınırlama",
  veritabaniId: filmlerDb.id,
  anlatim: `
Ünite 1'in son dersinde, sonuçları belirli bir sıraya göre dizmeyi ve kaç satır döneceğini sınırlamayı öğreneceksin — Türkiye Turu'na (1.T) geçmeden önceki son parça!

## ORDER BY ile sıralama

\`ORDER BY\`, sonuçları bir veya daha fazla sütuna göre sıralar. Varsayılan yön **artan** (\`ASC\`) sıradır; azalan sıra için \`DESC\` yazılır:

\`\`\`sql
SELECT ad, puan FROM filmler ORDER BY puan DESC;
\`\`\`

Bu sorgu filmleri **puanı en yüksekten en düşüğe** doğru sıralar.

## Çoklu sütunla sıralama

Birden fazla sütuna göre sıralamak istersen, virgülle ayırarak yazabilirsin. İlk yazılan sütun **öncelikli**dir; ilk sütunda eşit değerler varsa ikinci sütuna göre sıralanır:

\`\`\`sql
SELECT ad, tur, puan FROM filmler ORDER BY tur ASC, puan DESC;
\`\`\`

Bu, önce türe göre alfabetik sıralar; her tür içinde de puana göre yüksekten düşüğe sıralar.

## LIMIT ve OFFSET

\`LIMIT\`, sonuçtan dönecek satır sayısını sınırlar. \`OFFSET\` ile birlikte kullanıldığında, baştan kaç satırın **atlanacağını** belirtir — bu, "sayfalama" (pagination) için kullanılır:

\`\`\`sql
SELECT ad, puan FROM filmler ORDER BY puan DESC LIMIT 3;
\`\`\`

Bu, en yüksek puanlı **3** filmi getirir. \`LIMIT 5 OFFSET 5\` ise ilk 5 satırı atlar, sonraki 5 satırı getirir (ör. "2. sayfa").

**Önemli:** \`LIMIT\`, \`ORDER BY\` olmadan kullanılırsa hangi satırların döneceği garanti edilmez — bu yüzden \`LIMIT\` genellikle \`ORDER BY\` ile birlikte anlamlıdır.
`,
  ornekler: [
    { aciklama: "En yüksek puanlı 3 filmi listele:", sql: "SELECT ad, puan FROM filmler ORDER BY puan DESC LIMIT 3;" },
  ],
  onizlemeTablolari: ["filmler"],
  alistirmalar: [
    {
      id: "1-5-1",
      seviye: "Kolay",
      baslik: "Yıla Göre Sırala",
      soru: "Tüm filmlerin adını ve yılını, yıla göre eskiden yeniye (artan) sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY yil ASC (ASC varsayılan olduğu için yazmasan da olur).",
      cozumSql: "SELECT ad, yil FROM filmler ORDER BY yil ASC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-5-2",
      seviye: "Kolay",
      baslik: "En Yeni 5 Film",
      soru: "En yeni 5 filmin adını ve yılını, yeniden eskiye sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY yil DESC LIMIT 5 kalıbını kullanabilirsin.",
      cozumSql: "SELECT ad, yil FROM filmler ORDER BY yil DESC LIMIT 5;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-5-3",
      seviye: "Orta",
      baslik: "En Düşük Puanlı 3 Film",
      soru: "Puanı en düşük 3 filmin adını ve puanını, düşükten yükseğe sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY puan ASC LIMIT 3 kalıbını kullanabilirsin.",
      cozumSql: "SELECT ad, puan FROM filmler ORDER BY puan ASC LIMIT 3;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-5-4",
      seviye: "Orta",
      baslik: "Çoklu Sütun Sıralama",
      soru: "Her filmin adını, türünü ve puanını; önce türe göre alfabetik (A-Z), her tür içinde de puana göre yüksekten düşüğe sıralı getiren bir sorgu yaz.",
      ipucu: "ORDER BY tur ASC, puan DESC — virgülle ayırdığın ilk sütun önceliklidir.",
      cozumSql: "SELECT ad, tur, puan FROM filmler ORDER BY tur ASC, puan DESC;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-5-5",
      seviye: "Orta",
      baslik: "İkinci Sayfa (OFFSET)",
      soru: "Filmleri yıla göre artan sıralayıp, ilk 5 filmi atlayarak sonraki 5 filmin adını ve yılını getiren bir sorgu yaz.",
      ipucu: "ORDER BY yil ASC LIMIT 5 OFFSET 5 kalıbını kullanabilirsin.",
      cozumSql: "SELECT ad, yil FROM filmler ORDER BY yil ASC LIMIT 5 OFFSET 5;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
    {
      id: "1-5-6",
      seviye: "Zor",
      baslik: "En Uzun 3 Dram Filmi",
      soru: "Türü 'Dram' olan filmler arasından, süresi (sure_dk) en uzun 3 tanesinin adını ve süresini, uzundan kısaya sıralı getiren bir sorgu yaz.",
      ipucu: "Önce WHERE ile filtrele, sonra ORDER BY ... DESC LIMIT 3 ekle. Sıra: WHERE → ORDER BY → LIMIT.",
      cozumSql: "SELECT ad, sure_dk FROM filmler WHERE tur = 'Dram' ORDER BY sure_dk DESC LIMIT 3;",
      mod: "sonuc",
      siralamaOnemli: true,
    },
  ],
  miniQuiz: [
    {
      id: "1-5-q1",
      soru: "ORDER BY puan DESC; ifadesi filmleri neye göre sıralar?",
      secenekler: [
        "Puanı küçükten büyüğe",
        "Puanı büyükten küçüğe",
        "Alfabetik olarak film adına göre",
        "Rastgele sırayla",
      ],
      dogruIndex: 1,
      aciklama: "DESC (descending), azalan sırayı — yani en büyükten en küçüğe doğru sıralamayı ifade eder.",
    },
    {
      id: "1-5-q2",
      soru: "LIMIT 5 OFFSET 5; ifadesi ne yapar?",
      secenekler: [
        "İlk 5 satırı getirir",
        "İlk 5 satırı atlar, sonraki 5 satırı getirir",
        "Son 5 satırı getirir",
        "Toplam satır sayısını 5 ile çarpar",
      ],
      dogruIndex: 1,
      aciklama: "OFFSET, baştan kaç satırın atlanacağını belirtir; LIMIT ise atlamadan sonra kaç satır döneceğini belirler.",
    },
    {
      id: "1-5-q3",
      soru: "ORDER BY tur, puan DESC; ifadesinde sonuçlar önce hangi sütuna göre sıralanır?",
      secenekler: [
        "puan sütununa göre",
        "tur sütununa göre (ilk yazılan sütun önceliklidir)",
        "İkisine de eşit ağırlıkta bakılır",
        "Sütun sırası önemli değildir",
      ],
      dogruIndex: 1,
      aciklama: "ORDER BY listesinde ilk yazılan sütun önceliklidir; o sütunda eşitlik varsa bir sonraki sütuna bakılır.",
    },
    {
      id: "1-5-q4",
      soru: "LIMIT olmadan sadece ORDER BY kullanmak, dönen satır sayısını sınırlar mı?",
      secenekler: [
        "Evet, ORDER BY otomatik olarak sonucu 10 satırla sınırlar",
        "Hayır, ORDER BY sadece sırayı değiştirir, satır sayısını sınırlamaz",
        "Evet ama sadece sayısal sütunlarda",
        "Hayır, tam tersine satır sayısını artırır",
      ],
      dogruIndex: 1,
      aciklama: "ORDER BY yalnızca sonuçların sırasını belirler; kaç satır döneceğini sınırlamak için ayrıca LIMIT gerekir.",
    },
  ],
});
