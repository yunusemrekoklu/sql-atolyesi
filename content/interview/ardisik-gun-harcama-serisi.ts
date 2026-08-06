import { defineInterviewQuestion } from "@/types/content";

export const ardisikGunHarcamaSerisi = defineInterviewQuestion({
  slug: "ardisik-gun-harcama-serisi",
  seviye: "Zor",
  sirket: "Bir fintech (dijital bankacılık) uygulaması",
  baslik: "Ardışık Gün Harcama Serisi",
  senaryo: `
Bir fintech uygulamasının ürün ekibindesin. "Harcama serisi" (streak) rozeti için, bir kullanıcının ART ARDA en az 3 gün boyunca her gün en az bir harcaması olup olmadığını tespit etmen isteniyor.

**Görev:** En az 3 ardışık gün boyunca her gün en az bir harcaması olan kullanıcıların \`user_id\`'sini (tekrarsız) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE transactions (
  tx_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  tx_date TEXT NOT NULL,
  amount REAL NOT NULL
);

INSERT INTO transactions (tx_id, user_id, tx_date, amount) VALUES
  (1, 1, '2025-05-01', 50),
  (2, 1, '2025-05-01', 20),
  (3, 1, '2025-05-02', 30),
  (4, 1, '2025-05-03', 40),
  (5, 1, '2025-05-04', 25),
  (6, 2, '2025-05-01', 60),
  (7, 2, '2025-05-03', 15),
  (8, 2, '2025-05-04', 45),
  (9, 2, '2025-05-05', 35),
  (10, 3, '2025-05-01', 100),
  (11, 3, '2025-05-02', 80);
`.trim(),
  onizlemeTablolari: ["transactions"],
  ipuclari: [
    "Bir kullanıcının 3 ardışık günü olup olmadığını anlamak için transactions tablosunu kendisiyle İKİ KEZ (bir gün sonrası ve iki gün sonrası için) self join'leyebilirsin.",
    "SQLite'ın date(tarih, '+1 day') fonksiyonu bir tarihe gün ekler — bunu JOIN koşulunda kullan.",
    "t1.tx_date, t2.tx_date = t1.tx_date + 1 gün, t3.tx_date = t1.tx_date + 2 gün eşleşmesini ara; sonucu DISTINCT ile tekilleştir (aynı kullanıcı birden fazla başlangıç günüyle eşleşebilir).",
  ],
  cozumSql:
    "SELECT DISTINCT t1.user_id FROM transactions t1 JOIN transactions t2 ON t2.user_id = t1.user_id AND t2.tx_date = date(t1.tx_date, '+1 day') JOIN transactions t3 ON t3.user_id = t1.user_id AND t3.tx_date = date(t1.tx_date, '+2 day');",
  aciklama:
    "transactions tablosu kendisiyle iki kez self join'lenir: t1 bir başlangıç günü, t2 onun ertesi günü, t3 iki gün sonrası olacak şekilde eşleştirilir (date(..., '+1 day') / '+2 day' ile). Üç JOIN'in de eşleştiği bir t1.tx_date bulunursa, o kullanıcının en az 3 ardışık günü var demektir. DISTINCT, aynı kullanıcının birden fazla başlangıç noktasıyla eşleşip tekrar etmesini önler.",
  mod: "sonuc",
  takipSorusu: "Peki ya 'en az 3 ardışık gün' yerine 'tam olarak en uzun ardışık gün serisinin kaç gün olduğunu' hesaplaman istenseydi?",
  takipCevabi:
    "Bu, klasik 'gaps and islands' problemidir — her kullanıcının tarihlerini ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY tx_date) ile sıralayıp, tarihten bu sıra numarasını (gün cinsinden) çıkararak aynı 'adaya' (ardışık bloğa) düşen satırları gruplarsın; her grubun uzunluğu o bloğun kaç ardışık gün sürdüğünü verir.",
});
