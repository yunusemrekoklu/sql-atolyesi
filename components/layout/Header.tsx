import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/ogren", label: "Öğren" },
  { href: "/pratik", label: "Pratik" },
  { href: "/sinav", label: "Sınav" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/fonksiyonlar", label: "Fonksiyonlar" },
  { href: "/playground", label: "Playground" },
  { href: "/hakkinda", label: "Hakkında" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          SQL Atölyesi
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-stone-600 dark:text-stone-300 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-stone-950 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
