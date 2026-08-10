import Link from "next/link";
import { KayitFormu } from "@/components/auth/KayitFormu";
import { KART_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Kayıt Ol" };

export default function KayitPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className={KART_SINIFI}>
        <h1 className="text-2xl font-bold tracking-tight">Hesap Oluştur</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          İlerlemen kaydedilsin, sertifikalarını paylaşılabilir hale getir.
        </p>

        <KayitFormu />

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="font-semibold text-accent hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
