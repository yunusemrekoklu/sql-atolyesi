"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label="Temayı değiştir"
    >
      <span className="dark:hidden" aria-hidden="true">
        🌙
      </span>
      <span className="hidden dark:inline" aria-hidden="true">
        ☀️
      </span>
    </button>
  );
}
