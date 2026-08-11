"use client";

import { useState } from "react";
import type { RefObject } from "react";

// Yakalanan görüntünün hedef genişliği (px) — cihazdan/ekran boyutundan
// bağımsız, tutarlı bir baskı kalitesi için (297mm'de ~240 DPI'a denk gelir).
const HEDEF_PIKSEL_GENISLIK = 2800;

/**
 * Sertifikayı tarayıcının Yazdır/PDF kaydet iletişim kutusuna hiç
 * uğratmadan doğrudan A4 yatay, kenardan kenara bir PDF olarak indirir.
 * Ctrl+P akışı, kullanıcının "Üstbilgi/altbilgi" ve "Kenar Boşlukları"
 * ayarlarına bağımlı olduğu için (bkz. YazdirButonu) herkeste otomatik
 * aynı sonucu vermiyor — bu buton o bağımlılığı tamamen ortadan kaldırır.
 */
export function SertifikaIndirButonu({
  hedefRef,
  dosyaAdi,
}: {
  hedefRef: RefObject<HTMLDivElement | null>;
  dosyaAdi: string;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  async function indir() {
    const hedef = hedefRef.current;
    if (!hedef) return;

    setYukleniyor(true);
    setHata("");

    try {
      const [{ toCanvas }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const olcek = HEDEF_PIKSEL_GENISLIK / hedef.offsetWidth;
      const canvas = await toCanvas(hedef, {
        pixelRatio: olcek,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const genislik = pdf.internal.pageSize.getWidth();
      const yukseklik = pdf.internal.pageSize.getHeight();
      // PNG (kayıpsız) sertifikanın dokulu arka planında dosyayı ~16MB'a
      // şişiriyordu — JPEG %92 kalite, gözle görülür kayıp olmadan dosyayı
      // makul boyuta indiriyor.
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, genislik, yukseklik);
      pdf.save(dosyaAdi);
    } catch (err) {
      console.error("Sertifika PDF'i oluşturulamadı:", err);
      setHata("PDF oluşturulamadı, tekrar dene.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={indir}
        disabled={yukleniyor}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {yukleniyor ? "Hazırlanıyor…" : "PDF olarak indir"}
      </button>
      {hata && <p className="text-sm text-red-600 dark:text-red-400">{hata}</p>}
    </div>
  );
}
