"use client";

import { useEffect, useRef } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { sqlAcikTema } from "@/lib/editor/sqlTema";

const temaCompartment = new Compartment();
const acikTemaEklentisi = syntaxHighlighting(sqlAcikTema);

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/Cmd+Enter ile tetiklenir (ör. "Kontrol Et" butonunu çalıştırmak için). */
  onRunRequest?: () => void;
  /** true olduğunda (ör. akordeonda bu alıştırma az önce açıldığında/aktif olduğunda)
   * editöre otomatik odaklanır — kullanıcı tıklamadan yazmaya devam edebilsin diye. */
  otomatikOdaklan?: boolean;
}

export function SqlEditor({ value, onChange, onRunRequest, otomatikOdaklan }: SqlEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRequestRef = useRef(onRunRequest);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    onChangeRef.current = onChange;
    onRunRequestRef.current = onRunRequest;
  }, [onChange, onRunRequest]);

  useEffect(() => {
    if (!hostRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          bracketMatching(),
          sql(),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                onRunRequestRef.current?.();
                return true;
              },
            },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          temaCompartment.of(resolvedTheme === "dark" ? oneDark : acikTemaEklentisi),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
          EditorView.theme({
            "&": { fontSize: "16px" },
            ".cm-content": { fontFamily: "var(--font-geist-mono), monospace", minHeight: "10rem" },
            ".cm-scroller": { overflow: "auto" },
          }),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Yalnızca bir kez kurulur; değer/tema güncellemeleri aşağıdaki effect'lerde yönetilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: temaCompartment.reconfigure(resolvedTheme === "dark" ? oneDark : acikTemaEklentisi),
    });
  }, [resolvedTheme]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const mevcutIcerik = view.state.doc.toString();
    if (mevcutIcerik !== value) {
      view.dispatch({ changes: { from: 0, to: mevcutIcerik.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    if (otomatikOdaklan) viewRef.current?.focus();
  }, [otomatikOdaklan]);

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white text-sm dark:border-stone-800">
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-3 py-1.5 dark:border-stone-800 dark:bg-stone-900">
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="ml-auto font-mono text-[11px] text-stone-400 dark:text-stone-500">SQL</span>
      </div>
      <div ref={hostRef} />
    </div>
  );
}
