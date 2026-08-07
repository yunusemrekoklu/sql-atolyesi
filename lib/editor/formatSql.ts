/**
 * Hafif dokunuşlu SQL biçimlendirici — salt-okunur gösterimler (örnek/çözüm
 * kod blokları) içindir. Kısa sorgular tek satırda kalır; uzun sorgularda
 * sadece ana klozlardan (WHERE, GROUP BY, JOIN, ...) önce satır kırılır —
 * `SELECT ... FROM ...` bir arada tutulur. Genel amaçlı bir SQL formatter
 * (ör. her sütunu ayrı satıra bölen kütüphaneler) yerine bilinçli olarak
 * bu daha sade stil tercih edildi.
 */

const UZUN_SORGU_ESIGI = 70;

const KIRILMA_ANAHTAR_KELIMELERI = [
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "WHERE",
  "LIMIT",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "JOIN",
  "UNION ALL",
  "UNION",
  "INTERSECT",
  "EXCEPT",
  "VALUES",
  "SET",
  "ON CONFLICT",
];

/**
 * `CREATE TABLE ad (sütun1 ..., sütun2 ..., ...)` gövdesini sütun tanımlarına
 * göre satırlara böler — parantez derinliği ve tırnak içi virgülleri/parantezleri
 * dikkate alır (ör. `CHECK (x BETWEEN 1 AND 5)`, `REFERENCES tablo(sutun)`).
 */
function createTableSutunlaraBol(tekSatir: string): string {
  const acilisIndex = tekSatir.indexOf("(");
  if (acilisIndex === -1) return tekSatir;

  const bas = tekSatir.slice(0, acilisIndex + 1);
  const govde = tekSatir.slice(acilisIndex + 1);

  let derinlik = 1;
  let tirnakIcinde = false;
  let mevcutSutun = "";
  const sutunlar: string[] = [];
  let kapanisSonrasi: string | null = null;

  for (let i = 0; i < govde.length; i++) {
    const karakter = govde[i];

    if (tirnakIcinde) {
      mevcutSutun += karakter;
      if (karakter === "'") tirnakIcinde = false;
      continue;
    }
    if (karakter === "'") {
      tirnakIcinde = true;
      mevcutSutun += karakter;
      continue;
    }
    if (karakter === "(") {
      derinlik++;
      mevcutSutun += karakter;
      continue;
    }
    if (karakter === ")") {
      derinlik--;
      if (derinlik === 0) {
        sutunlar.push(mevcutSutun.trim());
        kapanisSonrasi = govde.slice(i + 1);
        break;
      }
      mevcutSutun += karakter;
      continue;
    }
    if (karakter === "," && derinlik === 1) {
      sutunlar.push(mevcutSutun.trim());
      mevcutSutun = "";
      continue;
    }
    mevcutSutun += karakter;
  }

  if (kapanisSonrasi === null || sutunlar.length === 0) return tekSatir;

  const satirlar = [bas.trim(), ...sutunlar.map((s, i) => `  ${s}${i < sutunlar.length - 1 ? "," : ""}`)];
  satirlar.push(`)${kapanisSonrasi}`.trim());
  return satirlar.join("\n");
}

export function formatSql(sql: string): string {
  const tekSatir = sql.trim();
  if (tekSatir.length <= UZUN_SORGU_ESIGI || tekSatir.includes("\n")) {
    return sql;
  }

  if (/^CREATE TABLE\b/i.test(tekSatir)) {
    return createTableSutunlaraBol(tekSatir);
  }

  let sonuc = "";
  let tirnakIcinde = false;

  for (let i = 0; i < tekSatir.length; ) {
    const karakter = tekSatir[i];

    if (karakter === "'") {
      tirnakIcinde = !tirnakIcinde;
      sonuc += karakter;
      i++;
      continue;
    }

    if (!tirnakIcinde) {
      const oncekiKarakter = tekSatir[i - 1];
      const solSinirTemiz = oncekiKarakter === undefined || /\s/.test(oncekiKarakter);
      const eslesenKelime = solSinirTemiz
        ? KIRILMA_ANAHTAR_KELIMELERI.find((kelime) => {
            const parca = tekSatir.slice(i, i + kelime.length);
            if (parca.toUpperCase() !== kelime) return false;
            const sonrakiKarakter = tekSatir[i + kelime.length];
            return sonrakiKarakter === undefined || !/[a-zA-Z0-9_]/.test(sonrakiKarakter);
          })
        : undefined;

      if (eslesenKelime && sonuc.trim().length > 0) {
        sonuc = sonuc.replace(/[ \t]+$/, "") + "\n";
        sonuc += tekSatir.slice(i, i + eslesenKelime.length);
        i += eslesenKelime.length;
        continue;
      }
    }

    sonuc += karakter;
    i++;
  }

  return sonuc;
}
