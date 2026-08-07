export type Seviye = "Kolay" | "Orta" | "Zor";

/** Kolay/Orta/Zor için metin + hafif arka plan içeren rozet sınıfı. */
export const SEVIYE_ROZET: Record<Seviye, string> = {
  Kolay: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  Orta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Zor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

/** Kolay/Orta/Zor için sol-kenarlık rengi (kart vurgusu). */
export const SEVIYE_KENAR: Record<Seviye, string> = {
  Kolay: "border-l-green-500",
  Orta: "border-l-amber-500",
  Zor: "border-l-red-500",
};
