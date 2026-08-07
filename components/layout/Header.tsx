"use client";

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

  return (
    <div className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
      <header className="flex h-14 items-center justify-between gap-4 rounded-full border-2 border-stone-800 bg-white/95 px-4 backdrop-blur dark:border-stone-200 dark:bg-stone-950/95">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 p-1.5">
            <img
              src="/sqlcodex-icon.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-mono font-bold tracking-tight">SQLCODEX</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-stone-600 dark:text-stone-300 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 py-1 transition-colors ${
                  active
                    ? "border-blue-500 text-stone-950 dark:border-blue-400 dark:text-white"
                    : "border-transparent hover:text-stone-950 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </header>
    </div>
  );
}
