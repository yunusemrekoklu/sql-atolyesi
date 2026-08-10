import { describe, expect, it } from "vitest";
import { mulakatTamamlandiMi, pratikTamamlandiMi, uniteTamamlandiMi } from "@/lib/progress/sertifika";
import type { Exercise, InterviewQuestion, Lesson, PracticeSet } from "@/types/content";

function dersOlustur(slug: string, uniteId: number): Lesson {
  return {
    slug,
    uniteId,
    dersNo: "1.1",
    baslik: slug,
    veritabaniId: "filmler",
    anlatim: "",
    ornekler: [],
    alistirmalar: [],
    miniQuiz: [],
  };
}

function alistirmaOlustur(id: string): Exercise {
  return { id, seviye: "Kolay", baslik: id, soru: "?", ipucu: "", cozumSql: "", mod: "sonuc" };
}

function mulakatSorusuOlustur(slug: string): InterviewQuestion {
  return {
    slug,
    seviye: "Kolay",
    sirket: "",
    baslik: slug,
    senaryo: "",
    ddl: "",
    ipuclari: [],
    cozumSql: "",
    aciklama: "",
    mod: "sonuc",
    takipSorusu: "",
    takipCevabi: "",
  };
}

describe("uniteTamamlandiMi", () => {
  const dersler = [dersOlustur("d1", 1), dersOlustur("d2", 1), dersOlustur("d3", 2)];

  it("ünitedeki hiçbir ders tamamlanmamışsa false döner", () => {
    expect(uniteTamamlandiMi(1, dersler, [])).toBe(false);
  });

  it("ünitedeki bazı dersler tamamlanmışsa false döner", () => {
    expect(uniteTamamlandiMi(1, dersler, ["d1"])).toBe(false);
  });

  it("ünitedeki tüm dersler tamamlanmışsa true döner", () => {
    expect(uniteTamamlandiMi(1, dersler, ["d1", "d2"])).toBe(true);
  });

  it("başka ünitedeki tamamlanma bu üniteyi etkilemez", () => {
    expect(uniteTamamlandiMi(2, dersler, ["d1", "d2"])).toBe(false);
    expect(uniteTamamlandiMi(2, dersler, ["d3"])).toBe(true);
  });
});

describe("pratikTamamlandiMi", () => {
  const setler: PracticeSet[] = [
    { slug: "s1", baslik: "S1", aciklama: "", veritabaniId: "filmler", sorular: [alistirmaOlustur("a1"), alistirmaOlustur("a2")] },
    { slug: "s2", baslik: "S2", aciklama: "", veritabaniId: "filmler", sorular: [alistirmaOlustur("a3")] },
  ];

  it("hiçbir soru denenmemişse false döner", () => {
    expect(pratikTamamlandiMi(setler, {})).toBe(false);
  });

  it("bazı sorular denenmişse false döner", () => {
    expect(pratikTamamlandiMi(setler, { a1: "cozuldu" })).toBe(false);
  });

  it("tüm sorular en az denenmişse (çözüldü ya da çözüm görüldü) true döner", () => {
    expect(pratikTamamlandiMi(setler, { a1: "cozuldu", a2: "cozumGoruldu", a3: "cozuldu" })).toBe(true);
  });
});

describe("mulakatTamamlandiMi", () => {
  const sorular = [mulakatSorusuOlustur("m1"), mulakatSorusuOlustur("m2")];

  it("hiçbir soru çözülmemişse false döner", () => {
    expect(mulakatTamamlandiMi(sorular, [])).toBe(false);
  });

  it("bazı sorular çözülmüşse false döner", () => {
    expect(mulakatTamamlandiMi(sorular, ["m1"])).toBe(false);
  });

  it("tüm sorular çözülmüşse true döner", () => {
    expect(mulakatTamamlandiMi(sorular, ["m1", "m2"])).toBe(true);
  });
});
