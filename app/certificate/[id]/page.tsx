import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sertifikaBecerileriniGetir } from "@/lib/certificate/beceriler";
import { SertifikaKarti } from "@/components/certificate/SertifikaKarti";
import { SITE_URL } from "@/lib/site";

// Sertifika içeriği bir kez verilince değişmiyor — build anında bilinmeyen
// ID'ler için istek anında render edilir, sonra 7 gün ISR ile önbelleklenir.
export const revalidate = 604800;

const UUID_DESENI = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SertifikaKaydi {
  cert_type: string;
  display_code: string;
  id: string;
  issued_at: string;
  recipient_name: string;
}

async function sertifikayiGetir(id: string): Promise<SertifikaKaydi | null> {
  // Geçersiz formatta gereksiz RPC round-trip'i yapma.
  if (!UUID_DESENI.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_certificate_by_id", { p_id: id });
  if (error || !data || data.length === 0) return null;
  return data[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sertifika = await sertifikayiGetir(id);
  if (!sertifika) return { title: "Sertifika Bulunamadı" };

  const beceriler = sertifikaBecerileriniGetir(sertifika.cert_type);
  const baslik = beceriler?.baslik ?? sertifika.cert_type;
  const tamBaslik = `${sertifika.recipient_name} — ${baslik} Sertifikası`;
  const aciklama = `${sertifika.recipient_name}, SQLCODEX'te ${baslik} bölümünü başarıyla tamamladı.`;
  const gorsel = sertifika.cert_type === "tumu" ? "/sertifika-arka-plan-tumu.png" : "/sertifika-arka-plan.png";

  return {
    title: tamBaslik,
    description: aciklama,
    openGraph: {
      title: tamBaslik,
      description: aciklama,
      url: `${SITE_URL}/certificate/${id}`,
      images: [gorsel],
    },
    twitter: {
      card: "summary_large_image",
      title: tamBaslik,
      description: aciklama,
      images: [gorsel],
    },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sertifika = await sertifikayiGetir(id);
  if (!sertifika) notFound();

  const beceriler = sertifikaBecerileriniGetir(sertifika.cert_type);
  if (!beceriler) notFound();

  const tarih = sertifika.issued_at.slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <SertifikaKarti
        ad={sertifika.recipient_name}
        kursSatiri={beceriler.kursSatiri}
        tarih={tarih}
        id={sertifika.display_code}
        arkaPlan={sertifika.cert_type === "tumu" ? "/sertifika-arka-plan-tumu.png" : "/sertifika-arka-plan.png"}
        altinTema={sertifika.cert_type === "tumu"}
      />

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Kapsadığı Konular</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {beceriler.beceriler.map((beceri) => (
            <li key={beceri} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
              <span className="mt-0.5 text-green-600 dark:text-green-400" aria-hidden="true">
                ✓
              </span>
              {beceri}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
