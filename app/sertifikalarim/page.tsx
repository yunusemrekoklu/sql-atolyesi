import { SertifikalarimListesi } from "@/components/certificate/SertifikalarimListesi";
import { HUB_BASLIK_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Sertifikalarım" };

export default function SertifikalarimPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <header className={HUB_BASLIK_SINIFI}>
        <h1 className="text-2xl font-bold tracking-tight">Sertifikalarım</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          Kazandığın ve kazanmaya yaklaştığın tüm sertifikalar.
        </p>
      </header>
      <div className="mt-6">
        <SertifikalarimListesi />
      </div>
    </div>
  );
}
