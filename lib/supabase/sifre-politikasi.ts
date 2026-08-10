// Supabase Dashboard → Authentication → Providers → Email'de yapılandırılan
// şifre politikasıyla birebir eşleşir (min. 8 karakter + küçük/büyük harf,
// rakam, sembol — "Lowercase, uppercase letters, digits and symbols").
// Buradaki kontrol istemci tarafında anında geri bildirim vermek için;
// asıl doğrulama her zaman sunucuda (GoTrue) yapılır. Dashboard'daki
// politika değişirse bu dosya da güncellenmeli.
export const SIFRE_POLITIKASI_METNI =
  "En az 8 karakter; büyük harf, küçük harf, rakam ve sembol içermeli.";

export function sifrePolitikasinaUyuyorMu(sifre: string): boolean {
  return (
    sifre.length >= 8 &&
    /[a-z]/.test(sifre) &&
    /[A-Z]/.test(sifre) &&
    /[0-9]/.test(sifre) &&
    /[^A-Za-z0-9]/.test(sifre)
  );
}
