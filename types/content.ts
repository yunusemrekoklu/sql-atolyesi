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

export interface Lesson {
  slug: string;
  uniteId: number;
  dersNo: string;
  baslik: string;
  veritabaniId: string;
  anlatim: string;
  ornekler: RunnableExampleContent[];
  alistirmalar: Exercise[];
}

export function defineLesson(lesson: Lesson): Lesson {
  return lesson;
}
