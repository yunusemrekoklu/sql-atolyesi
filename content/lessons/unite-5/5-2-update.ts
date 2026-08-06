import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const update = defineLesson({
  slug: "update",
  uniteId: 5,
  dersNo: "5.2",
  baslik: "UPDATE",
  veritabaniId: kargoDb.id,
  anlatim: `
Var olan satırların değerlerini değiştirmek için \`UPDATE\` kullanılır.

## Temel söz dizimi

\`\`\`sql
UPDATE shipments
SET status = 'Teslim Edildi', delivery_date = '2025-02-05'
WHERE shipment_id = 3;
\`\`\`

- \`SET\` ile bir ya da birden fazla kolonu (virgülle ayırarak) yeni değerlere ata.
- \`WHERE\`, hangi satırların güncelleneceğini belirler — tıpkı \`SELECT\`'teki gibi çalışır.

## ⚠️ En tehlikeli hata: WHERE'siz UPDATE

\`\`\`sql
-- DİKKAT: Bu, TÜM gönderilerin durumunu değiştirir!
UPDATE shipments SET status = 'İptal';
\`\`\`

\`WHERE\` yazmayı unutursan, \`UPDATE\` tablodaki **her satırı** günceller. Bu, gerçek dünyada en sık yapılan ve en yıkıcı SQL hatalarından biridir — bir müşterinin siparişini güncellemek isterken yanlışlıkla tüm müşterilerin siparişlerini bozabilirsin. **Her UPDATE yazdığında, çalıştırmadan önce WHERE koşulunu iki kez kontrol et.**

Güvenli bir alışkanlık: önce aynı \`WHERE\` koşuluyla bir \`SELECT\` çalıştırıp hangi satırların etkileneceğini gör, sonra \`UPDATE\`'e geç.

## SET içinde ifade kullanmak

\`SET\`'te bir kolonun **mevcut değerine göre** yeni bir değer hesaplayabilirsin:

\`\`\`sql
UPDATE shipments SET weight_kg = weight_kg - 0.5 WHERE weight_kg > 5;
\`\`\`

Burada \`weight_kg - 0.5\`, her satırın **kendi** \`weight_kg\` değerinden 0.5 çıkarır — sabit bir değer değil, satıra özel bir hesaplama.
`,
  ornekler: [
    { aciklama: "Bir gönderiyi teslim edildi olarak işaretle:", sql: "UPDATE shipments SET status = 'Teslim Edildi', delivery_date = '2025-02-05' WHERE shipment_id = 3;" },
  ],
  onizlemeTablolari: ["shipments", "couriers"],
  alistirmalar: [
    {
      id: "5-2-1",
      seviye: "Kolay",
      baslik: "Tek Gönderi Güncelleme",
      soru: "shipment_id'si 1 olan gönderinin status'ünü 'Yolda' yapan bir sorgu yaz.",
      ipucu: "UPDATE shipments SET status = 'Yolda' WHERE shipment_id = 1; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE shipments SET status = 'Yolda' WHERE shipment_id = 1;",
      mod: "tabloDurumu",
    },
    {
      id: "5-2-2",
      seviye: "Kolay",
      baslik: "Kurye Aracını Değiştir",
      soru: "courier_id'si 12 olan kuryenin vehicle_type'ını 'Motosiklet' yapan bir sorgu yaz.",
      ipucu: "UPDATE couriers SET vehicle_type = 'Motosiklet' WHERE courier_id = 12; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE couriers SET vehicle_type = 'Motosiklet' WHERE courier_id = 12;",
      mod: "tabloDurumu",
    },
    {
      id: "5-2-3",
      seviye: "Orta",
      baslik: "Bekleyenleri Yola Çıkar",
      soru: "status'ü 'Beklemede' olan tüm gönderilerin status'ünü 'Yolda' yapan bir sorgu yaz.",
      ipucu: "UPDATE shipments SET status = 'Yolda' WHERE status = 'Beklemede'; kalıbını kullanabilirsin — bu, birden fazla satırı aynı anda etkiler.",
      cozumSql: "UPDATE shipments SET status = 'Yolda' WHERE status = 'Beklemede';",
      mod: "tabloDurumu",
    },
    {
      id: "5-2-4",
      seviye: "Orta",
      baslik: "Şube Bazlı Araç Güncellemesi",
      soru: "branch_id'si 1 olan şubedeki tüm kuryelerin vehicle_type'ını 'Minivan' yapan bir sorgu yaz.",
      ipucu: "UPDATE couriers SET vehicle_type = 'Minivan' WHERE branch_id = 1; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE couriers SET vehicle_type = 'Minivan' WHERE branch_id = 1;",
      mod: "tabloDurumu",
    },
    {
      id: "5-2-5",
      seviye: "Zor",
      baslik: "Ağır Gönderileri Yeniden Değerlendir",
      soru: "weight_kg'si 5'ten büyük olan gönderilerin status'ünü 'Beklemede' yap VE weight_kg değerini 0.5 azalt (aynı UPDATE'te iki kolonu birden güncelle).",
      ipucu: "SET status = 'Beklemede', weight_kg = weight_kg - 0.5 WHERE weight_kg > 5; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE shipments SET status = 'Beklemede', weight_kg = weight_kg - 0.5 WHERE weight_kg > 5;",
      mod: "tabloDurumu",
    },
    {
      id: "5-2-6",
      seviye: "Zor",
      baslik: "İptalleri Yeniden Aktive Et",
      soru: "status'ü 'İptal' olan gönderilerin status'ünü 'Yolda' yap VE delivery_date'ini NULL yap (bu gönderiler yeniden yola çıkıyor).",
      ipucu: "SET status = 'Yolda', delivery_date = NULL WHERE status = 'İptal'; kalıbını kullanabilirsin.",
      cozumSql: "UPDATE shipments SET status = 'Yolda', delivery_date = NULL WHERE status = 'İptal';",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-2-q1",
      soru: "UPDATE shipments SET status = 'İptal'; (WHERE'siz) çalıştırırsan ne olur?",
      secenekler: [
        "Hiçbir şey olmaz, SQL bunu otomatik reddeder",
        "shipments tablosundaki TÜM satırların status'ü 'İptal' olur",
        "Sadece ilk satır güncellenir",
        "Sadece status'ü zaten 'İptal' olan satırlar etkilenir",
      ],
      dogruIndex: 1,
      aciklama: "WHERE koşulu olmayan bir UPDATE, tablodaki her satırı günceller — bu, en yaygın ve en yıkıcı SQL hatalarından biridir.",
    },
    {
      id: "5-2-q2",
      soru: "Bir UPDATE çalıştırmadan önce hangi satırların etkileneceğini görmek için güvenli bir alışkanlık nedir?",
      secenekler: [
        "Doğrudan UPDATE'i çalıştırıp sonucu gözlemlemek",
        "Aynı WHERE koşuluyla önce bir SELECT çalıştırıp etkilenecek satırları görmek",
        "Her zaman tüm tabloyu silip yeniden oluşturmak",
        "WHERE koşulunu hiç yazmamak",
      ],
      dogruIndex: 1,
      aciklama: "Aynı WHERE koşuluyla önce SELECT çalıştırmak, UPDATE'in tam olarak hangi satırları etkileyeceğini güvenli bir şekilde önceden görmeni sağlar.",
    },
    {
      id: "5-2-q3",
      soru: "SET weight_kg = weight_kg - 0.5 ifadesi ne yapar?",
      secenekler: [
        "Tüm satırların weight_kg'sini sabit olarak 0.5 yapar",
        "Her satırın weight_kg'sini KENDİ mevcut değerinden 0.5 azaltır",
        "weight_kg sütununu tablodan siler",
        "Sadece weight_kg'si 0.5 olan satırları etkiler",
      ],
      dogruIndex: 1,
      aciklama: "SET içinde kolonun kendisini kullanmak, her satırın kendi mevcut değerine göre bir hesaplama yapmanı sağlar.",
    },
    {
      id: "5-2-q4",
      soru: "Bir UPDATE'te SET ile birden fazla kolonu aynı anda güncellemek istersen ne yaparsın?",
      secenekler: [
        "Birden fazla UPDATE ifadesi yazman zorunludur",
        "SET'ten sonra kolon = değer çiftlerini virgülle ayırarak yazarsın",
        "Bu, SQL'de mümkün değildir",
        "SET yerine WHERE içine yazarsın",
      ],
      dogruIndex: 1,
      aciklama: "SET kolon1 = deger1, kolon2 = deger2 şeklinde virgülle ayırarak aynı UPDATE'te birden fazla kolonu güncelleyebilirsin.",
    },
  ],
});
