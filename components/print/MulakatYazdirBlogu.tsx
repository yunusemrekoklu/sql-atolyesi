import type { InterviewQuestion } from "@/types/content";
import { MarkdownIcerik } from "@/components/markdown/MarkdownIcerik";
import { YaziAlani } from "./YaziAlani";

export function MulakatYazdirBlogu({ soru }: { soru: InterviewQuestion }) {
  return (
    <div className="space-y-6">
      <MarkdownIcerik>{soru.senaryo}</MarkdownIcerik>

      <div className="break-inside-avoid-page">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Şema</p>
        <pre className="mt-2 overflow-x-auto rounded-lg border border-stone-300 p-3 font-mono text-xs text-stone-800">
          {soru.ddl}
        </pre>
      </div>

      <div>
        <p className="text-sm font-medium">SQL cevabın:</p>
        <YaziAlani satirSayisi={8} />
      </div>

      <div className="break-inside-avoid-page border-t border-stone-300 pt-4">
        <p className="text-sm font-medium">🎤 Takip Sorusu: {soru.takipSorusu}</p>
        <YaziAlani satirSayisi={4} />
      </div>
    </div>
  );
}
