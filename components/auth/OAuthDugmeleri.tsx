"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GithubIkon, GoogleIkon } from "./SaglayiciIkonlari";

const SAGLAYICI_BUTON_SINIFI =
  "flex items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800";

export function OAuthDugmeleri({ onHata }: { onHata: (mesaj: string) => void }) {
  const [aktifSaglayici, setAktifSaglayici] = useState<"google" | "github" | null>(null);

  async function oauthIleDevamEt(saglayici: "google" | "github") {
    onHata("");
    setAktifSaglayici(saglayici);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: saglayici,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      onHata("Bağlantı kurulamadı, tekrar dene.");
      setAktifSaglayici(null);
    }
    // Başarılıysa tarayıcı sağlayıcının giriş sayfasına yönlendirilir.
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => oauthIleDevamEt("google")}
        disabled={aktifSaglayici !== null}
        className={SAGLAYICI_BUTON_SINIFI}
      >
        <GoogleIkon /> Google
      </button>
      <button
        type="button"
        onClick={() => oauthIleDevamEt("github")}
        disabled={aktifSaglayici !== null}
        className={SAGLAYICI_BUTON_SINIFI}
      >
        <GithubIkon /> GitHub
      </button>
    </div>
  );
}
