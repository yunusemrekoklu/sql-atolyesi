// Supabase Auth İngilizce hata mesajlarını kullanıcıya gösterilecek Türkçe
// karşılıklarına çevirir. Supabase-js hata mesajlarını sabit metin olarak
// döndürür (kod değil) — bu yüzden eşleşme metin üzerinden yapılıyor.
const BILINEN_HATALAR: Record<string, string> = {
  "Invalid login credentials": "E-posta veya şifre hatalı.",
  "Email not confirmed": "E-posta adresin henüz doğrulanmadı. Gelen kutunu kontrol et.",
  "User already registered": "Bu e-posta adresiyle zaten bir hesap var.",
  "Password should be at least 6 characters.": "Şifre en az 6 karakter olmalı.",
  "Unable to validate email address: invalid format": "Geçerli bir e-posta adresi gir.",
  "Signup requires a valid password": "Geçerli bir şifre gir.",
  "email rate limit exceeded": "Çok fazla deneme yapıldı, biraz sonra tekrar dene.",
};

export function supabaseHatasiniCevir(mesaj: string): string {
  return BILINEN_HATALAR[mesaj] ?? "Bir şeyler ters gitti, tekrar dene.";
}
