import { defineInterviewQuestion } from "@/types/content";

export const ustYoneticiRaporu = defineInterviewQuestion({
  slug: "ust-yonetici-raporu",
  seviye: "Zor",
  sirket: "Bir kurumsal danışmanlık şirketi",
  baslik: "Üst Yönetici Raporu",
  senaryo: `
Bir kurumsal danışmanlık şirketinde İK ekibindesin. Bütçe planlaması için, her yöneticinin KENDİSİNE DOĞRUDAN bağlı kaç çalışanı olduğunu ve bu çalışanların toplam maaşını gösteren bir rapor isteniyor.

**Görev:** Her yöneticinin \`full_name\`'ini, kendisine doğrudan bağlı çalışan sayısını (\`calisan_sayisi\`) ve bu çalışanların toplam maaşını (\`toplam_maas\`) getiren bir sorgu yaz — sadece en az bir çalışanı olan yöneticileri dahil et.
`,
  ddl: `
CREATE TABLE staff_members (
  staff_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL,
  manager_id INTEGER REFERENCES staff_members(staff_id),
  salary INTEGER NOT NULL
);

INSERT INTO staff_members (staff_id, full_name, manager_id, salary) VALUES
  (1, 'Kaan Öztürk', NULL, 150000),
  (2, 'Selin Arık', 1, 95000),
  (3, 'Burak Tan', 1, 92000),
  (4, 'Deniz Kurt', 2, 60000),
  (5, 'Ece Polat', 2, 58000),
  (6, 'Onur Sezer', 3, 55000),
  (7, 'Gamze Us', 3, 57000),
  (8, 'Tarık Bek', 3, 53000),
  (9, 'Nil Aksu', NULL, 145000);
`.trim(),
  onizlemeTablolari: ["staff_members"],
  ipuclari: [
    "staff_members tablosunu kendisiyle JOIN'lemen gerekiyor: bir kopya 'yönetici' rolünde, diğeri 'çalışan' rolünde.",
    "JOIN koşulu: e.manager_id = m.staff_id (çalışanın yöneticisi, yöneticinin kendi id'sine eşit olmalı).",
    "GROUP BY m.staff_id ile her yönetici için COUNT ve SUM hesapla.",
  ],
  cozumSql:
    "SELECT m.full_name, COUNT(e.staff_id) AS calisan_sayisi, SUM(e.salary) AS toplam_maas FROM staff_members m JOIN staff_members e ON e.manager_id = m.staff_id GROUP BY m.staff_id;",
  aciklama:
    "staff_members kendisiyle self join'lenir: m 'yönetici', e 'çalışan' rolünde, e.manager_id = m.staff_id bağıyla eşleşir. GROUP BY m.staff_id ile her yönetici için COUNT ve SUM hesaplanır — INNER JOIN kullanıldığı için hiç çalışanı olmayanlar (Nil Aksu gibi) sonuçta görünmez.",
  mod: "sonuc",
  takipSorusu: "Peki ya hiç doğrudan çalışanı olmayan yöneticileri de (0 çalışan, 0 maaş ile) rapora dahil etmen istenseydi?",
  takipCevabi:
    "JOIN'i INNER JOIN yerine LEFT JOIN yapman gerekirdi (staff_members m LEFT JOIN staff_members e ON ...) — bu sayede eşleşmesi olmayan yöneticiler de satırda kalır, COUNT(e.staff_id) doğal olarak 0, SUM(e.salary) ise NULL döner (COALESCE ile 0'a çevrilebilir).",
});
