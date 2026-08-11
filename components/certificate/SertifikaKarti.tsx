interface SertifikaKartiProps {
  ad: string;
  kursSatiri: string;
  tarih: string;
  id: string;
  arkaPlan?: string;
  altinTema?: boolean;
}

/** "Tümü tamamlandı" sertifikasındaki altın başlıklarla eşleşen dolgu/ana hat renkleri. */
const ALTIN_METIN_STIL = {
  color: "#ffd700",
  WebkitTextStroke: "0.035em #806c00",
} as const;

/**
 * Arka plan görseline (public/sertifika-arka-plan.png) yüzde bazlı metin
 * bindirme yapar. Şablonda isim/kurs satırı/tarih/ID alanları noktalı
 * çizgilerle bırakılmış — dördü de burada koddan yazılıyor. Konumlar
 * public/sertifika-arka-plan.png (2000x1414) üzerinde piksel ölçümüyle
 * kalibre edildi; img tam genişlikte render edildiği için yüzdeler farklı
 * ekran boyutlarında da doğru hizalanır.
 */
export function SertifikaKarti({
  ad,
  kursSatiri,
  tarih,
  id,
  arkaPlan = "/sertifika-arka-plan.png",
  altinTema = false,
}: SertifikaKartiProps) {
  return (
    <div className="sertifika-yazdir-alani relative mx-auto w-full max-w-3xl [container-type:inline-size]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={arkaPlan} alt="" className="h-auto w-full select-none" draggable={false} />

      <p
        className="font-script absolute inset-x-0 text-center text-stone-900"
        style={{ top: "47%", fontSize: "7.2cqw", lineHeight: 1 }}
      >
        {ad}
      </p>

      <p
        className={`font-open-sans absolute inset-x-0 text-center italic ${altinTema ? "font-semibold" : "text-stone-700"}`}
        style={{ top: "63%", fontSize: "1.85cqw", ...(altinTema ? ALTIN_METIN_STIL : {}) }}
      >
        {kursSatiri}
      </p>

      <p
        className={`font-open-sans absolute ${altinTema ? "font-semibold" : "text-stone-600"}`}
        style={{ top: "79.4%", left: "16.6%", fontSize: "1.5cqw", ...(altinTema ? ALTIN_METIN_STIL : {}) }}
      >
        <span className="font-semibold">EARNED ON:</span> {tarih}
      </p>

      <p
        className={`font-open-sans absolute ${altinTema ? "font-semibold" : "text-stone-600"}`}
        style={{ top: "82.1%", left: "16.6%", fontSize: "1.5cqw", ...(altinTema ? ALTIN_METIN_STIL : {}) }}
      >
        <span className="font-semibold">ID:</span> {id}
      </p>
    </div>
  );
}
