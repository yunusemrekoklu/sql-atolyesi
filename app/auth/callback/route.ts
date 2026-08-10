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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.redirect(`${origin}/giris?hata=dogrulama`);
}
