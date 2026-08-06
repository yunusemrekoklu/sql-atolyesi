import { defineInterviewQuestion } from "@/types/content";

export const mukerrerEpostaAdresleri = defineInterviewQuestion({
  slug: "mukerrer-eposta-adresleri",
  seviye: "Kolay",
  sirket: "Bir e-ticaret devi",
  baslik: "Mükerrer Kayıt Bulma",
  senaryo: `
Bir e-ticaret devinin veri kalitesi ekibindesin. Kullanıcı tablosunda aynı e-posta adresiyle birden fazla kez kayıt oluşturulmuş (muhtemelen bir form hatası ya da bot kaydı) satırlar tespit edilmek isteniyor.

**Görev:** Birden fazla kez kayıtlı olan (yani aynı \`email\`'e sahip en az 2 kullanıcı kaydı bulunan) e-posta adreslerini ve kaç kez kayıtlı olduklarını (\`kayit_sayisi\` olarak) getiren bir sorgu yaz.
`,
  ddl: `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT INTO users (user_id, email, full_name, created_at) VALUES
  (1, 'ayse@example.com', 'Ayşe Yılmaz', '2024-01-01'),
  (2, 'can@example.com', 'Can Demir', '2024-01-02'),
  (3, 'deniz@example.com', 'Deniz Kaya', '2024-01-03'),
  (4, 'ayse@example.com', 'Ayşe Yılmaz', '2024-01-04'),
  (5, 'ece@example.com', 'Ece Şahin', '2024-01-05'),
  (6, 'can@example.com', 'Can Demir', '2024-01-06'),
  (7, 'fatih@example.com', 'Fatih Arslan', '2024-01-07'),
  (8, 'gul@example.com', 'Gül Koç', '2024-01-08'),
  (9, 'ayse@example.com', 'Ayşe Yılmaz', '2024-01-09'),
  (10, 'hakan@example.com', 'Hakan Er', '2024-01-10'),
  (11, 'irem@example.com', 'İrem Bulut', '2024-01-11'),
  (12, 'jale@example.com', 'Jale Yavuz', '2024-01-12'),
  (13, 'kemal@example.com', 'Kemal Öz', '2024-01-13'),
  (14, 'leyla@example.com', 'Leyla Aksoy', '2024-01-14');
`.trim(),
  onizlemeTablolari: ["users"],
  ipuclari: [
    "email'e göre gruplama yap: GROUP BY email.",
    "Her grubun kaç satırdan oluştuğunu COUNT(*) ile say.",
    "Sadece 1'den fazla kaydı olan grupları HAVING COUNT(*) > 1 ile filtrele.",
  ],
  cozumSql: "SELECT email, COUNT(*) AS kayit_sayisi FROM users GROUP BY email HAVING COUNT(*) > 1;",
  aciklama: "GROUP BY email ile aynı e-postaya sahip satırlar gruplanır; HAVING COUNT(*) > 1 ile sadece birden fazla kaydı olan e-postalar kalır.",
  mod: "sonuc",
  takipSorusu:
    "Peki ya bu mükerrer kayıtlardan sadece EN ESKİ (ilk oluşturulan) satırı tutup diğerlerini silmen istenseydi, nasıl bir yaklaşım izlerdin?",
  takipCevabi:
    "Her email için MIN(user_id) (ya da MIN(created_at)) ile 'tutulacak' kaydı bulup, DELETE FROM users WHERE user_id NOT IN (SELECT MIN(user_id) FROM users GROUP BY email); gibi bir sorguyla geri kalanları silebilirsin.",
});
