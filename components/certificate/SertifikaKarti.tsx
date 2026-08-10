interface SertifikaKartiProps {
  ad: string;
  kursSatiri: string;
  tarih: string;
  id: string;
  arkaPlan?: string;
}

/**
 * Arka plan görseline (public/sertifika-arka-plan.png) yüzde bazlı metin
 * bindirme yapar. Şablonda isim/kurs satırı/tarih/ID alanları noktalı
 * çizgilerle bırakılmış — dördü de burada koddan yazılıyor. Konumlar
 * public/sertifika-arka-plan.png (2000x1414) üzerinde piksel ölçümüyle
 * kalibre edildi; img tam genişlikte render edildiği için yüzdeler farklı
 * ekran boyutlarında da doğru hizalanır.
 */
export function SertifikaKarti({ ad, kursSatiri, tarih, id, arkaPlan = "/sertifika-arka-plan.png" }: SertifikaKartiProps) {
  return (
    <div className="relative mx-auto w-full max-w-3xl [container-type:inline-size]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={arkaPlan} alt="" className="h-auto w-full select-none" draggable={false} />

      <p
        className="font-script absolute inset-x-0 text-center text-stone-900"
        style={{ top: "47%", fontSize: "7.2cqw", lineHeight: 1 }}
      >
        {ad}
      </p>

      <p
        className="font-open-sans absolute inset-x-0 text-center text-stone-700 italic"
        style={{ top: "63%", fontSize: "1.85cqw" }}
      >
        {kursSatiri}
      </p>

      <p className="font-open-sans absolute text-stone-600" style={{ top: "79.4%", left: "16.6%", fontSize: "1.5cqw" }}>
        <span className="font-semibold">EARNED ON:</span> {tarih}
      </p>

      <p className="font-open-sans absolute text-stone-600" style={{ top: "82.1%", left: "16.6%", fontSize: "1.5cqw" }}>
        <span className="font-semibold">ID:</span> {id}
      </p>
    </div>
  );
}
