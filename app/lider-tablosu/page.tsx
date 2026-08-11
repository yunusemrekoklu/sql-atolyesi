import { createClient } from "@/lib/supabase/server";
import { KART_SINIFI } from "@/lib/ui/kart";

export const metadata = { title: "Lider Tablosu" };

// Puan durumu sürekli değiştiği için kısa aralıklı ISR — her istekte
// sorgulamaktan kaçınırken standings'i makul tazelikte tutar.
export const revalidate = 300;

async function liderTablosunuGetir() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) {
    console.error("Lider tablosu alınamadı:", error);
    return [];
  }
  return data ?? [];
}

export default async function LiderTablosuPage() {
  const siralama = await liderTablosunuGetir();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Lider Tablosu</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300">
          Ders, pratik, mülakat, sınav ve deneme sınavlarından kazanılan puanlara göre en yüksek 100 kullanıcı.
        </p>
      </header>

      {siralama.length === 0 ? (
        <div className={KART_SINIFI}>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Henüz lider tablosunda kimse yok — profilinden adını ayarlayıp puan kazanan ilk kişi sen ol.
          </p>
        </div>
      ) : (
        <div className={`overflow-hidden ${KART_SINIFI}`}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 dark:border-stone-800 dark:text-stone-400">
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium">Ad Soyad</th>
                <th className="py-2 pr-3 font-medium">Üniversite</th>
                <th className="py-2 pl-3 text-right font-medium">Puan</th>
              </tr>
            </thead>
            <tbody>
              {siralama.map((satir) => (
                <tr key={satir.rank} className="border-b border-stone-100 last:border-0 dark:border-stone-900">
                  <td className="py-2.5 pr-3 text-stone-500 dark:text-stone-400">{satir.rank}</td>
                  <td className="py-2.5 pr-3 font-medium">{satir.display_name}</td>
                  <td className="py-2.5 pr-3 text-stone-600 dark:text-stone-300">{satir.university ?? "—"}</td>
                  <td className="py-2.5 pl-3 text-right font-semibold text-accent">{satir.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
