import Link from "next/link";
import { TUM_SINAV_SORULARI } from "@/content/exams";
import { ExamSimulation } from "@/components/quiz/ExamSimulation";

export const metadata = { title: "Sınav Simülasyonu" };

export default function SinavSimulasyonPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-1">
        <Link
          href="/sinav/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Tüm sınavlar
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sınav Simülasyonu</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Süreli, gerçek sınav deneyimi: Vize, Final veya Özel mod seç, süre dolunca sınav otomatik teslim edilir.
        </p>
      </div>

      <ExamSimulation tumSorular={TUM_SINAV_SORULARI} />
    </div>
  );
}
