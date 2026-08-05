import { describe, expect, it } from "vitest";
import { degerlendir } from "@/lib/sql/grader";
import type { QueryExecResult } from "sql.js";
import type { TabloAnlikGorunum } from "@/lib/sql/schema";

const cozum: QueryExecResult = {
  columns: ["urun_adi", "fiyat"],
  values: [
    ["Kalem", 10],
    ["Defter", 25],
  ],
};

describe("degerlendir — mod: sonuc", () => {
  it("aynı sırada aynı değerler doğru kabul edilir", () => {
    const sonuc = degerlendir({ mod: "sonuc", kullanici: cozum, cozum });
    expect(sonuc.dogru).toBe(true);
  });

  it("siralamaOnemli false iken farklı sırada aynı içerik doğru kabul edilir", () => {
    const kullanici: QueryExecResult = {
      columns: ["urun_adi", "fiyat"],
      values: [
        ["Defter", 25],
        ["Kalem", 10],
      ],
    };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum, siralamaOnemli: false });
    expect(sonuc.dogru).toBe(true);
  });

  it("siralamaOnemli true iken farklı sırada aynı içerik yanlış kabul edilir ve özel mesaj döner", () => {
    const kullanici: QueryExecResult = {
      columns: ["urun_adi", "fiyat"],
      values: [
        ["Defter", 25],
        ["Kalem", 10],
      ],
    };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum, siralamaOnemli: true });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/satır sırası farklı/);
  });

  it("kullanıcı sonucu null ise (boş sorgu) yanlış kabul edilir", () => {
    const sonuc = degerlendir({ mod: "sonuc", kullanici: null, cozum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/herhangi bir sonuç döndürmedi/);
  });

  it("satır sayısı farklıysa yanlış kabul edilir", () => {
    const kullanici: QueryExecResult = { columns: ["urun_adi", "fiyat"], values: [["Kalem", 10]] };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/Satır sayısı farklı/);
  });

  it("sütun sayısı farklıysa yanlış kabul edilir", () => {
    const kullanici: QueryExecResult = {
      columns: ["urun_adi"],
      values: [["Kalem"], ["Defter"]],
    };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/Sütun sayısı farklı/);
  });

  it("aynı değer farklı yazılırsa (sayı vs metin, ondalık toleranslı) yine doğru kabul edilir", () => {
    const kullanici: QueryExecResult = {
      columns: ["urun_adi", "fiyat"],
      values: [
        ["Kalem", "10.0000000001"],
        ["Defter", 25],
      ],
    };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum });
    expect(sonuc.dogru).toBe(true);
  });

  it("kolonAdiOnemli true iken sütun adları eşleşmezse yanlış kabul edilir", () => {
    const kullanici: QueryExecResult = {
      columns: ["ad", "fiyat"],
      values: cozum.values,
    };
    const sonuc = degerlendir({ mod: "sonuc", kullanici, cozum, kolonAdiOnemli: true });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/Sütun adları/);
  });

  it("NULL değerler doğru karşılaştırılır", () => {
    const cozumNull: QueryExecResult = { columns: ["ad"], values: [[null]] };
    const kullaniciNull: QueryExecResult = { columns: ["ad"], values: [[null]] };
    const sonuc = degerlendir({ mod: "sonuc", kullanici: kullaniciNull, cozum: cozumNull });
    expect(sonuc.dogru).toBe(true);
  });
});

describe("degerlendir — mod: tabloDurumu", () => {
  const cozumDurum: TabloAnlikGorunum[] = [
    { ad: "urunler", kolonlar: ["id", "fiyat"], satirlar: [[1, 100], [2, 200]] },
  ];

  it("iki DB'nin durumu birebir aynıysa doğru kabul edilir", () => {
    const sonuc = degerlendir({ mod: "tabloDurumu", kullanici: cozumDurum, cozum: cozumDurum });
    expect(sonuc.dogru).toBe(true);
  });

  it("bir tablodaki satır sayısı farklıysa yanlış kabul edilir", () => {
    const kullanici: TabloAnlikGorunum[] = [
      { ad: "urunler", kolonlar: ["id", "fiyat"], satirlar: [[1, 100]] },
    ];
    const sonuc = degerlendir({ mod: "tabloDurumu", kullanici, cozum: cozumDurum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/satır sayısı farklı/);
  });

  it("tablo içeriği farklıysa yanlış kabul edilir", () => {
    const kullanici: TabloAnlikGorunum[] = [
      { ad: "urunler", kolonlar: ["id", "fiyat"], satirlar: [[1, 999], [2, 200]] },
    ];
    const sonuc = degerlendir({ mod: "tabloDurumu", kullanici, cozum: cozumDurum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/içeriği beklenenle eşleşmiyor/);
  });

  it("beklenen bir tablo eksikse yanlış kabul edilir", () => {
    const sonuc = degerlendir({ mod: "tabloDurumu", kullanici: [], cozum: cozumDurum });
    expect(sonuc.dogru).toBe(false);
    expect(sonuc.mesaj).toMatch(/tablo sayısı farklı/);
  });
});
