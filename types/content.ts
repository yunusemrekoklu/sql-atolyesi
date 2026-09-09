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

export interface PracticeSet {
  slug: string;
  baslik: string;
  aciklama: string;
  veritabaniId: string;
  sorular: Exercise[];
}

export function definePracticeSet(set: PracticeSet): PracticeSet {
  return set;
}

/** Ünite sınav havuzundan bir soru — QuizQuestion'a benzer ama karne/kırılım için ek alanlar taşır. */
export interface ExamQuestion {
  id: string;
  uniteId: number;
  konu: string;
  /** Yanlış cevapta "bu konuyu tekrar et" linkinin gideceği ders. */
  dersSlug: string;
  soru: string;
  secenekler: string[];
  dogruIndex: number;
  aciklama: string;
}

export interface InterviewQuestion {
  slug: string;
  seviye: "Kolay" | "Orta" | "Zor";
  sirket: string;
  baslik: string;
  senaryo: string;
  ddl: string;
  onizlemeTablolari?: string[];
  /** Kademeli ipuçları — sırayla açılır. */
  ipuclari: string[];
  cozumSql: string;
  aciklama: string;
  mod: GraderModu;
  siralamaOnemli?: boolean;
  kolonAdiOnemli?: boolean;
  takipSorusu: string;
  takipCevabi: string;
}

export function defineInterviewQuestion(soru: InterviewQuestion): InterviewQuestion {
  return soru;
}

/**
 * Vaka (Dedektif Vakası) zorluk seviyesi — bilinçli olarak Exercise/InterviewQuestion'ın
 * "Kolay"|"Orta"|"Zor" Seviye tipinden AYRI bir tip: o tek tek soru/alıştırma etiketi ve
 * erişimi kısıtlamıyor, bu ise bütün bir vakanın seviyesi ve bir üst seviyeyi kilitliyor
 * (bkz. lib/progress/vaka.ts seviyeAcikMi). "Orta" değeri iki tipte de var ama tip
 * düzeyinde birbirine karışmıyorlar.
 */
export type VakaSeviyesi = "Başlangıç" | "Orta" | "İleri";

export interface Vaka {
  slug: string;
  seviye: VakaSeviyesi;
  xp: number;
  baslik: string;
  /** Hub kartındaki kısa özet. */
  ozet: string;
  /** "Vaka Dosyası" sekmesindeki tam hikaye metni (markdown). */
  hikaye: string;
  /** Numaralı, bilgilendirici hedef listesi — ayrı ayrı derecelendirilmez, sadece rehberlik eder. */
  hedefler: string[];
  ddl: string;
  /** Kademeli ipuçları — sırayla açılır. */
  ipuclari: string[];
  cozumSql: string;
  /** Vaka çözülünce açığa çıkan "vaka kapandı" açıklaması. */
  aciklama: string;
  mod: "sonuc";
  siralamaOnemli?: boolean;
  kolonAdiOnemli?: boolean;
}

export function defineVaka(vaka: Vaka): Vaka {
  return vaka;
}

export type FonksiyonKategorisi = "Metin" | "Sayısal" | "Tarih" | "NULL/Koşul" | "Toplulaştırma";

export interface FunctionRef {
  slug: string;
  ad: string;
  kategori: FonksiyonKategorisi;
  sozDizimi: string;
  aciklama: string;
  veritabaniId: string;
  ornekSql: string;
  ornekAciklama?: string;
  /** Diğer veritabanlarındaki (MySQL/SQL Server) karşılığı ya da farkı — varsa. */
  digerVeritabanlari?: string;
  /** Sınavda/mülakatta en çok çıkanlar için rozet. */
  oncelikli?: boolean;
}

export function defineFunctionRef(fn: FunctionRef): FunctionRef {
  return fn;
}
