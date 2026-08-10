"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseHatasiniCevir } from "@/lib/supabase/hata-mesajlari";
import { SIFRE_POLITIKASI_METNI, sifrePolitikasinaUyuyorMu } from "@/lib/supabase/sifre-politikasi";
import { INPUT_SINIFI } from "@/lib/ui/form";
import { OAuthDugmeleri } from "./OAuthDugmeleri";

export function KayitFormu() {
  const router = useRouter();
  const [ad, setAd] = useState("");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [kayitTamamlandi, setKayitTamamlandi] = useState(false);

  async function kayitOl(e: FormEvent) {
    e.preventDefault();
    setHata("");

    if (!sifrePolitikasinaUyuyorMu(sifre)) {
      setHata(`Şifre gereksinimleri karşılanmıyor: ${SIFRE_POLITIKASI_METNI}`);
      return;
    }

    setGonderiliyor(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: eposta,
      password: sifre,
      options: {
        data: ad.trim() ? { full_name: ad.trim() } : undefined,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setGonderiliyor(false);

    if (error) {
      setHata(supabaseHatasiniCevir(error.message));
      return;
    }

    if (data.session) {
      // E-posta doğrulama kapalıysa oturum hemen açılır.
      router.push("/");
      router.refresh();
      return;
    }

    setKayitTamamlandi(true);
  }

  if (kayitTamamlandi) {
    return (
      <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        <strong className="font-semibold">{eposta}</strong> adresine bir doğrulama bağlantısı
        gönderdik. Hesabını aktifleştirmek için gelen kutunu kontrol et.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <OAuthDugmeleri onHata={setHata} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
        <span className="text-xs text-stone-400">veya</span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      </div>

      <form onSubmit={kayitOl} className="space-y-3">
        <div>
          <label htmlFor="ad" className="mb-1 block text-sm font-medium">
            Ad Soyad
          </label>
          <input
            id="ad"
            type="text"
            autoComplete="name"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            className={INPUT_SINIFI}
          />
        </div>
        <div>
          <label htmlFor="eposta" className="mb-1 block text-sm font-medium">
            E-posta
          </label>
          <input
            id="eposta"
            type="email"
            required
            autoComplete="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            className={INPUT_SINIFI}
          />
        </div>
        <div>
          <label htmlFor="sifre" className="mb-1 block text-sm font-medium">
            Şifre
          </label>
          <input
            id="sifre"
            type="password"
            required
            autoComplete="new-password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className={INPUT_SINIFI}
          />
          <p className="mt-1 text-xs text-stone-400">{SIFRE_POLITIKASI_METNI}</p>
        </div>

        {hata && <p className="text-sm text-red-600 dark:text-red-400">{hata}</p>}

        <button
          type="submit"
          disabled={gonderiliyor}
          className="w-full rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
        >
          {gonderiliyor ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
        </button>
      </form>
    </div>
  );
}
