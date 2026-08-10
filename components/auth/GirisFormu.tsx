"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseHatasiniCevir } from "@/lib/supabase/hata-mesajlari";
import { INPUT_SINIFI } from "@/lib/ui/form";
import { OAuthDugmeleri } from "./OAuthDugmeleri";

export function GirisFormu() {
  const router = useRouter();
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function girisYap(e: FormEvent) {
    e.preventDefault();
    setHata("");
    setGonderiliyor(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: eposta,
      password: sifre,
    });
    setGonderiliyor(false);
    if (error) {
      setHata(supabaseHatasiniCevir(error.message));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-4">
      <OAuthDugmeleri onHata={setHata} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
        <span className="text-xs text-stone-400">veya</span>
        <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      </div>

      <form onSubmit={girisYap} className="space-y-3">
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
            autoComplete="current-password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className={INPUT_SINIFI}
          />
        </div>

        {hata && <p className="text-sm text-red-600 dark:text-red-400">{hata}</p>}

        <button
          type="submit"
          disabled={gonderiliyor}
          className="w-full rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
        >
          {gonderiliyor ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
