"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Database,
  Search,
  Terminal,
  type LucideIcon,
} from "lucide-react";

const FLAG = "sqlcodex-intro-oynadi";
const HARFLER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const IKONLAR: LucideIcon[] = [Search, Terminal, Database, ChevronRight];
const KARE_SAYISI = 16;
const KARE_SURESI_MS = 60;
const BEKLEME_MS = 300;

type Kare = { tur: "harf"; harf: string } | { tur: "ikon"; Ikon: LucideIcon };

// Her 4. kare bir ikon (graffico'daki harf+ikon karışımını yansıtıyor),
// diğerleri art arda aynı harfi tekrar etmeyen rastgele büyük harfler.
function kareleriUret(): Kare[] {
  const kareler: Kare[] = [];
  let oncekiHarf = "";
  let ikonIndex = 0;
  for (let i = 0; i < KARE_SAYISI; i++) {
    if ((i + 1) % 4 === 0) {
      kareler.push({ tur: "ikon", Ikon: IKONLAR[ikonIndex % IKONLAR.length] });
      ikonIndex++;
    } else {
      let harf = HARFLER[Math.floor(Math.random() * HARFLER.length)];
      while (harf === oncekiHarf) {
        harf = HARFLER[Math.floor(Math.random() * HARFLER.length)];
      }
      oncekiHarf = harf;
      kareler.push({ tur: "harf", harf });
    }
  }
  return kareler;
}

export function GirisAnimasyonu() {
  // Sunucu ve ilk istemci render'ında aynı (deterministik) — sessionStorage
  // sadece useEffect içinde okunuyor, render gövdesinde okunursa SSR çöker.
  const [introGorunur, setIntroGorunur] = useState(true);
  const [kapaniyor, setKapaniyor] = useState(false);
  const [aktifKare, setAktifKare] = useState<Kare | null>(null);
  const [azaltilmisHareket, setAzaltilmisHareket] = useState(false);
  const atlaButonuRef = useRef<HTMLButtonElement>(null);
  const zamanlayiciRef = useRef<{
    interval?: ReturnType<typeof setInterval>;
    timeout?: ReturnType<typeof setTimeout>;
  }>({});

  useEffect(() => {
    let zatenGorulmus = false;
    try {
      zatenGorulmus = sessionStorage.getItem(FLAG) === "1";
    } catch {
      // sessionStorage erişilemezse (gizli sekme/kısıtlı ayar) intro'yu göstermeye devam
    }

    if (zatenGorulmus) {
      setIntroGorunur(false);
      return;
    }

    const hareketAzaltilmisMi = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setAzaltilmisHareket(hareketAzaltilmisMi);
    atlaButonuRef.current?.focus();

    function kapat() {
      try {
        sessionStorage.setItem(FLAG, "1");
      } catch {
        // yazılamıyorsa sorun değil, sonraki ziyarette tekrar oynar
      }
      setKapaniyor(true);
    }

    if (hareketAzaltilmisMi) {
      zamanlayiciRef.current.timeout = setTimeout(kapat, BEKLEME_MS);
      return () => clearTimeout(zamanlayiciRef.current.timeout);
    }

    const kareler = kareleriUret();
    let i = 0;
    zamanlayiciRef.current.interval = setInterval(() => {
      i++;
      if (i >= kareler.length) {
        clearInterval(zamanlayiciRef.current.interval);
        setAktifKare(null);
        zamanlayiciRef.current.timeout = setTimeout(kapat, BEKLEME_MS);
        return;
      }
      setAktifKare(kareler[i - 1]);
    }, KARE_SURESI_MS);

    return () => {
      clearInterval(zamanlayiciRef.current.interval);
      clearTimeout(zamanlayiciRef.current.timeout);
    };
  }, []);

  useEffect(() => {
    if (!introGorunur) return;
    const eskiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const hero = document.querySelector<HTMLElement>("[data-hero-icerik]");
    if (hero) hero.inert = true;
    return () => {
      document.body.style.overflow = eskiOverflow;
      if (hero) hero.inert = false;
    };
  }, [introGorunur]);

  function girisiAtla() {
    clearInterval(zamanlayiciRef.current.interval);
    clearTimeout(zamanlayiciRef.current.timeout);
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {
      // yazılamıyorsa sorun değil
    }
    setKapaniyor(true);
  }

  if (!introGorunur) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Yükleniyor"
      onAnimationEnd={() => setIntroGorunur(false)}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background ${
        kapaniyor
          ? azaltilmisHareket
            ? "animate-out fade-out-0 duration-150"
            : "animate-out fade-out-0 zoom-out-95 duration-300"
          : ""
      }`}
    >
      <button
        ref={atlaButonuRef}
        type="button"
        onClick={girisiAtla}
        className="absolute top-4 right-4 rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        Girişi atla
      </button>
      <div aria-hidden="true" className="flex items-center gap-3">
        {aktifKare === null ? (
          <>
            <img
              src="/sqlcodex-icon.png"
              alt=""
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />
            <span className="font-mono text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="text-foreground">SQL</span>
              <span className="text-brand-orange">CODEX</span>
            </span>
          </>
        ) : aktifKare.tur === "harf" ? (
          <span className="font-mono text-6xl font-bold text-foreground sm:text-7xl">
            {aktifKare.harf}
          </span>
        ) : (
          <aktifKare.Ikon
            className="h-16 w-16 text-brand-orange sm:h-20 sm:w-20"
            strokeWidth={2}
          />
        )}
      </div>
    </div>
  );
}
