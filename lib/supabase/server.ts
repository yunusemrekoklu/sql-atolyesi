// Sunucu tarafı Supabase istemcisi — Server Component, Route Handler ve
// Server Action'larda kullanılır. Her istekte yeni istemci oluşturulmalı.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component'ten çağrıldığında cookie yazılamaz — oturum
            // tazeleme proxy.ts'te yapıldığı için güvenle yok sayılabilir.
          }
        },
      },
    },
  );
}
