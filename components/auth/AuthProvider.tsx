"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  /** İlk oturum kontrolü tamamlanana kadar true — auth gate'li sayfaların erken "giriş yapmalısın" göstermesini önler. */
  yukleniyor: boolean;
  cikisYap: () => Promise<void>;
  /** profiles satırı store dışında (ör. avatar yükleme) değiştiğinde önbelleği tazeler. */
  profiliYenile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  yukleniyor: true,
  cikisYap: async () => {},
  profiliYenile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let iptalEdildi = false;

    async function profiliGetir(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      if (!iptalEdildi) setProfile(data);
    }

    // Oturum kasıtlı olarak SADECE tarayıcıda okunuyor. Sunucu tarafında
    // (ör. root layout'ta) cookies() okumak Next'i tüm siteyi dinamik
    // render'a zorlamaya iter — bu da build'de statik/SSG üretilen tüm
    // ders/pratik/sınav sayfalarını sunucu render'ına çevirir. Bunun
    // yerine ilk oturum burada, mount'ta okunuyor (kısa bir "misafir"
    // anı normal ve kabul edilebilir).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (iptalEdildi) return;
      setUser(session?.user ?? null);
      if (session?.user) profiliGetir(session.user.id);
      setYukleniyor(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        profiliGetir(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      iptalEdildi = true;
      subscription.unsubscribe();
    };
    // Sadece mount'ta kurulur; kullanıcı değişimini onAuthStateChange yönetir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cikisYap = useCallback(async () => {
    await createClient().auth.signOut();
  }, []);

  const profiliYenile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: guncelKullanici },
    } = await supabase.auth.getUser();
    if (!guncelKullanici) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", guncelKullanici.id)
      .maybeSingle();
    setProfile(data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, yukleniyor, cikisYap, profiliYenile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
