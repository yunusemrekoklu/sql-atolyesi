import type { Vaka, VakaSeviyesi } from "@/types/content";

/** Bir vakanın çözülüp çözülmediği — lib/progress/sertifika.ts'teki fonksiyonlarla aynı saf/istemci taraflı desen. */
export function vakaCozuldu(cozulenVakalar: string[], slug: string): boolean {
  return cozulenVakalar.includes(slug);
}

/**
 * Bir seviyenin açık olup olmadığı — Başlangıç her zaman açık, Orta/İleri
 * bir önceki seviyedeki TÜM vakalar çözülünce açılıyor (kullanıcı onaylı
 * kural). Kilit her zaman istemci tarafında hesaplanır (bkz. plan): misafir
 * kullanıcıların ilerlemesi sadece localStorage'da, sunucu tarafı bir
 * eşdeğeri yok.
 */
export function seviyeAcikMi(seviye: VakaSeviyesi, tumVakalar: Vaka[], cozulenVakalar: string[]): boolean {
  if (seviye === "Başlangıç") return true;
  const onceki: VakaSeviyesi = seviye === "Orta" ? "Başlangıç" : "Orta";
  const oncekiVakalar = tumVakalar.filter((v) => v.seviye === onceki);
  return oncekiVakalar.every((v) => cozulenVakalar.includes(v.slug));
}
