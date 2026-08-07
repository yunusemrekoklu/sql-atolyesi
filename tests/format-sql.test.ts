import { describe, expect, it } from "vitest";
import { formatSql } from "@/lib/editor/formatSql";

describe("formatSql", () => {
  it("kısa sorguları tek satırda bırakır", () => {
    const sql = "SELECT * FROM movies;";
    expect(formatSql(sql)).toBe(sql);
  });

  it("uzun sorgularda WHERE'den önce satır kırar, SELECT ... FROM'u bir arada tutar", () => {
    const sql =
      "SELECT title, release_year, genre FROM movies WHERE release_year >= 2000 AND genre = 'Dram';";
    expect(formatSql(sql)).toBe(
      "SELECT title, release_year, genre FROM movies\nWHERE release_year >= 2000 AND genre = 'Dram';",
    );
  });

  it("GROUP BY, HAVING ve ORDER BY için ayrı satırlar açar", () => {
    const sql =
      "SELECT category, COUNT(*) AS product_count FROM products GROUP BY category HAVING COUNT(*) >= 3 ORDER BY product_count DESC;";
    expect(formatSql(sql)).toBe(
      "SELECT category, COUNT(*) AS product_count FROM products\nGROUP BY category\nHAVING COUNT(*) >= 3\nORDER BY product_count DESC;",
    );
  });

  it("tırnak içindeki anahtar kelime benzeri metinleri kırmadan bırakır", () => {
    const sql =
      "SELECT full_name FROM customers WHERE notes = 'ORDER BY teslim tarihine göre değişir lütfen dikkat';";
    const sonuc = formatSql(sql);
    expect(sonuc).toContain("'ORDER BY teslim tarihine göre değişir lütfen dikkat'");
    expect(sonuc.split("\n")).toHaveLength(2);
  });

  it("CREATE TABLE gövdesini sütun sütun satırlara böler", () => {
    const sql =
      "CREATE TABLE reviews (review_id INTEGER PRIMARY KEY, shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id), comment TEXT);";
    expect(formatSql(sql)).toBe(
      [
        "CREATE TABLE reviews (",
        "  review_id INTEGER PRIMARY KEY,",
        "  shipment_id INTEGER NOT NULL REFERENCES shipments(shipment_id),",
        "  comment TEXT",
        ");",
      ].join("\n"),
    );
  });

  it("zaten çok satırlı sorgulara dokunmaz", () => {
    const sql = "SELECT *\nFROM movies\nWHERE genre = 'Dram';";
    expect(formatSql(sql)).toBe(sql);
  });
});
