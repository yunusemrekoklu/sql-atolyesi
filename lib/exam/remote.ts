// lib/progress/remote.ts ile aynı stil — sınav simülasyonu kasıtlı olarak
// lib/progress'ten bağımsız bir concern olduğu için (bkz. lib/exam/store.ts)
// kendi ince Supabase katmanını burada tutuyor.
import { createClient } from "@/lib/supabase/client";
import type { SinavModu } from "./types";

/** Sadece giriş yapmış kullanıcılar için çağrılır — misafir denemeleri bugünkü gibi tamamen local kalır. */
export async function uzakSinavDenemesiKaydet(
  userId: string,
  mod: SinavModu,
  skor: number,
  toplam: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("exam_attempts")
    .insert({ user_id: userId, mode: mod, score: skor, total: toplam });
  if (error) throw error;
}
