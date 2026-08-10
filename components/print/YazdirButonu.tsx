"use client";

export function YazdirButonu() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-colors hover:bg-accent-hover"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      YAZDIR <span className="font-normal tracking-normal text-white/80">(Ctrl+P)</span>
    </button>
  );
}
