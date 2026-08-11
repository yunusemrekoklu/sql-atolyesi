// Supabase sorgularıyla dolan/yazan saf fonksiyonlar — lib/progress/store.ts
// tarafından "uzak" modda çağrılır. Hiçbiri store'un iç durumuna bağımlı
// değil; her çağrı kendi Supabase istemcisini oluşturur.
import { createClient } from "@/lib/supabase/client";
import { BOS_ILERLEME, type AlistirmaDurumu, type IlerlemeVerisi, type KazanilanSertifika } from "./types";

export async function uzakIlerlemeyiGetir(userId: string): Promise<IlerlemeVerisi> {
  const supabase = createClient();

  const [profil, dersler, alistirmalar, mulakatSorulari, miniQuizler, sertifikalar, uniteSinavlari, puanSonucu] =
    await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
      supabase.from("completed_lessons").select("lesson_slug").eq("user_id", userId),
      supabase.from("exercise_progress").select("exercise_id, status").eq("user_id", userId),
      supabase.from("completed_interview_questions").select("question_slug").eq("user_id", userId),
      supabase.from("mini_quiz_results").select("lesson_slug, correct_count, total_count").eq("user_id", userId),
      supabase.from("certificates").select("id, cert_type, display_code, issued_at").eq("user_id", userId),
      supabase.from("unit_test_results").select("unit_id, correct_count, total_count").eq("user_id", userId),
      supabase.rpc("get_my_points"),
    ]);

  const alistirmaKaydi: Record<string, AlistirmaDurumu> = {};
  for (const satir of alistirmalar.data ?? []) {
    alistirmaKaydi[satir.exercise_id] = satir.status as AlistirmaDurumu;
  }

  const miniQuizKaydi: IlerlemeVerisi["miniQuizSonuclari"] = {};
  for (const satir of miniQuizler.data ?? []) {
    miniQuizKaydi[satir.lesson_slug] = { dogruSayisi: satir.correct_count, toplamSoru: satir.total_count };
  }

  const sertifikaKaydi: Record<string, KazanilanSertifika> = {};
  for (const satir of sertifikalar.data ?? []) {
    sertifikaKaydi[satir.cert_type] = {
      id: satir.id,
      displayCode: satir.display_code,
      tarih: satir.issued_at.slice(0, 10),
    };
  }

  const uniteSinavKaydi: IlerlemeVerisi["uniteSinavSonuclari"] = {};
  for (const satir of uniteSinavlari.data ?? []) {
    uniteSinavKaydi[satir.unit_id] = { dogruSayisi: satir.correct_count, toplamSoru: satir.total_count };
  }

  return {
    ...BOS_ILERLEME,
    alistirmalar: alistirmaKaydi,
    tamamlananDersler: (dersler.data ?? []).map((s) => s.lesson_slug),
    miniQuizSonuclari: miniQuizKaydi,
    cozulenMulakatSorulari: (mulakatSorulari.data ?? []).map((s) => s.question_slug),
    kullaniciAdi: profil.data?.display_name ?? null,
    kazanilanSertifikalar: sertifikaKaydi,
    uniteSinavSonuclari: uniteSinavKaydi,
    puan: puanSonucu.data ?? 0,
  };
}

export async function uzakUniteSinaviSonucunuKaydet(
  userId: string,
  uniteId: number,
  dogruSayisi: number,
  toplamSoru: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("unit_test_results")
    .upsert(
      { user_id: userId, unit_id: uniteId, correct_count: dogruSayisi, total_count: toplamSoru },
      { onConflict: "user_id,unit_id" },
    );
  if (error) throw error;
}

/** Kullanıcının toplam puanı — point_events'ten sunucuda hesaplanır (bkz. get_my_points RPC). */
export async function uzakPuanGetir(): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_points");
  if (error) throw error;
  return data ?? 0;
}

export async function uzakDersiTamamlaniIsaretle(userId: string, dersSlug: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("completed_lessons")
    .upsert({ user_id: userId, lesson_slug: dersSlug }, { onConflict: "user_id,lesson_slug", ignoreDuplicates: true });
  if (error) throw error;
}

export async function uzakMulakatSorusunuIsaretle(userId: string, slug: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("completed_interview_questions")
    .upsert(
      { user_id: userId, question_slug: slug },
      { onConflict: "user_id,question_slug", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export async function uzakAlistirmaDurumunuAyarla(exerciseId: string, durum: AlistirmaDurumu): Promise<void> {
  const supabase = createClient();
  // set_exercise_progress "çözüme bakan çözdü sayılmaz" birleştirmesini
  // sunucuda, tek statement'ta yapar (bkz. Faz 0 SQL script'i).
  const { error } = await supabase.rpc("set_exercise_progress", { p_exercise_id: exerciseId, p_status: durum });
  if (error) throw error;
}

export async function uzakMiniQuizSonucunuKaydet(
  userId: string,
  dersSlug: string,
  dogruSayisi: number,
  toplamSoru: number,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("mini_quiz_results")
    .upsert(
      { user_id: userId, lesson_slug: dersSlug, correct_count: dogruSayisi, total_count: toplamSoru },
      { onConflict: "user_id,lesson_slug" },
    );
  if (error) throw error;
}

export async function uzakKullaniciAdiniKaydet(userId: string, ad: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ display_name: ad }).eq("id", userId);
  if (error) throw error;
}

export async function uzakSertifikaGetirYaDaOlustur(certType: string): Promise<KazanilanSertifika> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("issue_certificate", { p_cert_type: certType });
  if (error || !data) throw error ?? new Error("Sertifika oluşturulamadı.");
  return { id: data.id, displayCode: data.display_code, tarih: data.issued_at.slice(0, 10) };
}

/**
 * Kayıt/giriş anında, tarayıcıdaki misafir ilerlemesini Supabase'e taşır.
 * Tüm yazımlar idempotent/yıkıcı-olmayan: tamamlanan dersler ve mülakat
 * soruları upsert-union, alıştırma durumu sunucudaki "çözüme bakan çözdü
 * sayılmaz" RPC'si üzerinden, isim sadece profilde NULL ise doldurulur,
 * mini quiz sonuçları on-conflict-do-nothing (mevcut uzak sonucu ezmesin).
 * Tek bir başarısız yazım diğerlerini engellemesin diye Promise.allSettled
 * kullanılıyor — çağıran taraf (store.ts) bu yüzden hata fırlatmaz.
 */
export async function uzakYereliIceAktar(userId: string, yerel: IlerlemeVerisi): Promise<void> {
  const supabase = createClient();
  // Supabase sorgu builder'ları PromiseLike (thenable) ama nominal Promise
  // değil — Promise.allSettled bunu kabul eder, tipi buna göre gevşetiyoruz.
  const gorevler: PromiseLike<unknown>[] = [];

  if (yerel.tamamlananDersler.length > 0) {
    gorevler.push(
      supabase
        .from("completed_lessons")
        .upsert(
          yerel.tamamlananDersler.map((slug) => ({ user_id: userId, lesson_slug: slug })),
          { onConflict: "user_id,lesson_slug", ignoreDuplicates: true },
        ),
    );
  }

  if (yerel.cozulenMulakatSorulari.length > 0) {
    gorevler.push(
      supabase
        .from("completed_interview_questions")
        .upsert(
          yerel.cozulenMulakatSorulari.map((slug) => ({ user_id: userId, question_slug: slug })),
          { onConflict: "user_id,question_slug", ignoreDuplicates: true },
        ),
    );
  }

  for (const [exerciseId, durum] of Object.entries(yerel.alistirmalar)) {
    gorevler.push(supabase.rpc("set_exercise_progress", { p_exercise_id: exerciseId, p_status: durum }));
  }

  const miniQuizGirdileri = Object.entries(yerel.miniQuizSonuclari);
  if (miniQuizGirdileri.length > 0) {
    gorevler.push(
      supabase
        .from("mini_quiz_results")
        .upsert(
          miniQuizGirdileri.map(([dersSlug, sonuc]) => ({
            user_id: userId,
            lesson_slug: dersSlug,
            correct_count: sonuc.dogruSayisi,
            total_count: sonuc.toplamSoru,
          })),
          { onConflict: "user_id,lesson_slug", ignoreDuplicates: true },
        ),
    );
  }

  const uniteSinaviGirdileri = Object.entries(yerel.uniteSinavSonuclari);
  if (uniteSinaviGirdileri.length > 0) {
    gorevler.push(
      supabase
        .from("unit_test_results")
        .upsert(
          uniteSinaviGirdileri.map(([uniteId, sonuc]) => ({
            user_id: userId,
            unit_id: Number(uniteId),
            correct_count: sonuc.dogruSayisi,
            total_count: sonuc.toplamSoru,
          })),
          { onConflict: "user_id,unit_id", ignoreDuplicates: true },
        ),
    );
  }

  if (yerel.kullaniciAdi) {
    const { data: profil } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle();
    if (!profil?.display_name) {
      gorevler.push(supabase.from("profiles").update({ display_name: yerel.kullaniciAdi }).eq("id", userId));
    }
  }

  await Promise.allSettled(gorevler);
}
