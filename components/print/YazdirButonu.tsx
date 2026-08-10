"use client";

export function YazdirButonu() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex shrink-0 items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
    >
      🖨️ Yazdır <span className="text-xs text-stone-400 dark:text-stone-500">(Ctrl+P)</span>
    </button>
  );
}
