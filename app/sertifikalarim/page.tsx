import { SertifikalarimListesi } from "@/components/certificate/SertifikalarimListesi";

export const metadata = { title: "Sertifikalarım" };

export default function SertifikalarimPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Sertifikalarım</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
        Kazandığın ve kazanmaya yaklaştığın tüm sertifikalar.
      </p>
      <div className="mt-6">
        <SertifikalarimListesi />
      </div>
    </div>
  );
}
