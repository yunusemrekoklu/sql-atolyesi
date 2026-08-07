"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { sqlAcikTema } from "@/lib/editor/sqlTema";

const acikTemaEklentisi = syntaxHighlighting(sqlAcikTema);

/**
 * Salt-okunur, renkli SQL kod bloğu — çözüm/örnek gösterimlerinde çıplak
 * `<pre><code>` yerine kullanılır. Aynı sql() dil desteği ve tema mantığını
 * SqlEditor ile paylaşır ama düzenlenemez (klavye haritası, imleç yok).
 */
export function SqlCodeBlock({ sql: sqlMetni }: { sql: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!hostRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: sqlMetni,
        extensions: [
          EditorView.editable.of(false),
          sql(),
          resolvedTheme === "dark" ? oneDark : acikTemaEklentisi,
          EditorView.theme({
            "&": { fontSize: "14px" },
            ".cm-content": { fontFamily: "var(--font-geist-mono), monospace", padding: "0.75rem" },
            ".cm-scroller": { overflow: "auto" },
            ".cm-gutters": { display: "none" },
          }),
        ],
      }),
      parent: hostRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [sqlMetni, resolvedTheme]);

  return (
    <div
      ref={hostRef}
      className="overflow-hidden rounded-lg border border-stone-200 text-sm dark:border-stone-800 dark:bg-stone-900"
    />
  );
}
