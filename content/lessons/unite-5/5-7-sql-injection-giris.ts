import { defineLesson } from "@/types/content";
import { kargoDb } from "@/content/databases/kargo";

export const sqlInjectionGiris = defineLesson({
  slug: "sql-injection-giris",
  uniteId: 5,
  dersNo: "5.7",
  baslik: "SQL Injection'a Giriş",
  veritabaniId: kargoDb.id,
  anlatim: `
Bu ders diğerlerinden farklı — yeni bir SQL komutu öğretmiyor, SQL'in **kötüye nasıl kullanılabileceğini** ve buna karşı nasıl korunacağını anlatıyor. Farkındalık kazanman, hem CV'nde hem gerçek işte seni öne çıkaracak bir konu.

## Sorun: kullanıcı girdisini SQL'e "yapıştırmak"

Bir web uygulaması genelde şöyle çalışır: kullanıcı bir form doldurur, uygulama bu girdiyi bir SQL sorgusuna **metin birleştirme (string concatenation)** ile ekler:

\`\`\`
sorgu = "SELECT * FROM couriers WHERE full_name = '" + kullanici_girdisi + "'"
\`\`\`

Kullanıcı normal bir isim yazarsa sorun yok. Ama kullanıcı (ya da bir saldırgan) \`full_name\` kutusuna şunu yazarsa:

\`\`\`
' OR '1'='1
\`\`\`

Sorgu şu hale gelir:

\`\`\`sql
SELECT * FROM couriers WHERE full_name = '' OR '1'='1'
\`\`\`

\`'1'='1'\` her zaman DOĞRU olduğu için \`WHERE\` koşulu **tüm satırları** seçer — saldırgan, tek bir kişiyi aramak yerine tablodaki **her kuryeyi** görür. Bu tekniğe **SQL injection (SQL enjeksiyonu)** denir.

## Yorum satırı (--) tekniği

Saldırganlar bazen sorgunun geri kalanını **etkisiz hale getirmek** için SQL'in yorum satırı işaretini (\`--\`) kullanır. \`--\`'dan sonraki her şey, aynı satırda, SQL tarafından yok sayılır. Böylece orijinal sorgunun sonundaki ek koşullar (ör. \`AND branch_id = 99\`) devre dışı bırakılabilir.

## Çözüm: parametreli sorgular (prepared statements)

Gerçek uygulamalarda kullanıcı girdisi **asla** doğrudan SQL metnine yapıştırılmaz. Bunun yerine bir **yer tutucu** (\`?\` ya da \`:isim\`) kullanılır; veritabanı sürücüsü, yer tutucuya bağlanan değeri **her zaman düz bir veri** olarak ele alır, asla SQL kodu olarak yorumlamaz:

\`\`\`sql
SELECT * FROM couriers WHERE full_name = ?;
-- full_name değeri, kod tarafında ayrı ve güvenli şekilde bağlanır
\`\`\`

Bu derste, aşağıdaki alıştırmalarda enjekte edilmiş bir sorgunun **çalıştırıldığında ne olacağını** göreceksin — amaç, bu tekniği kötüye kullanmak değil, onu tanıyıp koddaki tehlikeli birleştirmeleri fark edebilmek.
`,
  ornekler: [
    { aciklama: "Enjeksiyon sonrası oluşan sorgu (' OR '1'='1 girildiğinde):", sql: "SELECT * FROM couriers WHERE full_name = '' OR '1'='1';" },
  ],
  onizlemeTablolari: ["couriers", "shipments"],
  alistirmalar: [
    {
      id: "5-7-1",
      seviye: "Kolay",
      baslik: "Kurye Sızıntısı",
      soru: "Bir kullanıcının full_name arama kutusuna ' OR '1'='1 yazdığını düşün. Bu girdiyle oluşan (ve tüm kuryeleri sızdıran) sorguyu birebir yaz.",
      ipucu: "WHERE full_name = '' OR '1'='1' kalıbı, koşulu her zaman DOĞRU yapar.",
      cozumSql: "SELECT * FROM couriers WHERE full_name = '' OR '1'='1';",
      mod: "sonuc",
    },
    {
      id: "5-7-2",
      seviye: "Orta",
      baslik: "Gönderi Sızıntısı",
      soru: "Aynı tekniğin shipments tablosunda status alanına uygulandığını düşün (girdi: ' OR '1'='1). Bu enjeksiyon sonucu oluşan, TÜM gönderileri getiren sorguyu yaz.",
      ipucu: "WHERE status = '' OR '1'='1' kalıbını kullanabilirsin.",
      cozumSql: "SELECT * FROM shipments WHERE status = '' OR '1'='1';",
      mod: "sonuc",
    },
    {
      id: "5-7-3",
      seviye: "Orta",
      baslik: "Sayısal Alanda Enjeksiyon",
      soru: "Tırnak gerektirmeyen (sayısal) bir alanda da enjeksiyon mümkündür. branch_id alanına 0 OR 1=1 girildiğini düşünerek, TÜM şubeleri getiren sorguyu yaz.",
      ipucu: "WHERE branch_id = 0 OR 1=1 kalıbını kullanabilirsin — 1=1 her zaman doğru olduğu için tüm satırlar döner.",
      cozumSql: "SELECT * FROM branches WHERE branch_id = 0 OR 1=1;",
      mod: "sonuc",
    },
    {
      id: "5-7-4",
      seviye: "Zor",
      baslik: "Yorum Satırı Tekniği",
      soru: "Orijinal (güvensiz) sorgunun 'WHERE full_name = ? AND branch_id = 99' şeklinde olduğunu ve kullanıcının full_name alanına ' OR '1'='1' -- girdiğini düşün. -- işaretinin AND branch_id = 99 kısmını nasıl etkisiz hale getirdiğini gösteren sorguyu yaz.",
      ipucu: "SELECT * FROM couriers WHERE full_name = '' OR '1'='1' -- ' AND branch_id = 99; yaz — -- işaretinden sonraki her şey yorum sayılır ve çalışmaz.",
      cozumSql: "SELECT * FROM couriers WHERE full_name = '' OR '1'='1' -- ' AND branch_id = 99;",
      mod: "sonuc",
    },
    {
      id: "5-7-5",
      seviye: "Zor",
      baslik: "Güvenli Sorgunun Beklenen Davranışı",
      soru: "Şimdi enjeksiyon OLMADAN, normal ve güvenli bir arama yap: full_name'i tam olarak 'Serdar Yalçın' olan kuryeyi getiren bir sorgu yaz — sonucun (enjeksiyonlu versiyondan farklı olarak) sadece 1 kayıt döndürdüğünü gözlemle.",
      ipucu: "WHERE full_name = 'Serdar Yalçın' kalıbını kullanabilirsin — burada '1'='1' gibi her zaman doğru olan bir parça yok.",
      cozumSql: "SELECT * FROM couriers WHERE full_name = 'Serdar Yalçın';",
      mod: "sonuc",
    },
  ],
  miniQuiz: [
    {
      id: "5-7-q1",
      soru: "SQL injection saldırısının temel nedeni nedir?",
      secenekler: [
        "SQLite'ın eski bir sürüm olması",
        "Kullanıcı girdisinin, doğrulanmadan/ayrıştırılmadan doğrudan SQL sorgu metnine birleştirilmesi",
        "Veritabanında çok fazla tablo olması",
        "INDEX kullanılmaması",
      ],
      dogruIndex: 1,
      aciklama: "SQL injection, kullanıcıdan gelen bir metnin ham haliyle SQL sorgusuna eklenip, SQL kodu gibi yorumlanmasından kaynaklanır.",
    },
    {
      id: "5-7-q2",
      soru: "' OR '1'='1 gibi bir girdi neden tehlikelidir?",
      secenekler: [
        "Hiçbir etkisi yoktur",
        "WHERE koşulunu her zaman DOĞRU yaparak, filtrelemeyi etkisiz hale getirir ve tüm satırları açığa çıkarır",
        "Veritabanını otomatik olarak yedekler",
        "Sadece sorguyu yavaşlatır, veri sızdırmaz",
      ],
      dogruIndex: 1,
      aciklama: "'1'='1' ifadesi her zaman doğru olduğu için OR ile birleştiğinde tüm WHERE koşulunu anlamsız hale getirir ve tüm satırlar sonuca dahil olur.",
    },
    {
      id: "5-7-q3",
      soru: "SQL'de -- işareti ne işe yarar ve bu neden enjeksiyonda kullanılır?",
      secenekler: [
        "Çıkarma işlemi yapar, enjeksiyonla ilgisi yoktur",
        "Aynı satırdaki geri kalan metni yorum (comment) yapar; saldırgan bunu orijinal sorgunun geri kalanını etkisiz hale getirmek için kullanır",
        "Bir tabloyu siler",
        "SQL'de böyle bir işaret yoktur",
      ],
      dogruIndex: 1,
      aciklama: "-- işaretinden sonraki her şey SQL tarafından yorum sayılıp çalıştırılmaz; saldırganlar bunu, orijinal sorgunun geri kalan koşullarını devre dışı bırakmak için kullanabilir.",
    },
    {
      id: "5-7-q4",
      soru: "Parametreli sorgular (prepared statements) SQL injection'ı nasıl önler?",
      secenekler: [
        "Kullanıcı girdisini yasaklayarak",
        "Kullanıcı girdisini her zaman düz veri olarak ele alır, asla SQL kodu olarak yorumlamaz",
        "Veritabanını şifreleyerek",
        "Sadece sayısal girdilere izin vererek",
      ],
      dogruIndex: 1,
      aciklama: "Parametreli sorgularda kullanıcı girdisi, sorgu metnine hiç karışmaz; ayrı bir kanaldan 'değer' olarak bağlanır, bu yüzden SQL kodu gibi yorumlanamaz.",
    },
    {
      id: "5-7-q5",
      soru: "Bu derste enjekte edilmiş sorguları neden çalıştırdık?",
      secenekler: [
        "Gerçek bir sistemde saldırı yapmayı öğretmek için",
        "Tekniği tanıyıp, kod yazarken kullanıcı girdisini SQL'e doğrudan birleştirmenin tehlikesini fark edebilmek için",
        "Bu tür sorguların performansını ölçmek için",
        "SQLite'ın bir hatasını göstermek için",
      ],
      dogruIndex: 1,
      aciklama: "Amaç, bu deseni tanıyarak gerçek kod yazarken kullanıcı girdisini asla ham haliyle SQL'e eklememen gerektiğini içselleştirmek.",
    },
  ],
});
