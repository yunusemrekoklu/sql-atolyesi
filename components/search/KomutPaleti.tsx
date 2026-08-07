"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TUM_DERSLER } from "@/content/lessons";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { turkceIcerir } from "@/lib/search/turkce";

interface AramaSonucu {
  tur: "Dersler" | "Pratik" | "Mülakat";
  baslik: string;
  altBaslik: string;
  href: string;
}

const TUM_SONUCLAR: AramaSonucu[] = [
  ...TUM_DERSLER.map(
    (ders): AramaSonucu => ({
      tur: "Dersler",
      baslik: `${ders.dersNo} ${ders.baslik}`,
      altBaslik: `Ünite ${ders.uniteId}`,
      href: `/ogren/${ders.slug}`,
    }),
  ),
  ...TUM_PRATIK_SETLERI.map(
    (set): AramaSonucu => ({
      tur: "Pratik",
      baslik: set.baslik,
      altBaslik: set.aciklama,
      href: `/pratik/${set.slug}`,
    }),
  ),
  ...TUM_MULAKAT_SORULARI.map(
    (soru): AramaSonucu => ({
      tur: "Mülakat",
      baslik: soru.baslik,
      altBaslik: soru.sirket,
      href: `/mulakat/${soru.slug}`,
    }),
  ),
];

const TUR_SIRASI: AramaSonucu["tur"][] = ["Dersler", "Pratik", "Mülakat"];

export function KomutPaleti() {
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [sorgu, setSorgu] = useState("");
  const [seciliIndex, setSeciliIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const sonuclar = useMemo(() => {
    if (sorgu.trim() === "") return TUM_SONUCLAR.slice(0, 8);
    return TUM_SONUCLAR.filter(
      (s) => turkceIcerir(s.baslik, sorgu) || turkceIcerir(s.altBaslik, sorgu),
    ).slice(0, 20);
  }, [sorgu]);

  useEffect(() => {
    setSeciliIndex(0);
  }, [sorgu, acik]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAcik((v) => !v);
        return;
      }
      if (e.key === "Escape") setAcik(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (acik) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      setSorgu("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [acik]);

  function git(href: string) {
    router.push(href);
    setAcik(false);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSeciliIndex((i) => Math.min(i + 1, sonuclar.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSeciliIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const secili = sonuclar[seciliIndex];
      if (secili) git(secili.href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-stone-200 px-3 text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800"
        aria-label="Ara"
      >
        <span aria-hidden="true">🔍</span>
        <kbd className="hidden font-mono text-xs text-stone-400 sm:inline dark:text-stone-500">
          Ctrl K
        </kbd>
      </button>

      {acik && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24">
          <div
            className="absolute inset-0"
            onClick={() => setAcik(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-950">
            <input
              ref={inputRef}
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Ders, pratik seti veya mülakat sorusu ara…"
              className="w-full border-b border-stone-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-stone-800"
            />
            <div className="max-h-80 overflow-y-auto p-2">
              {sonuclar.length === 0 && (
                <p className="p-3 text-sm text-stone-500 dark:text-stone-400">
                  Sonuç bulunamadı.
                </p>
              )}
              {TUR_SIRASI.map((tur) => {
                const grup = sonuclar.filter((s) => s.tur === tur);
                if (grup.length === 0) return null;
                return (
                  <div key={tur} className="mb-1 last:mb-0">
                    <p className="px-3 py-1 text-xs font-medium text-stone-400 dark:text-stone-500">
                      {tur}
                    </p>
                    {grup.map((s) => {
                      const globalIndex = sonuclar.indexOf(s);
                      const secili = globalIndex === seciliIndex;
                      return (
                        <button
                          key={s.href}
                          type="button"
                          onClick={() => git(s.href)}
                          onMouseEnter={() => setSeciliIndex(globalIndex)}
                          className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors ${
                            secili
                              ? "bg-stone-100 dark:bg-stone-800"
                              : "hover:bg-stone-50 dark:hover:bg-stone-900"
                          }`}
                        >
                          <span className="text-sm font-medium">{s.baslik}</span>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {s.altBaslik}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
