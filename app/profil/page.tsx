import { ProfilFormu } from "@/components/profil/ProfilFormu";

export const metadata = { title: "Profil" };

export default function ProfilPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">Adını ve avatarını düzenle.</p>
      <div className="mt-6">
        <ProfilFormu />
      </div>
    </div>
  );
}
