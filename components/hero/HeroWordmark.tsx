import { Database, Search, Terminal } from "lucide-react";
import type { CSSProperties } from "react";

// Intro'daki (GirisAnimasyonu) ikon setiyle aynı dil — o tek seferlik,
// bu sayfa açık olduğu sürece hero'nun arkasında sürekli yörüngede.
export function HeroWordmark() {
  return (
    <div className="relative flex h-16 items-center justify-center sm:h-24">
      <Database
        aria-hidden="true"
        className="hero-yorunge-ikon pointer-events-none absolute h-5 w-5 text-brand-orange opacity-40 sm:h-6 sm:w-6"
        style={{ "--rx": "6rem", "--ry": "1rem", animationDelay: "0s" } as CSSProperties}
      />
      <Terminal
        aria-hidden="true"
        className="hero-yorunge-ikon pointer-events-none absolute h-5 w-5 text-brand-green opacity-40 sm:h-6 sm:w-6"
        style={{ "--rx": "4.5rem", "--ry": "1.5rem", animationDelay: "-3s" } as CSSProperties}
      />
      <Search
        aria-hidden="true"
        className="hero-yorunge-ikon pointer-events-none absolute h-4 w-4 text-foreground opacity-30 sm:h-5 sm:w-5"
        style={{ "--rx": "7.5rem", "--ry": "0.75rem", animationDelay: "-6s" } as CSSProperties}
      />
      <span className="relative font-mono text-5xl font-bold tracking-tight sm:text-6xl">
        <span className="text-foreground">SQL</span>
        <span className="text-brand-orange">CODEX</span>
      </span>
    </div>
  );
}
