import { defineInterviewQuestion } from "@/types/content";

export const ayBazindaGeriDonenKullanici = defineInterviewQuestion({
  slug: "ay-bazinda-geri-donen-kullanici",
  seviye: "Zor",
  sirket: "Bir mobil oyun şirketi",
  baslik: "Ay Bazında Geri Dönen Kullanıcılar",
  senaryo: `
Bir mobil oyun şirketinde "retention" (elde tutma) metriğini araştırıyorsun. Bir önceki ay da oynamış olup bu ay da oynamaya devam eden (yani geri dönen) kullanıcıları her ay için bulman isteniyor.

**Görev:** Her ay, bir önceki ayda da oynamış olan (geri dönen) kullanıcıların \`user_id\` ve \`play_month\`'unu getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE plays (
  play_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  play_month TEXT NOT NULL
);

INSERT INTO plays (play_id, user_id, play_month) VALUES
  (1, 1, '2025-01'),
  (2, 2, '2025-01'),
  (3, 3, '2025-01'),
  (4, 1, '2025-02'),
  (5, 2, '2025-02'),
  (6, 4, '2025-02'),
  (7, 1, '2025-03'),
  (8, 4, '2025-03'),
  (9, 5, '2025-03'),
  (10, 2, '2025-04'),
  (11, 1, '2025-04'),
  (12, 6, '2025-04');
`.trim(),
  onizlemeTablolari: ["plays"],
  ipuclari: [
    "Bir kullanıcının 'bir önceki ay da oynamış' olduğunu anlamak için plays tablosunu kendisiyle self join'lemen gerekir.",
    "İki satırın user_id'si aynı olmalı VE ikinci satırın play_month'u, birinci satırın play_month'undan tam olarak bir ay önce olmalı.",
    "'YYYY-MM' formatındaki bir ayı bir ay geriye almak için strftime('%Y-%m', play_month || '-01', '-1 month') kullanabilirsin — önce güne '-01' ekleyip tam bir tarihe çevirmen gerekir.",
  ],
  cozumSql:
    "SELECT DISTINCT p1.user_id, p1.play_month FROM plays p1 JOIN plays p2 ON p1.user_id = p2.user_id AND p2.play_month = strftime('%Y-%m', p1.play_month || '-01', '-1 month');",
  aciklama:
    "plays tablosu kendisiyle self join'lenir: p1 'bu ay', p2 'bir önceki ay' rolünde. p2.play_month, strftime ile p1.play_month'tan tam bir ay geriye hesaplanarak eşleştirilir — eşleşme varsa kullanıcı o ay geri dönmüş demektir.",
  mod: "sonuc",
  takipSorusu: "Peki ya self join yerine LAG() pencere fonksiyonuyla aynı sonucu nasıl elde ederdin?",
  takipCevabi:
    "Her kullanıcının oynadığı ayları PARTITION BY user_id ORDER BY play_month ile sıralayıp LAG(play_month) OVER (...) ile bir önceki satırdaki ayı alabilir, sonra bu değerin gerçekten 'bir ay önce' olup olmadığını (strftime ile) kontrol edebilirdin — self join ile pencere fonksiyonu burada birbirinin alternatifidir.",
});
