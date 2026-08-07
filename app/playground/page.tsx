import { Playground } from "@/components/playground/Playground";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Playground</h1>
        <p className="text-stone-600 dark:text-stone-300">
          Serbest sorgu alanı — örnek veritabanları arasında geçiş yap, istediğin gibi INSERT/UPDATE/CREATE dene.
          Değişikliklerin sayfada kaldığın sürece kalıcıdır; baştan başlamak için Sıfırla&apos;ya bas.
        </p>
      </div>

      <Playground />
    </div>
  );
}
