import type { QuizQuestion } from "@/types/content";

const HARFLER = ["A", "B", "C", "D", "E", "F"];

export function CoktanSecmeliYazdirListesi({ sorular }: { sorular: QuizQuestion[] }) {
  return (
    <ol className="space-y-6">
      {sorular.map((soru, i) => (
        <li
          key={soru.id}
          className="break-inside-avoid-page border-b border-stone-300 pb-4 last:border-b-0 last:pb-0"
        >
          <p className="font-medium">
            {i + 1}. {soru.soru}
          </p>
          <ul className="mt-2 space-y-1.5">
            {soru.secenekler.map((secenek, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-stone-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-stone-400 text-[10px] font-medium text-stone-500">
                  {HARFLER[j] ?? j + 1}
                </span>
                <span>{secenek}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
