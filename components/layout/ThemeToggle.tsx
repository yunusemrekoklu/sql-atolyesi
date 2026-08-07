"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800"
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
