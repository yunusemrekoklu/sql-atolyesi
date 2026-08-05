import type { SampleDatabase } from "@/types/content";

export const filmlerDb: SampleDatabase = {
  id: "filmler",
  ad: "Filmler",
  aciklama: "Yeşilçam klasiklerinden güncel yapımlara, Türk sinemasından 20 film.",
  ddl: `
CREATE TABLE filmler (
  film_id INTEGER PRIMARY KEY,
  ad TEXT NOT NULL,
  yonetmen TEXT NOT NULL,
  yil INTEGER NOT NULL,
  sure_dk INTEGER NOT NULL,
  tur TEXT NOT NULL,
  puan REAL NOT NULL
);

INSERT INTO filmler (film_id, ad, yonetmen, yil, sure_dk, tur, puan) VALUES
  (1, 'Susuz Yaz', 'Metin Erksan', 1963, 90, 'Dram', 7.8),
  (2, 'Vesikalı Yarim', 'Ömer Lütfi Akad', 1968, 100, 'Dram', 7.5),
  (3, 'Selvi Boylum Al Yazmalım', 'Atıf Yılmaz', 1977, 105, 'Dram', 7.6),
  (4, 'Hababam Sınıfı', 'Ertem Eğilmez', 1975, 87, 'Komedi', 8.4),
  (5, 'Tosun Paşa', 'Kartal Tibet', 1976, 90, 'Komedi', 8.0),
  (6, 'Neşeli Günler', 'Ertem Eğilmez', 1978, 91, 'Komedi', 7.9),
  (7, 'Süt Kardeşler', 'Ertem Eğilmez', 1976, 89, 'Komedi', 7.8),
  (8, 'Eşkıya', 'Yavuz Turgul', 1996, 122, 'Dram', 8.6),
  (9, 'Vizontele', 'Yılmaz Erdoğan', 2001, 110, 'Komedi', 7.9),
  (10, 'Uzak', 'Nuri Bilge Ceylan', 2002, 110, 'Dram', 7.8),
  (11, 'Gora', 'Ömer Faruk Sorak', 2004, 122, 'Bilim Kurgu', 7.8),
  (12, 'Babam ve Oğlum', 'Çağan Irmak', 2005, 112, 'Dram', 8.3),
  (13, 'Organize İşler', 'Yılmaz Erdoğan', 2005, 110, 'Komedi', 7.6),
  (14, 'Kurtlar Vadisi Irak', 'Serdar Akar', 2006, 128, 'Aksiyon', 6.4),
  (15, 'Recep İvedik', 'Togan Gökbakar', 2008, 105, 'Komedi', 5.6),
  (16, 'Nefes: Vatan Sağolsun', 'Levent Semerci', 2009, 128, 'Savaş', 7.2),
  (17, 'Anadolu Kartalları', 'Ömer Faruk Sorak', 2011, 105, 'Aksiyon', 6.0),
  (18, 'Kelebeğin Rüyası', 'Yılmaz Erdoğan', 2013, 120, 'Dram', 7.9),
  (19, 'Kış Uykusu', 'Nuri Bilge Ceylan', 2014, 196, 'Dram', 8.0),
  (20, 'İtirazım Var', 'Onur Ünlü', 2014, 110, 'Dram', 7.0);
`.trim(),
};
