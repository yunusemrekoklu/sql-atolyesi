// /certificate/[id] genel doğrulama sayfası için: her sertifika türünün
// kapsadığı konu başlıkları listesi, doğrudan content/ dosyalarından
// türetilir (Supabase sadece isim/tarih/tür tutar — hangi konuları
// kapsadığı içerikten hesaplanır). components/certificate/SertifikaSayfasi.tsx
// içindeki baslikVeGeriLink/kursSatiriUret'in genişletilmiş, sunucu
// bileşenlerinden de kullanılabilen hali.
import { TUM_DERSLER } from "@/content/lessons";
import { TUM_PRATIK_SETLERI } from "@/content/practice";
import { TUM_MULAKAT_SORULARI } from "@/content/interview";
import { UNITE_BASLIKLARI } from "@/lib/content/uniteler";

export interface SertifikaBecerileri {
  baslik: string;
  kursSatiri: string;
  beceriler: string[];
}

export function sertifikaBecerileriniGetir(certType: string): SertifikaBecerileri | null {
  const uniteEslesme = /^unite-([1-5])$/.exec(certType);
  if (uniteEslesme) {
    const uniteId = Number(uniteEslesme[1]);
    const dersler = TUM_DERSLER.filter((ders) => ders.uniteId === uniteId);
    return {
      baslik: `Ünite ${uniteId} — ${UNITE_BASLIKLARI[uniteId]}`,
      kursSatiri: `Has successfully completed the SQLCODEX Unit ${uniteId} course.`,
      beceriler: dersler.map((ders) => `${ders.dersNo} ${ders.baslik}`),
    };
  }

  if (certType === "pratik") {
    return {
      baslik: "Pratik",
      kursSatiri: "Has successfully completed the SQLCODEX Practical Section.",
      beceriler: TUM_PRATIK_SETLERI.map((set) => set.baslik),
    };
  }

  if (certType === "mulakat") {
    return {
      baslik: "Mülakat",
      kursSatiri: "Has successfully completed the SQLCODEX Interview Section.",
      beceriler: TUM_MULAKAT_SORULARI.map((soru) => soru.baslik),
    };
  }

  if (certType === "tumu") {
    return {
      baslik: "Büyük Sertifika — Tüm Müfredat",
      kursSatiri: "Has successfully completed the entire SQLCODEX curriculum — Learn, Practical, and Interview.",
      beceriler: [
        ...[1, 2, 3, 4, 5].map((uniteId) => `Ünite ${uniteId} — ${UNITE_BASLIKLARI[uniteId]}`),
        "Pratik",
        "Mülakat",
      ],
    };
  }

  return null;
}
