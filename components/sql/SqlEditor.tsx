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
import { bracketMatching, defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";

const temaCompartment = new Compartment();

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/Cmd+Enter ile tetiklenir (ör. "Kontrol Et" butonunu çalıştırmak için). */
  onRunRequest?: () => void;
}

export function SqlEditor({ value, onChange, onRunRequest }: SqlEditorProps) {
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
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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
          temaCompartment.of([]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
          EditorView.theme({
            "&": { fontSize: "16px" },
            ".cm-content": { fontFamily: "var(--font-geist-mono), monospace", minHeight: "5rem" },
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
      effects: temaCompartment.reconfigure(resolvedTheme === "dark" ? oneDark : []),
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

  return (
    <div
      ref={hostRef}
      className="overflow-hidden rounded-lg border border-zinc-200 text-sm dark:border-zinc-800"
    />
  );
}
