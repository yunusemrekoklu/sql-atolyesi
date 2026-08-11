"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";

function baslangicHarfi(eposta: string | null | undefined, ad: string | null): string {
  const kaynak = ad?.trim() || eposta || "?";
  return kaynak.charAt(0).toUpperCase();
}

export function HesapMenusu() {
  const { user, profile, cikisYap } = useAuth();
  const { ilerleme } = useProgress();
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const kapsayiciRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) return;
    function disariTiklama(e: MouseEvent) {
      if (kapsayiciRef.current && !kapsayiciRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    }
    document.addEventListener("mousedown", disariTiklama);
    return () => document.removeEventListener("mousedown", disariTiklama);
  }, [acik]);

  if (!user) {
    return (
      <Link
        href="/giris"
        className="shrink-0 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-hover dark:text-stone-950"
      >
        Giriş Yap
      </Link>
    );
  }

  const gorunenAd = ilerleme.kullaniciAdi?.trim() || user.email || "Hesabım";
  const avatarUrl = profile?.avatar_url;

  async function cikisYapVeKapat() {
    setAcik(false);
    await cikisYap();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative shrink-0" ref={kapsayiciRef}>
      <button
        type="button"
        onClick={() => setAcik((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-stone-200 text-sm font-semibold text-stone-700 ring-1 ring-stone-900/10 transition-colors hover:ring-stone-900/20 dark:bg-stone-800 dark:text-stone-200"
        aria-haspopup="menu"
        aria-expanded={acik}
        aria-label="Hesap menüsü"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          baslangicHarfi(user.email, ilerleme.kullaniciAdi)
        )}
      </button>

      {acik && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-stone-500 dark:text-stone-400">{gorunenAd}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">Puan: {ilerleme.puan}</p>
          </div>
          <Link
            href="/sertifikalarim"
            onClick={() => setAcik(false)}
            className="block rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
            role="menuitem"
          >
            Sertifikalarım
          </Link>
          <Link
            href="/profil"
            onClick={() => setAcik(false)}
            className="block rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
            role="menuitem"
          >
            Profil
          </Link>
          <button
            type="button"
            onClick={cikisYapVeKapat}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            role="menuitem"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}
