"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/ogren", label: "Öğren" },
  { href: "/pratik", label: "Pratik" },
  { href: "/sinav", label: "Test Sınavı" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/fonksiyonlar", label: "Fonksiyonlar" },
  { href: "/playground", label: "Playground" },
  { href: "/hakkinda", label: "Hakkında" },
];

export function Header() {
  const pathname = usePathname();
  const [gizli, setGizli] = useState(false);
  const sonY = useRef(0);
  const beklemede = useRef(false);

  useEffect(() => {
    setGizli(false);
    sonY.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    const ESIK = 80;
    const MIN_DELTA = 8;

    function onScroll() {
      if (beklemede.current) return;
      beklemede.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - sonY.current;
        if (y < ESIK) setGizli(false);
        else if (delta > MIN_DELTA) setGizli(true);
        else if (delta < -MIN_DELTA) setGizli(false);
        sonY.current = y;
        beklemede.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`print:hidden sticky top-4 z-40 mx-auto w-full max-w-6xl px-4 transition-transform duration-300 ease-in-out ${
        gizli ? "-translate-y-[calc(100%+1rem)]" : "translate-y-0"
      }`}
    >
      <header className="flex h-14 items-center justify-between gap-4 rounded-full border-2 border-stone-800 bg-white/95 px-4 backdrop-blur dark:border-stone-200 dark:bg-stone-950/95">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center dark:rounded-full dark:bg-stone-100 dark:p-1">
            <img
              src="/sqlcodex-icon.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-mono text-lg font-bold tracking-tight">
            <span className="text-stone-950 dark:text-white">SQL</span>
            <span className="text-accent">CODEX</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-1 font-medium transition-colors ${
                  active
                    ? "font-semibold text-stone-950 dark:text-white"
                    : "text-stone-600 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left rounded-full bg-accent transition-transform duration-150 ease-out ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </header>
    </div>
  );
}
