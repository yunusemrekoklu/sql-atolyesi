import { defineInterviewQuestion } from "@/types/content";

export const begeniAlmamisGonderiler = defineInterviewQuestion({
  slug: "begeni-almamis-gonderiler",
  seviye: "Kolay",
  sirket: "Bir sosyal medya uygulaması",
  baslik: "Beğeni Almamış Gönderiler",
  senaryo: `
Bir sosyal medya uygulamasının veri ekibindesin. Ürün yöneticisi, hiç beğeni almamış gönderileri bulmak istiyor — belki içerik kalitesiyle, belki de görünürlükle ilgili bir sorun var ve bu gönderiler incelenecek.

**Görev:** Hiç beğeni almamış gönderilerin \`post_id\` ve \`content\`'ini getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE posts (
  post_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE likes (
  like_id INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(post_id),
  user_id INTEGER NOT NULL,
  liked_at TEXT NOT NULL
);

INSERT INTO posts (post_id, user_id, content, created_at) VALUES
  (1, 101, 'İlk paylaşımım!', '2025-01-01'),
  (2, 102, 'Bugün hava çok güzel', '2025-01-02'),
  (3, 101, 'Yeni tarif denedim', '2025-01-03'),
  (4, 103, 'Kod yazmak eğlenceli', '2025-01-04'),
  (5, 104, 'Tatil planları', '2025-01-05'),
  (6, 102, 'Kitap önerisi', '2025-01-06'),
  (7, 105, 'Spor haberleri', '2025-01-07'),
  (8, 101, 'Fotoğraf paylaşımı', '2025-01-08'),
  (9, 103, 'Müzik listesi', '2025-01-09'),
  (10, 104, 'Günlük düşünceler', '2025-01-10');

INSERT INTO likes (like_id, post_id, user_id, liked_at) VALUES
  (1, 1, 102, '2025-01-01'),
  (2, 1, 103, '2025-01-01'),
  (3, 2, 101, '2025-01-02'),
  (4, 3, 104, '2025-01-03'),
  (5, 4, 105, '2025-01-04'),
  (6, 6, 101, '2025-01-06'),
  (7, 6, 103, '2025-01-06'),
  (8, 8, 102, '2025-01-08');
`.trim(),
  onizlemeTablolari: ["posts", "likes"],
  ipuclari: [
    "posts tablosunu likes tablosuna LEFT JOIN'lemeyi dene.",
    "LEFT JOIN sonrası, likes tarafından gelen bir sütunun (ör. like_id) NULL olduğu satırlar, hiç eşleşmesi olmayan gönderilerdir.",
    "WHERE l.like_id IS NULL filtresini eklemeyi unutma — bu, klasik 'anti-join' desenidir.",
  ],
  cozumSql: "SELECT p.post_id, p.content FROM posts p LEFT JOIN likes l ON p.post_id = l.post_id WHERE l.like_id IS NULL;",
  aciklama:
    "posts, likes'a LEFT JOIN'lendiğinde eşleşmesi olmayan gönderilerde likes sütunları NULL olur; WHERE l.like_id IS NULL ile bu satırlar (hiç beğeni almamışlar) filtrelenir.",
  mod: "sonuc",
  takipSorusu: "Peki ya sadece son 7 günde paylaşılan gönderiler arasında hiç beğeni almamışları bulman istenseydi?",
  takipCevabi:
    "WHERE koşuluna created_at >= '<tarih>' filtresini AND ile eklemen yeterli olurdu — anti-join deseni aynı kalır, sadece hangi gönderilerin değerlendirmeye alındığını daraltırsın.",
});
