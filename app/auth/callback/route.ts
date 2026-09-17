// OAuth (Google/GitHub) ve e-posta doğrulama bağlantılarının döndüğü yer.
// @supabase/ssr tarayıcı istemcisi PKCE akışı kullanır — bu yüzden burada
// "code" parametresini oturuma çevirmemiz gerekiyor.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data.user) {
        await girisIpsiniKaydet(supabase, request, data.user.id);
      }
      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.redirect(`${origin}/giris?hata=dogrulama`);
}

// Bu satırda IP hâlâ Vercel'in kendisinden geliyor (henüz Supabase'e
// gitmedi), o yüzden gerçek ziyaretçi IP'si burada yakalanıyor. Kayıt
// başarısız olsa bile girişi engellememesi için hata sessizce yutuluyor —
// bu tablo sadece Supabase Studio'dan bakılan bir log, kritik bir yol değil.
async function girisIpsiniKaydet(
  supabase: Awaited<ReturnType<typeof createClient>>,
  request: Request,
  userId: string
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent");

  await supabase.from("login_ip_log").insert({
    user_id: userId,
    ip_address: ip,
    user_agent: userAgent,
  });
}
