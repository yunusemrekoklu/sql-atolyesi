interface SertifikaKartiProps {
  ad: string;
  kursSatiri: string;
  tarih: string;
  id: string;
}

/**
 * Arka plan görseline (public/sertifika-arka-plan.png) yüzde bazlı metin
 * bindirme yapar. "Has successfully completed the SQLCODEX" cümlesi
 * görselin içine gömülü — kursSatiri sadece bu cümlenin devamı olarak
 * ("Unit 1 course.", "Practical Section." vb.) aynı satıra eklenir.
 * Konumlar public/sertifika-arka-plan.png (2000x1414) üzerinde piksel
 * ölçümüyle kalibre edildi; img tam genişlikte render edildiği için
 * yüzdeler farklı ekran boyutlarında da doğru hizalanır.
 */
export function SertifikaKarti({ ad, kursSatiri, tarih, id }: SertifikaKartiProps) {
  return (
    <div className="relative mx-auto w-full max-w-3xl [container-type:inline-size]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/sertifika-arka-plan.png" alt="" className="h-auto w-full select-none" draggable={false} />

      <p
        className="font-script absolute inset-x-0 text-center text-stone-900"
        style={{ top: "44%", fontSize: "7.2cqw", lineHeight: 1 }}
      >
        {ad}
      </p>

      <p
        className="absolute text-stone-700 italic"
        style={{ top: "62.6%", left: "69%", fontSize: "1.85cqw" }}
      >
        {kursSatiri}
      </p>

      <p className="absolute text-stone-600" style={{ top: "79.4%", left: "27%", fontSize: "1.5cqw" }}>
        {tarih}
      </p>

      <p className="absolute text-stone-600" style={{ top: "82.1%", left: "19.6%", fontSize: "1.5cqw" }}>
        {id}
      </p>
    </div>
  );
}
