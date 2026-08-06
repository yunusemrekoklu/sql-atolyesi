// Tüm içerik verisinin (veritabanları, dersler, alıştırmalar, mini quizler)
// gerçek sql.js üzerinde çalıştırılarak doğrulanması — hatalı bir çözüm SQL'i
// ya da kırık bir referans build'den önce burada yakalanır.
// Çalıştırma: npm run validate-content (npm run check'in bir parçası).
import initSqlJs, { type Database } from "sql.js";
import { TUM_DERSLER, getDersBySlug } from "../content/lessons";
import { TUM_PRATIK_SETLERI } from "../content/practice";
import { TUM_SINAV_SORULARI } from "../content/exams";
import { TUM_MULAKAT_SORULARI } from "../content/interview";
import { getSampleDatabase } from "../content/databases";

let hataSayisi = 0;

function hata(mesaj: string): void {
  hataSayisi++;
  console.error(`✗ ${mesaj}`);
}

async function main(): Promise<void> {
  const SQL = await initSqlJs();

  function tazeDb(ddl: string): Database {
    const db = new SQL.Database();
    db.run(ddl);
    return db;
  }

  const gorulenDersSluglari = new Set<string>();
  const gorulenAlistirmaIdleri = new Set<string>();

  for (const ders of TUM_DERSLER) {
    console.log(`Kontrol ediliyor: ${ders.dersNo} ${ders.baslik} (${ders.slug})`);

    if (gorulenDersSluglari.has(ders.slug)) {
      hata(`Tekrarlanan ders slug'ı: "${ders.slug}"`);
    }
    gorulenDersSluglari.add(ders.slug);

    let veritabani;
    try {
      veritabani = getSampleDatabase(ders.veritabaniId);
    } catch (err) {
      hata(`${ders.slug}: veritabaniId "${ders.veritabaniId}" bulunamadı — ${(err as Error).message}`);
      continue;
    }

    try {
      tazeDb(veritabani.ddl).close();
    } catch (err) {
      hata(`${ders.slug}: "${veritabani.id}" DDL'i kurulamadı — ${(err as Error).message}`);
      continue;
    }

    ders.ornekler.forEach((ornek, i) => {
      const db = tazeDb(veritabani.ddl);
      try {
        db.exec(ornek.sql);
      } catch (err) {
        hata(`${ders.slug}: örnek #${i + 1} SQL hatası — ${(err as Error).message}\n   SQL: ${ornek.sql}`);
      } finally {
        db.close();
      }
    });

    for (const tablo of ders.onizlemeTablolari ?? []) {
      const db = tazeDb(veritabani.ddl);
      try {
        db.exec(`SELECT * FROM "${tablo}";`);
      } catch (err) {
        hata(`${ders.slug}: onizlemeTablolari içindeki "${tablo}" tablosu bulunamadı — ${(err as Error).message}`);
      } finally {
        db.close();
      }
    }

    for (const alistirma of ders.alistirmalar) {
      if (gorulenAlistirmaIdleri.has(alistirma.id)) {
        hata(`Tekrarlanan alıştırma id'si (tüm site genelinde benzersiz olmalı): "${alistirma.id}"`);
      }
      gorulenAlistirmaIdleri.add(alistirma.id);

      const db = tazeDb(veritabani.ddl);
      try {
        const sonuc = db.exec(alistirma.cozumSql);
        if (alistirma.mod === "sonuc" && (sonuc.length === 0 || sonuc[0].values.length === 0)) {
          hata(`${ders.slug} / ${alistirma.id}: mod "sonuc" ama çözüm sorgusu hiç satır döndürmüyor.`);
        }
      } catch (err) {
        hata(`${ders.slug} / ${alistirma.id}: çözüm SQL hatası — ${(err as Error).message}\n   SQL: ${alistirma.cozumSql}`);
      } finally {
        db.close();
      }
    }

    const gorulenQuizIdleri = new Set<string>();
    if (ders.miniQuiz.length === 0) {
      hata(`${ders.slug}: miniQuiz boş olamaz.`);
    }
    for (const soru of ders.miniQuiz) {
      if (gorulenQuizIdleri.has(soru.id)) {
        hata(`${ders.slug}: tekrarlanan quiz soru id'si: "${soru.id}"`);
      }
      gorulenQuizIdleri.add(soru.id);

      if (soru.secenekler.length < 2) {
        hata(`${ders.slug} / ${soru.id}: en az 2 seçenek olmalı (${soru.secenekler.length} var).`);
      }
      if (soru.dogruIndex < 0 || soru.dogruIndex >= soru.secenekler.length) {
        hata(`${ders.slug} / ${soru.id}: dogruIndex (${soru.dogruIndex}) seçenekler dizisinin dışında.`);
      }
    }
  }

  const gorulenPratikSluglari = new Set<string>();

  for (const set of TUM_PRATIK_SETLERI) {
    console.log(`Kontrol ediliyor (pratik): ${set.baslik} (${set.slug})`);

    if (gorulenPratikSluglari.has(set.slug)) {
      hata(`Tekrarlanan pratik seti slug'ı: "${set.slug}"`);
    }
    gorulenPratikSluglari.add(set.slug);

    let veritabani;
    try {
      veritabani = getSampleDatabase(set.veritabaniId);
    } catch (err) {
      hata(`${set.slug}: veritabaniId "${set.veritabaniId}" bulunamadı — ${(err as Error).message}`);
      continue;
    }

    if (set.sorular.length === 0) {
      hata(`${set.slug}: sorular boş olamaz.`);
    }

    for (const soru of set.sorular) {
      if (gorulenAlistirmaIdleri.has(soru.id)) {
        hata(`Tekrarlanan alıştırma id'si (tüm site genelinde benzersiz olmalı): "${soru.id}"`);
      }
      gorulenAlistirmaIdleri.add(soru.id);

      const db = tazeDb(veritabani.ddl);
      try {
        const sonuc = db.exec(soru.cozumSql);
        if (soru.mod === "sonuc" && (sonuc.length === 0 || sonuc[0].values.length === 0)) {
          hata(`${set.slug} / ${soru.id}: mod "sonuc" ama çözüm sorgusu hiç satır döndürmüyor.`);
        }
      } catch (err) {
        hata(`${set.slug} / ${soru.id}: çözüm SQL hatası — ${(err as Error).message}\n   SQL: ${soru.cozumSql}`);
      } finally {
        db.close();
      }
    }
  }

  const gorulenSinavSoruIdleri = new Set<string>();

  console.log(`Kontrol ediliyor (sınav): ${TUM_SINAV_SORULARI.length} soru`);
  for (const soru of TUM_SINAV_SORULARI) {
    if (gorulenSinavSoruIdleri.has(soru.id)) {
      hata(`Tekrarlanan sınav soru id'si: "${soru.id}"`);
    }
    gorulenSinavSoruIdleri.add(soru.id);

    if (soru.secenekler.length < 2) {
      hata(`sinav / ${soru.id}: en az 2 seçenek olmalı (${soru.secenekler.length} var).`);
    }
    if (soru.dogruIndex < 0 || soru.dogruIndex >= soru.secenekler.length) {
      hata(`sinav / ${soru.id}: dogruIndex (${soru.dogruIndex}) seçenekler dizisinin dışında.`);
    }
    if (!getDersBySlug(soru.dersSlug)) {
      hata(`sinav / ${soru.id}: dersSlug "${soru.dersSlug}" bulunamadı (bkz. content/lessons).`);
    }
  }

  const gorulenMulakatSluglari = new Set<string>();

  console.log(`Kontrol ediliyor (mülakat): ${TUM_MULAKAT_SORULARI.length} soru`);
  for (const soru of TUM_MULAKAT_SORULARI) {
    if (gorulenMulakatSluglari.has(soru.slug)) {
      hata(`Tekrarlanan mülakat soru slug'ı: "${soru.slug}"`);
    }
    gorulenMulakatSluglari.add(soru.slug);

    if (soru.ipuclari.length === 0) {
      hata(`mulakat / ${soru.slug}: ipuclari boş olamaz.`);
    }
    if (soru.takipSorusu.trim() === "" || soru.takipCevabi.trim() === "") {
      hata(`mulakat / ${soru.slug}: takipSorusu ve takipCevabi boş olamaz.`);
    }

    let db: Database;
    try {
      db = tazeDb(soru.ddl);
    } catch (err) {
      hata(`mulakat / ${soru.slug}: DDL kurulamadı — ${(err as Error).message}`);
      continue;
    }
    db.close();

    for (const tablo of soru.onizlemeTablolari ?? []) {
      const onizlemeDb = tazeDb(soru.ddl);
      try {
        onizlemeDb.exec(`SELECT * FROM "${tablo}";`);
      } catch (err) {
        hata(`mulakat / ${soru.slug}: onizlemeTablolari içindeki "${tablo}" tablosu bulunamadı — ${(err as Error).message}`);
      } finally {
        onizlemeDb.close();
      }
    }

    const cozumDb = tazeDb(soru.ddl);
    try {
      const sonuc = cozumDb.exec(soru.cozumSql);
      if (soru.mod === "sonuc" && (sonuc.length === 0 || sonuc[0].values.length === 0)) {
        hata(`mulakat / ${soru.slug}: mod "sonuc" ama çözüm sorgusu hiç satır döndürmüyor.`);
      }
    } catch (err) {
      hata(`mulakat / ${soru.slug}: çözüm SQL hatası — ${(err as Error).message}\n   SQL: ${soru.cozumSql}`);
    } finally {
      cozumDb.close();
    }
  }

  if (hataSayisi > 0) {
    console.error(`\n${hataSayisi} içerik hatası bulundu.`);
    process.exit(1);
  }
  console.log(
    `\nTüm içerik doğrulandı: ${TUM_DERSLER.length} ders, ${TUM_PRATIK_SETLERI.length} pratik seti, ${TUM_SINAV_SORULARI.length} sınav sorusu, ${TUM_MULAKAT_SORULARI.length} mülakat sorusu, hata yok.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
