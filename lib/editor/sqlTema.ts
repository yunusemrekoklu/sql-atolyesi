import { HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

/**
 * Açık mod SQL syntax highlighting teması — krem arka plan (#faf8f3) üzerinde
 * okunaklı kontrast için. Karanlık modda CodeMirror'ın hazır `oneDark` teması
 * kullanılıyor (kendi highlighting'ini içeriyor), bu yüzden yalnızca açık mod
 * için tanımlanıyor.
 */
export const sqlAcikTema = HighlightStyle.define([
  { tag: t.keyword, color: "#1d4ed8", fontWeight: "600" },
  { tag: [t.typeName, t.atom, t.bool, t.null], color: "#7c3aed" },
  { tag: [t.string, t.special(t.string)], color: "#047857" },
  { tag: t.number, color: "#c2410c" },
  { tag: t.comment, color: "#78716c", fontStyle: "italic" },
  { tag: [t.operator, t.punctuation], color: "#44403c" },
  { tag: [t.propertyName, t.variableName], color: "#1c1917" },
  { tag: t.function(t.variableName), color: "#0e7490" },
  { tag: t.invalid, color: "#dc2626" },
]);
