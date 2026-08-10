// Site genelinde mutlak URL üretiminin tek kaynağı — domain geçişi
// (ör. sqlcodex.com.tr) sadece NEXT_PUBLIC_SITE_URL env değişkenini
// değiştirmekle tamamlanır.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sqlatolyesi.vercel.app";
