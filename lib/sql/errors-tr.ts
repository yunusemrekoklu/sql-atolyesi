interface HataKurali {
  desen: RegExp;
  mesaj: (eslesme: RegExpMatchArray) => string;
}

const kurallar: HataKurali[] = [
  {
    desen: /no such table:\s*(\S+)/i,
    mesaj: (m) => `"${m[1]}" adında bir tablo bulunamadı. Tablo adını ve yazımını kontrol et.`,
  },
  {
    desen: /no such column:\s*(\S+)/i,
    mesaj: (m) => `"${m[1]}" adında bir sütun bulunamadı. Sütun adını ve hangi tabloya ait olduğunu kontrol et.`,
  },
  {
    desen: /ambiguous column name:\s*(\S+)/i,
    mesaj: (m) =>
      `"${m[1]}" sütun adı birden fazla tabloda var. Hangi tabloya ait olduğunu belirtmen gerekiyor (ör. tablo.sutun).`,
  },
  {
    desen: /near "?([^":]+)"?:\s*syntax error/i,
    mesaj: (m) => `"${m[1]}" yakınında bir söz dizimi (syntax) hatası var. Yazımını kontrol et.`,
  },
  {
    desen: /NOT NULL constraint failed:\s*(\S+)/i,
    mesaj: (m) => `"${m[1]}" alanı boş bırakılamaz (NOT NULL kısıtı).`,
  },
  {
    desen: /UNIQUE constraint failed:\s*(\S+)/i,
    mesaj: (m) => `"${m[1]}" için bu değer zaten kullanılıyor (UNIQUE kısıtı ihlali).`,
  },
  {
    desen: /FOREIGN KEY constraint failed/i,
    mesaj: () => "Bu işlem bir yabancı anahtar (FOREIGN KEY) kısıtını ihlal ediyor.",
  },
  {
    desen: /\btable\s+(\S+)\s+already exists/i,
    mesaj: (m) => `"${m[1]}" adında bir tablo zaten var.`,
  },
];

const VARSAYILAN_MESAJ = "Sorgunda bir hata var. Sözdizimini ve tablo/sütun adlarını kontrol et.";

/**
 * sql.js'in İngilizce (SQLite) hata mesajını, öğrenciye yardımcı olacak
 * Türkçe bir açıklamaya çevirir. Eşleşme yoksa genel bir mesaj döner —
 * orijinal mesaj her durumda ayrıca gösterilir (bkz. QueryError).
 */
export function turkceHataMesaji(orijinalMesaj: string): string {
  for (const kural of kurallar) {
    const eslesme = orijinalMesaj.match(kural.desen);
    if (eslesme) return kural.mesaj(eslesme);
  }
  return VARSAYILAN_MESAJ;
}
