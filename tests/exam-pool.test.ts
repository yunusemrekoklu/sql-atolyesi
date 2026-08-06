import { describe, expect, it } from "vitest";
import { sinaviDegerlendir, soruHavuzuOlustur, sorulariGetir } from "@/lib/exam/pool";
import type { ExamQuestion } from "@/types/content";

const sorular: ExamQuestion[] = [
  { id: "u1-1", uniteId: 1, konu: "SELECT", dersSlug: "veritabani-nedir", soru: "?", secenekler: ["a", "b"], dogruIndex: 0, aciklama: "" },
  { id: "u2-1", uniteId: 2, konu: "GROUP BY", dersSlug: "group-by", soru: "?", secenekler: ["a", "b"], dogruIndex: 1, aciklama: "" },
  { id: "u3-1", uniteId: 3, konu: "JOIN", dersSlug: "inner-join", soru: "?", secenekler: ["a", "b"], dogruIndex: 0, aciklama: "" },
  { id: "u4-1", uniteId: 4, konu: "Alt Sorgu", dersSlug: "alt-sorgu-temelleri", soru: "?", secenekler: ["a", "b"], dogruIndex: 1, aciklama: "" },
  { id: "u5-1", uniteId: 5, konu: "INSERT", dersSlug: "insert", soru: "?", secenekler: ["a", "b"], dogruIndex: 0, aciklama: "" },
];

describe("soruHavuzuOlustur", () => {
  it("vize modunda sadece Ünite 1-3 sorularını döndürür", () => {
    const havuz = soruHavuzuOlustur(sorular, { mod: "vize", soruSayisi: 20, dakika: 25 });
    expect(havuz.every((s) => s.uniteId <= 3)).toBe(true);
    expect(havuz.length).toBe(3);
  });

  it("final modunda tüm üniteleri döndürür", () => {
    const havuz = soruHavuzuOlustur(sorular, { mod: "final", soruSayisi: 20, dakika: 25 });
    expect(havuz.length).toBe(5);
  });

  it("ozel modunda sadece seçilen üniteleri döndürür", () => {
    const havuz = soruHavuzuOlustur(sorular, { mod: "ozel", soruSayisi: 20, dakika: 25, uniteIdleri: [2, 4] });
    expect(havuz.every((s) => s.uniteId === 2 || s.uniteId === 4)).toBe(true);
    expect(havuz.length).toBe(2);
  });

  it("soruSayisi havuzdan büyükse havuzun tamamını döndürür (fazla istenmez)", () => {
    const havuz = soruHavuzuOlustur(sorular, { mod: "final", soruSayisi: 100, dakika: 25 });
    expect(havuz.length).toBe(5);
  });

  it("soruSayisi havuzdan küçükse tam istenen sayıda döndürür", () => {
    const havuz = soruHavuzuOlustur(sorular, { mod: "final", soruSayisi: 2, dakika: 25 });
    expect(havuz.length).toBe(2);
  });
});

describe("sorulariGetir", () => {
  it("id listesine karşılık gelen soruları sırayla döndürür", () => {
    const bulunanlar = sorulariGetir(["u3-1", "u1-1"], sorular);
    expect(bulunanlar.map((s) => s.id)).toEqual(["u3-1", "u1-1"]);
  });

  it("bulunamayan id'leri sessizce atlar", () => {
    const bulunanlar = sorulariGetir(["u1-1", "olmayan-id"], sorular);
    expect(bulunanlar.map((s) => s.id)).toEqual(["u1-1"]);
  });
});

describe("sinaviDegerlendir", () => {
  it("doğru/yanlış sayısını ve konu kırılımını doğru hesaplar", () => {
    const cevaplar = { "u1-1": 0, "u2-1": 0, "u3-1": 0 };
    const sonuc = sinaviDegerlendir("vize", sorulariGetir(["u1-1", "u2-1", "u3-1"], sorular), cevaplar);

    expect(sonuc.dogruSayisi).toBe(2);
    expect(sonuc.toplamSoru).toBe(3);
    expect(sonuc.yanlisSoruIdleri).toEqual(["u2-1"]);
    expect(sonuc.konuKirilimi.SELECT).toEqual({ dogru: 1, toplam: 1 });
    expect(sonuc.konuKirilimi["GROUP BY"]).toEqual({ dogru: 0, toplam: 1 });
    expect(sonuc.konuKirilimi.JOIN).toEqual({ dogru: 1, toplam: 1 });
  });

  it("cevaplanmamış sorular yanlış sayılır", () => {
    const sonuc = sinaviDegerlendir("final", sorulariGetir(["u1-1"], sorular), {});
    expect(sonuc.dogruSayisi).toBe(0);
    expect(sonuc.yanlisSoruIdleri).toEqual(["u1-1"]);
  });
});
