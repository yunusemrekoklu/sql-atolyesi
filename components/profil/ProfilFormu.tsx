"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { createClient } from "@/lib/supabase/client";
import { INPUT_SINIFI } from "@/lib/ui/form";
import { KART_SINIFI } from "@/lib/ui/kart";

// avatars storage bucket'ının Faz 0'da tanımlanan limitleriyle birebir eşleşir.
const AVATAR_MAX_BOYUT = 2 * 1024 * 1024;
const AVATAR_IZINLI_TIPLER = ["image/png", "image/jpeg", "image/webp"];

export function ProfilFormu() {
  const { user, profile, yukleniyor, profiliYenile } = useAuth();
  const { ilerleme, kullaniciAdiniKaydet } = useProgress();

  const [adTaslak, setAdTaslak] = useState("");
  const [adKaydedildi, setAdKaydedildi] = useState(false);
  const [avatarYukleniyor, setAvatarYukleniyor] = useState(false);
  const [avatarHata, setAvatarHata] = useState("");
  const dosyaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAdTaslak(ilerleme.kullaniciAdi ?? "");
  }, [ilerleme.kullaniciAdi]);

  if (yukleniyor) {
    return <p className="text-sm text-stone-500 dark:text-stone-400">Yükleniyor…</p>;
  }

  if (!user) {
    return (
      <div className={KART_SINIFI}>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Profilini görüntülemek için giriş yapmalısın.
        </p>
        <Link
          href="/giris"
          className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
        >
          Giriş yap
        </Link>
      </div>
    );
  }

  function adiKaydet(e: FormEvent) {
    e.preventDefault();
    const temiz = adTaslak.trim();
    if (!temiz) return;
    kullaniciAdiniKaydet(temiz);
    setAdKaydedildi(true);
    setTimeout(() => setAdKaydedildi(false), 2000);
  }

  async function avatarSec(e: ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!dosya || !user) return;

    setAvatarHata("");

    if (!AVATAR_IZINLI_TIPLER.includes(dosya.type)) {
      setAvatarHata("Sadece PNG, JPEG ya da WEBP yükleyebilirsin.");
      return;
    }
    if (dosya.size > AVATAR_MAX_BOYUT) {
      setAvatarHata("Dosya en fazla 2MB olabilir.");
      return;
    }

    setAvatarYukleniyor(true);
    const supabase = createClient();
    const uzanti = dosya.name.split(".").pop() ?? "png";
    const yol = `${user.id}/avatar.${uzanti}`;

    const { error: yuklemeHatasi } = await supabase.storage
      .from("avatars")
      .upload(yol, dosya, { upsert: true, contentType: dosya.type });

    if (yuklemeHatasi) {
      setAvatarHata("Avatar yüklenemedi, tekrar dene.");
      setAvatarYukleniyor(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(yol);
    // Aynı dosya adına yeniden yükleme yapıldığında tarayıcı/CDN önbelleği eski
    // görseli göstermeye devam edebilir — sürüm damgası bunu kırar.
    const onbellekKirici = `${publicUrl}?v=${Date.now()}`;

    const { error: profilHatasi } = await supabase
      .from("profiles")
      .update({ avatar_url: onbellekKirici })
      .eq("id", user.id);

    setAvatarYukleniyor(false);

    if (profilHatasi) {
      setAvatarHata("Avatar kaydedilemedi, tekrar dene.");
      return;
    }

    await profiliYenile();
  }

  const baslangicHarfi = (ilerleme.kullaniciAdi?.trim() || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div className={KART_SINIFI}>
        <h2 className="text-lg font-semibold">Avatar</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-200 text-xl font-semibold text-stone-700 ring-1 ring-stone-900/10 dark:bg-stone-800 dark:text-stone-200">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              baslangicHarfi
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => dosyaInputRef.current?.click()}
              disabled={avatarYukleniyor}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              {avatarYukleniyor ? "Yükleniyor…" : "Avatar yükle"}
            </button>
            <input
              ref={dosyaInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={avatarSec}
              className="hidden"
            />
            <p className="mt-1 text-xs text-stone-400">PNG, JPEG ya da WEBP · en fazla 2MB.</p>
          </div>
        </div>
        {avatarHata && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{avatarHata}</p>}
      </div>

      <div className={KART_SINIFI}>
        <h2 className="text-lg font-semibold">Ad Soyad</h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Sertifikalarında görünecek isim.</p>
        <form onSubmit={adiKaydet} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={adTaslak}
            onChange={(e) => setAdTaslak(e.target.value)}
            placeholder="Ad Soyad"
            className={INPUT_SINIFI}
            aria-label="Ad Soyad"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:text-stone-950 dark:hover:bg-blue-400"
          >
            Kaydet
          </button>
        </form>
        {adKaydedildi && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Kaydedildi ✓</p>}
      </div>

      <div className={KART_SINIFI}>
        <h2 className="text-lg font-semibold">Hesap</h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{user.email}</p>
      </div>
    </div>
  );
}
