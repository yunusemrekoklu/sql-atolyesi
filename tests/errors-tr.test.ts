import { describe, expect, it } from "vitest";
import { turkceHataMesaji } from "@/lib/sql/errors-tr";

describe("turkceHataMesaji", () => {
  it("'no such table' hatasını Türkçeye çevirir", () => {
    expect(turkceHataMesaji("no such table: urunler2")).toMatch(/"urunler2" adında bir tablo bulunamadı/);
  });

  it("'no such column' hatasını Türkçeye çevirir", () => {
    expect(turkceHataMesaji("no such column: fiyatt")).toMatch(/"fiyatt" adında bir sütun bulunamadı/);
  });

  it("syntax error hatasını Türkçeye çevirir", () => {
    expect(turkceHataMesaji('near "SELCT": syntax error')).toMatch(/söz dizimi \(syntax\) hatası/);
  });

  it("NOT NULL kısıt hatasını Türkçeye çevirir", () => {
    expect(turkceHataMesaji("NOT NULL constraint failed: urunler.urun_adi")).toMatch(/boş bırakılamaz/);
  });

  it("tanınmayan bir hata için genel bir mesaj döner", () => {
    expect(turkceHataMesaji("some completely unknown sqlite error")).toMatch(/Sorgunda bir hata var/);
  });
});
