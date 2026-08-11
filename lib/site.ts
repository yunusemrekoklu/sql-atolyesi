// Site genelinde mutlak URL üretiminin tek kaynağı — domain geçişi
// sadece NEXT_PUBLIC_SITE_URL env değişkenini değiştirmekle tamamlanır.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sqlatolyesi.vercel.app";
