import Link from "next/link";
import { GirisFormu } from "@/components/auth/GirisFormu";
import { KART_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Giriş Yap" };

export default async function GirisPage(props: PageProps<"/giris">) {
  const searchParams = await props.searchParams;
  const dogrulamaHatasi = searchParams.hata === "dogrulama";

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className={KART_SINIFI}>
        <h1 className="text-2xl font-bold tracking-tight">Giriş Yap</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          İlerlemeni ve sertifikalarını görmek için giriş yap.
        </p>

        {dogrulamaHatasi && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            Doğrulama bağlantısı geçersiz ya da süresi dolmuş. Lütfen tekrar giriş yap.
          </p>
        )}

        <GirisFormu />

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-300">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-accent hover:underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
