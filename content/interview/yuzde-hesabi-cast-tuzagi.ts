import { defineInterviewQuestion } from "@/types/content";

export const yuzdeHesabiCastTuzagi = defineInterviewQuestion({
  slug: "yuzde-hesabi-cast-tuzagi",
  seviye: "Orta",
  sirket: "Bir online anket platformu",
  baslik: "Yüzde Hesabı (CAST Tuzağı)",
  senaryo: `
Bir online anket platformunda anket sonuçlarını analiz ediyorsun. Her anket (\`poll_id\`) için "evet" oyu yüzdesini hesaplaman isteniyor — ama dikkat, tam sayı bölmesi bu hesapta sinsi bir tuzak kurar.

**Görev:** Her \`poll_id\` için 'evet' (\`is_yes = 1\`) oy yüzdesini (\`poll_id\`, \`evet_yuzdesi\` olarak, ondalık basamaklarıyla) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE poll_votes (
  vote_id INTEGER PRIMARY KEY,
  poll_id INTEGER NOT NULL,
  is_yes INTEGER NOT NULL
);

INSERT INTO poll_votes (vote_id, poll_id, is_yes) VALUES
  (1, 1, 1), (2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1), (6, 1, 1), (7, 1, 1),
  (8, 1, 0), (9, 1, 0), (10, 1, 0), (11, 1, 0),
  (12, 2, 1), (13, 2, 1),
  (14, 2, 0), (15, 2, 0), (16, 2, 0), (17, 2, 0), (18, 2, 0), (19, 2, 0), (20, 2, 0);
`.trim(),
  onizlemeTablolari: ["poll_votes"],
  ipuclari: [
    "SUM(is_yes) * 100 / COUNT(*) yazarsan, SQLite iki INTEGER'ı böldüğü için sonuç tam sayıya (ondalık kısım atılarak) yuvarlanır.",
    "Bölme işleminden önce paydalardan en az birini REAL'e çevirmen gerekir.",
    "CAST(SUM(is_yes) AS REAL) * 100 / COUNT(*) kalıbını dene.",
  ],
  cozumSql: "SELECT poll_id, CAST(SUM(is_yes) AS REAL) * 100 / COUNT(*) AS evet_yuzdesi FROM poll_votes GROUP BY poll_id;",
  aciklama:
    "SQLite'ta iki INTEGER'ın bölümü tam sayı bölmesi yapar (ondalık kısım atılır). CAST(... AS REAL) ile paydan biri ondalıklı hale getirilirse, bölme işlemi de ondalıklı sonuç üretir — poll_id 1 için %63.63, poll_id 2 için %22.22 gibi.",
  mod: "sonuc",
  takipSorusu:
    "Peki neden CAST(SUM(is_yes) AS REAL) * 100 / COUNT(*) yazdık da SUM(is_yes) * 100 / CAST(COUNT(*) AS REAL) yazmadık — ikisi de çalışır mı?",
  takipCevabi:
    "Evet, ikisi de çalışır — önemli olan bölme işlemine girmeden önce pay ya da paydadan en az birinin REAL olması; SQLite bir REAL ile bir INTEGER'ı çarpıp böldüğünde sonucu otomatik olarak REAL'e yükseltir (implicit type promotion).",
});
