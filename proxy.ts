// Supabase oturum yenileme — Next 16'da "middleware.ts" yerine "proxy.ts"
// konvansiyonu kullanılıyor (bkz. nextjs.org/docs/messages/middleware-to-proxy).
// Süresi dolmak üzere olan auth token'ları burada tazelenir; Server
// Component'ler cookie yazamadığı için bu adım olmadan oturumlar sessizce
// düşer.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Supabase yapılandırılmamışsa (ör. env dosyasız yerel klon) site
  // misafir modunda çalışmaya devam etsin.
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // ÖNEMLİ: Bu çağrı token'ı gerektiğinde tazeler; kaldırılırsa oturumlar
  // süresi dolunca kopar. createServerClient ile bu çağrı arasına başka
  // kod koyma (bkz. @supabase/ssr dokümantasyonu).
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Statik varlıklar dışında her şey: _next içleri, sql.js vendor
    // dosyaları ve yaygın görsel/font uzantıları hariç.
    "/((?!_next/static|_next/image|vendor/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|wasm|woff2?)$).*)",
  ],
};
