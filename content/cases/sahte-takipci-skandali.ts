import { defineVaka } from "@/types/content";

export const sahteTakipciSkandali = defineVaka({
  slug: "sahte-takipci-skandali",
  seviye: "Orta",
  xp: 40,
  baslik: "Sahte Takipçi Skandalı",
  ozet:
    "Bir marka iki fenomen arasında kararsız. Takipçi kayıt cihazlarını incele, hangisinin takipçi tabanının 'bot çiftliği' olduğunu bul.",
  hikaye: `
Yerel bir kozmetik markası, sosyal medya iş birliği için iki fenomen arasında kararsız: Aslı Demirtaş ve Cansu Yıldırım. İkisinin de takipçi sayısı yüksek görünüyor ama marka ekibi bir şeyden şüpheleniyor — biri gerçek bir topluluk, diğeri "satın alınmış" hissi veriyor.

Sana takipçi kayıt veritabanına erişim verdiler. Aynı cihazdan birden fazla hesap açılıp açılmadığını kontrol et ve markanın parasını kime güvenle verebileceğini bul — ya da tam tersini, kimden uzak durmaları gerektiğini.
`.trim(),
  hedefler: [
    "takipciler tablosundaki cihaz_id sütununu incele — aynı cihazdan birden fazla hesap açılmış mı?",
    "GROUP BY cihaz_id + HAVING COUNT(*) > 1 ile şüpheli cihazları bul.",
    "Bu cihazların hangi fenomenin takipçi tabanına ait olduğunu JOIN ile ortaya çıkar.",
  ],
  ddl: `
CREATE TABLE fenomenler (id INTEGER PRIMARY KEY, ad TEXT NOT NULL);
INSERT INTO fenomenler (id, ad) VALUES (1,'Aslı Demirtaş'),(2,'Cansu Yıldırım');

CREATE TABLE takipciler (id INTEGER PRIMARY KEY, fenomen_id INTEGER NOT NULL, kullanici_adi TEXT NOT NULL, kayit_tarihi TEXT NOT NULL, cihaz_id TEXT NOT NULL);
INSERT INTO takipciler (id, fenomen_id, kullanici_adi, kayit_tarihi, cihaz_id) VALUES
 (1,1,'takipci_a1','2025-06-01 10:00:00','DVC-1001'),
 (2,1,'takipci_a2','2025-08-15 18:22:00','DVC-1002'),
 (3,1,'takipci_a3','2025-09-20 09:05:00','DVC-1003'),
 (4,1,'takipci_a4','2025-11-02 21:40:00','DVC-1004'),
 (5,1,'takipci_a5','2026-01-10 14:15:00','DVC-1005'),
 (6,2,'takipci_c1','2025-07-04 12:00:00','DVC-2001'),
 (7,2,'takipci_c2','2026-02-01 03:14:00','DVC-9009'),
 (8,2,'takipci_c3','2026-02-01 03:15:00','DVC-9009'),
 (9,2,'takipci_c4','2026-02-01 03:16:00','DVC-9010'),
 (10,2,'takipci_c5','2026-02-01 03:17:00','DVC-9009'),
 (11,2,'takipci_c6','2025-10-11 08:30:00','DVC-2002');
`.trim(),
  ipuclari: [
    "takipciler tablosunda cihaz_id'ye göre GROUP BY yap.",
    "HAVING COUNT(*) > 1 ile birden fazla hesabın paylaştığı cihazları bul.",
    "Bu şüpheli cihaz_id'lere sahip takipçilerin hangi fenomen_id'ye bağlı olduğunu JOIN'le kontrol et.",
  ],
  cozumSql: `
SELECT DISTINCT f.ad
FROM fenomenler f
JOIN takipciler t ON t.fenomen_id = f.id
WHERE t.cihaz_id IN (
  SELECT cihaz_id FROM takipciler GROUP BY cihaz_id HAVING COUNT(*) > 1
);
`.trim(),
  aciklama:
    "Rakamlar yalan söylemiyor: Cansu'nun takipçilerinden dördü, aynı gece saat 03:14 ile 03:17 arasında, sadece iki farklı cihazdan açılmış hesaplarmış — üstelik biri (DVC-9009) tam üç kere kullanılmış. Marka, iş birliğini iptal etti. Aslı Demirtaş ise dönemin en 'organik' fenomeni unvanını kazandı (ve markayı kaptı).",
  mod: "sonuc",
});
