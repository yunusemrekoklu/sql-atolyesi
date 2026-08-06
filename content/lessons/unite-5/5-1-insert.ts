import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const insert = defineLesson({
  slug: "insert",
  uniteId: 5,
  dersNo: "5.1",
  baslik: "INSERT",
  veritabaniId: kargoDb.id,
  anlatim: `
Şimdiye kadar hep **var olan** veriyi sorguladın. Bu üniteden itibaren veriyi kendin **değiştireceksin**: ekleyecek, güncelleyecek ve sileceksin. Yeni bir veritabanı olan \`kargo\`'yu kullanacağız: şubeler, kuryeler ve gönderiler.

## Temel INSERT söz dizimi

\`\`\`sql
INSERT INTO branches (branch_id, branch_name, city, opening_date)
VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01');
\`\`\`

- \`INSERT INTO <tablo> (<kolon listesi>) VALUES (<değerler>);\`
- Kolon listesi yazmak **zorunlu değildir** ama şiddetle önerilir — hem sorguyu daha okunaklı yapar hem de tablonun kolon sırası ileride değişirse sorgunu bozulmaktan korur.
- Bir kolonu kolon listesinde ve \`VALUES\`'ta belirtmezsen, o kolon (nullable ise) \`NULL\` olur, ya da bir \`DEFAULT\` değeri varsa o kullanılır.

## Çoklu satır ekleme

Tek bir \`INSERT\` ile birden fazla satır ekleyebilirsin — parantez grupları arasına virgül koyman yeterli:

\`\`\`sql
INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES
  (7, 'Yıldırım Şube', 'Bursa', '2025-05-01'),
  (8, 'Osmangazi Şube', 'Bursa', '2025-06-01');
\`\`\`

## Dikkat: Primary Key çakışması

\`branch_id\` bir \`PRIMARY KEY\` olduğu için, veritabanında zaten var olan bir \`branch_id\` değerini tekrar eklemeye çalışırsan SQL hata verir ("UNIQUE constraint failed"). Bu yüzden yeni satır eklerken, o tabloda henüz kullanılmamış bir ID seçmelisin.
`,
  ornekler: [
    { aciklama: "Yeni bir şube ekle:", sql: "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01');" },
  ],
  onizlemeTablolari: ["branches", "couriers", "shipments"],
  alistirmalar: [
    {
      id: "5-1-1",
      seviye: "Kolay",
      baslik: "Yeni Şube",
      soru: "branches tablosuna branch_id=7, branch_name='Yıldırım Şube', city='Bursa', opening_date='2025-05-01' değerleriyle yeni bir satır ekleyen bir sorgu yaz.",
      ipucu: "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (...); kalıbını kullanabilirsin.",
      cozumSql: "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-1-2",
      seviye: "Kolay",
      baslik: "Yeni Kurye",
      soru: "couriers tablosuna courier_id=13, full_name='Deniz Aydın', branch_id=1, vehicle_type='Motosiklet', hire_date='2025-06-01' değerleriyle yeni bir satır ekleyen bir sorgu yaz.",
      ipucu: "INSERT INTO couriers (courier_id, full_name, branch_id, vehicle_type, hire_date) VALUES (...); kalıbını kullanabilirsin.",
      cozumSql: "INSERT INTO couriers (courier_id, full_name, branch_id, vehicle_type, hire_date) VALUES (13, 'Deniz Aydın', 1, 'Motosiklet', '2025-06-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-1-3",
      seviye: "Orta",
      baslik: "Teslim Tarihi Olmayan Gönderi",
      soru: "shipments tablosuna shipment_id=25, courier_id=1, origin_branch_id=1, destination_city='Trabzon', weight_kg=2.0, status='Yolda', ship_date='2025-02-01' değerleriyle yeni bir gönderi ekle — delivery_date'i kolon listesine hiç dahil etme (henüz teslim edilmediği için otomatik NULL kalsın).",
      ipucu: "Kolon listesinde delivery_date'i yazma; belirtilmeyen nullable bir kolon otomatik olarak NULL olur.",
      cozumSql:
        "INSERT INTO shipments (shipment_id, courier_id, origin_branch_id, destination_city, weight_kg, status, ship_date) VALUES (25, 1, 1, 'Trabzon', 2.0, 'Yolda', '2025-02-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-1-4",
      seviye: "Orta",
      baslik: "İki Yeni Şube Birden",
      soru: "branches tablosuna tek bir INSERT ifadesiyle iki yeni şube ekle: (branch_id=7, 'Yıldırım Şube', 'Bursa', '2025-05-01') ve (branch_id=8, 'Osmangazi Şube', 'Bursa', '2025-06-01').",
      ipucu: "VALUES'tan sonra iki parantez grubunu virgülle ayırarak yaz.",
      cozumSql:
        "INSERT INTO branches (branch_id, branch_name, city, opening_date) VALUES (7, 'Yıldırım Şube', 'Bursa', '2025-05-01'), (8, 'Osmangazi Şube', 'Bursa', '2025-06-01');",
      mod: "tabloDurumu",
    },
    {
      id: "5-1-5",
      seviye: "Zor",
      baslik: "Kurye ve İlk Gönderisi",
      soru: "Aynı sorgu içinde iki ayrı INSERT ifadesi yaz: önce courier_id=13, full_name='Deniz Aydın', branch_id=1, vehicle_type='Motosiklet', hire_date='2025-06-01' değerleriyle couriers'a bir kurye ekle; sonra shipment_id=25, courier_id=13, origin_branch_id=1, destination_city='Ankara', weight_kg=1.5, status='Yolda', ship_date='2025-06-05' değerleriyle shipments'a bu kuryenin ilk gönderisini ekle.",
      ipucu: "İki INSERT ifadesini noktalı virgülle ayırarak aynı editöre yaz — ikisi de aynı sorguda çalışacak.",
      cozumSql:
        "INSERT INTO couriers (courier_id, full_name, branch_id, vehicle_type, hire_date) VALUES (13, 'Deniz Aydın', 1, 'Motosiklet', '2025-06-01'); INSERT INTO shipments (shipment_id, courier_id, origin_branch_id, destination_city, weight_kg, status, ship_date) VALUES (25, 13, 1, 'Ankara', 1.5, 'Yolda', '2025-06-05');",
      mod: "tabloDurumu",
    },
  ],
  miniQuiz: [
    {
      id: "5-1-q1",
      soru: "INSERT INTO tablo (kolon1, kolon2) VALUES (deger1, deger2); ifadesinde kolon listesi yazmak neden önerilir?",
      secenekler: [
        "Yazmasan da fark etmez, tamamen dekoratiftir",
        "Sorguyu daha okunaklı yapar ve tablonun kolon sırası değişirse sorgunun bozulmasını önler",
        "SQL, kolon listesi olmadan INSERT'i hiç çalıştırmaz",
        "Sadece PRIMARY KEY'i olmayan tablolarda gereklidir",
      ],
      dogruIndex: 1,
      aciklama: "Kolon listesi olmadan INSERT de çalışır (VALUES'taki sıra tablo tanımındaki sırayla eşleşmelidir) ama listesiz kullanım, tablo yapısı değiştiğinde kırılgandır.",
    },
    {
      id: "5-1-q2",
      soru: "Tek bir INSERT ifadesiyle birden fazla satır eklemek için ne yaparsın?",
      secenekler: [
        "Bu mümkün değildir, her satır için ayrı INSERT gerekir",
        "VALUES'tan sonra birden fazla parantez grubunu virgülle ayırırsın",
        "INSERT MULTIPLE anahtar kelimesini kullanırsın",
        "WHERE koşuluna birden fazla değer yazarsın",
      ],
      dogruIndex: 1,
      aciklama: "VALUES (a, b), (c, d), (e, f); şeklinde birden fazla parantez grubu yazarak tek ifadeyle çoklu satır ekleyebilirsin.",
    },
    {
      id: "5-1-q3",
      soru: "Zaten var olan bir PRIMARY KEY değerini (ör. branch_id=1) tekrar eklemeye çalışırsan ne olur?",
      secenekler: [
        "SQL sessizce eski satırın üzerine yazar",
        "SQL bir hata verir (UNIQUE constraint failed)",
        "Yeni satır otomatik olarak farklı bir ID alır",
        "Hiçbir şey olmaz, satır basitçe yok sayılır",
      ],
      dogruIndex: 1,
      aciklama: "PRIMARY KEY sütunları benzersiz olmak zorundadır; aynı değeri tekrar eklemeye çalışmak bir kısıt ihlali hatasına yol açar.",
    },
    {
      id: "5-1-q4",
      soru: "Bir kolonu INSERT'in kolon listesinde ve VALUES'ta hiç belirtmezsen ne olur?",
      secenekler: [
        "Sorgu her zaman hata verir",
        "Kolon nullable ise NULL olur, bir DEFAULT değeri varsa o kullanılır",
        "Kolon otomatik olarak 0 ya da boş metin olur",
        "Kolon, tablodan tamamen silinir",
      ],
      dogruIndex: 1,
      aciklama: "Belirtilmeyen bir kolon, NOT NULL kısıtı yoksa NULL olur; bir DEFAULT değeri tanımlıysa o değer kullanılır.",
    },
  ],
});
