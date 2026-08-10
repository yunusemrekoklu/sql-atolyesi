import { SIFRE_POLITIKASI_METNI } from "./sifre-politikasi";

// Supabase Auth İngilizce hata mesajlarını kullanıcıya gösterilecek Türkçe
// karşılıklarına çevirir. Supabase-js hata mesajlarını sabit metin olarak
// döndürür (kod değil) — bu yüzden eşleşme metin üzerinden yapılıyor.
const BILINEN_HATALAR: Record<string, string> = {
  "Invalid login credentials": "E-posta veya şifre hatalı.",
  "Email not confirmed": "E-posta adresin henüz doğrulanmadı. Gelen kutunu kontrol et.",
  "User already registered": "Bu e-posta adresiyle zaten bir hesap var.",
  "Unable to validate email address: invalid format": "Geçerli bir e-posta adresi gir.",
  "Signup requires a valid password": "Geçerli bir şifre gir.",
  "email rate limit exceeded": "Çok fazla deneme yapıldı, biraz sonra tekrar dene.",
};

export function supabaseHatasiniCevir(mesaj: string): string {
  if (BILINEN_HATALAR[mesaj]) return BILINEN_HATALAR[mesaj];
  // KayitFormu.tsx zaten Dashboard'daki politikayla eşleşen bir istemci
  // kontrolü yapıyor; sunucudan yine de bir şifre reddi gelirse (ör.
  // politika Dashboard'da değişip buradaki kopya güncellenmemişse) genel
  // ama doğru bir mesaj göster — Supabase'in tam ifadesini birebir
  // eşleştirmeye çalışmak kırılgan olurdu.
  if (/password/i.test(mesaj)) {
    return `Şifre gereksinimleri karşılanmıyor: ${SIFRE_POLITIKASI_METNI}`;
  }
  return "Bir şeyler ters gitti, tekrar dene.";
}
