"use client";

import { useRef } from "react";
import { SertifikaKarti } from "@/components/certificate/SertifikaKarti";
import { SertifikaIndirButonu } from "@/components/print/SertifikaIndirButonu";

/**
 * SertifikaKarti + PDF indirme butonu — /certificate/[id] gibi sunucu
 * bileşenlerinden kullanılabilmesi için ref'i burada, tek client
 * bileşeninde tutuyoruz.
 */
export function SertifikaKartiVeIndir({
  ad,
  kursSatiri,
  tarih,
  id,
  arkaPlan,
  altinTema,
  dosyaAdi,
}: {
  ad: string;
  kursSatiri: string;
  tarih: string;
  id: string;
  arkaPlan?: string;
  altinTema?: boolean;
  dosyaAdi: string;
}) {
  const sertifikaRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={sertifikaRef}>
        <SertifikaKarti ad={ad} kursSatiri={kursSatiri} tarih={tarih} id={id} arkaPlan={arkaPlan} altinTema={altinTema} />
      </div>
      <div className="print:hidden mt-5 flex justify-center">
        {/* Bu, /certificate/[id] gibi herkese açık doğrulama sayfalarında
            kullanılıyor — oturumsuz bir ziyaretçinin (ör. işveren) de
            indirebilmesi bu sayfanın amacı, bu yüzden auth şartı kapalı. */}
        <SertifikaIndirButonu hedefRef={sertifikaRef} dosyaAdi={dosyaAdi} authGerekli={false} />
      </div>
    </div>
  );
}
