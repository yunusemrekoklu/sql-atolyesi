import type { VakaSeviyesi } from "@/types/content";

/**
 * lib/ui/seviye.ts'in görsel dilini taşıyan ama AYRI bir Record — VakaSeviyesi,
 * Exercise/InterviewQuestion'ın Seviye tipiyle karışmasın diye kasıtlı olarak
 * kendi tipini kullanıyor (bkz. types/content.ts).
 */
export const VAKA_SEVIYE_ROZET: Record<VakaSeviyesi, string> = {
  "Başlangıç": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  Orta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "İleri": "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export const VAKA_SEVIYE_KENAR: Record<VakaSeviyesi, string> = {
  "Başlangıç": "border-l-green-500",
  Orta: "border-l-amber-500",
  "İleri": "border-l-red-500",
};

export const VAKA_XP: Record<VakaSeviyesi, number> = {
  "Başlangıç": 25,
  Orta: 40,
  "İleri": 60,
};

/** tier kodu, completed_cases.tier (Supabase) ve point_events tetikleyicisiyle eşleşir. */
export const VAKA_TIER_KODU: Record<VakaSeviyesi, "baslangic" | "orta" | "ileri"> = {
  "Başlangıç": "baslangic",
  Orta: "orta",
  "İleri": "ileri",
};
