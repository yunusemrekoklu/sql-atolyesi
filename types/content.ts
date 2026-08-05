export interface SampleDatabase {
  id: string;
  ad: string;
  aciklama: string;
  ddl: string;
}

export type GraderModu = "sonuc" | "tabloDurumu";

export interface Exercise {
  id: string;
  seviye: "Kolay" | "Orta" | "Zor";
  baslik: string;
  soru: string;
  ipucu: string;
  cozumSql: string;
  mod: GraderModu;
  /** sadece mod: 'sonuc' için — bkz. lib/sql/grader.ts */
  siralamaOnemli?: boolean;
  kolonAdiOnemli?: boolean;
}

export interface RunnableExampleContent {
  sql: string;
  aciklama?: string;
}

export interface QuizQuestion {
  id: string;
  soru: string;
  secenekler: string[];
  /** secenekler dizisindeki doğru cevabın index'i */
  dogruIndex: number;
  aciklama: string;
}

export interface Lesson {
  slug: string;
  uniteId: number;
  dersNo: string;
  baslik: string;
  veritabaniId: string;
  anlatim: string;
  ornekler: RunnableExampleContent[];
  /** Alıştırmalardan önce örnek verinin tamamının gösterileceği tablo(lar) — bkz. DataPreviewTable. */
  onizlemeTablolari?: string[];
  alistirmalar: Exercise[];
  miniQuiz: QuizQuestion[];
}

export function defineLesson(lesson: Lesson): Lesson {
  return lesson;
}
