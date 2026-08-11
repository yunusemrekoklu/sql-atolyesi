import { ProfilFormu } from "@/components/profil/ProfilFormu";
import { HUB_BASLIK_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Profil" };

export default function ProfilPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <header className={HUB_BASLIK_SINIFI}>
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">Adını ve avatarını düzenle.</p>
      </header>
      <div className="mt-6">
        <ProfilFormu />
      </div>
    </div>
  );
}
