/**
 * JS'in varsayılan (locale-siz) toLowerCase()'i Türkçe için yanlış çalışır:
 * 'İ'.toLowerCase() === 'i̇' (noktalı, iki karakter) ve 'I'.toLowerCase() === 'i'
 * olur — oysa Türkçe kurallarında 'İ' → 'i' ve 'I' → 'ı' olmalıdır.
 * toLocaleLowerCase('tr-TR') bu kuralları doğru uygular; arama/karşılaştırma
 * öncesi tüm metinler bu fonksiyondan geçirilmelidir.
 */
export function turkceNormallestir(metin: string): string {
  return metin.toLocaleLowerCase("tr-TR").trim();
}

export function turkceIcerir(hedefMetin: string, aranan: string): boolean {
  const normalAranan = turkceNormallestir(aranan);
  if (normalAranan === "") return true;
  return turkceNormallestir(hedefMetin).includes(normalAranan);
}
