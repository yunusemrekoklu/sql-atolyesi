import { describe, expect, it } from "vitest";
import { turkceIcerir, turkceNormallestir } from "@/lib/search/turkce";

describe("turkceNormallestir", () => {
  it("noktalı büyük İ'yi noktalı küçük i'ye çevirir", () => {
    expect(turkceNormallestir("İstanbul")).toBe("istanbul");
  });

  it("noktasız büyük I'yı noktasız küçük ı'ya çevirir", () => {
    expect(turkceNormallestir("IŞIK")).toBe("ışık");
  });

  it("baştaki ve sondaki boşlukları temizler", () => {
    expect(turkceNormallestir("  Tarih  ")).toBe("tarih");
  });
});

describe("turkceIcerir", () => {
  it("İ/i ve I/ı farkını gözetmeden eşleştirir", () => {
    expect(turkceIcerir("İstanbul", "istanbul")).toBe(true);
    expect(turkceIcerir("IŞIK", "ışık")).toBe(true);
  });

  it("varsayılan (locale-siz) toLowerCase ile kaçırılacak bir eşleşmeyi bulur", () => {
    // 'I'.toLowerCase() (locale-siz) 'i' verir, oysa Türkçe kuralına göre
    // noktasız 'ı' vermesi gerekir — bu test tr-TR normalizasyonunun bu
    // farkı düzelttiğini doğrular ('IRMAK' aranırken 'ırmak' eşleşmeli).
    expect(turkceIcerir("IRMAK", "ırmak")).toBe(true);
  });

  it("boş arama metni her şeyi eşleştirir", () => {
    expect(turkceIcerir("Herhangi bir metin", "")).toBe(true);
  });

  it("eşleşmeyen metni false döndürür", () => {
    expect(turkceIcerir("Tarih Fonksiyonları", "toplulaştırma")).toBe(false);
  });
});
