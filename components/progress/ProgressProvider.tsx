"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { AlistirmaDurumu, IlerlemeVerisi, KazanilanSertifika } from "@/lib/progress/types";
import {
  alistirmaDurumunuAyarla,
  dersiTamamlaninIsaretle,
  getServerSnapshot,
  getSnapshot,
  kullaniciAdiniKaydet,
  miniQuizSonucunuKaydet,
  mulakatSorusunuCozulduIsaretle,
  puanTazele,
  sertifikaGetirYaDaOlustur,
  subscribe,
  uniteSinaviSonucunuKaydet,
} from "@/lib/progress/store";

interface ProgressContextValue {
  ilerleme: IlerlemeVerisi;
  alistirmaDurumunuAyarla: (id: string, durum: AlistirmaDurumu) => void;
  dersiTamamlaninIsaretle: (dersSlug: string) => void;
  miniQuizSonucunuKaydet: (dersSlug: string, dogruSayisi: number, toplamSoru: number) => void;
  mulakatSorusunuCozulduIsaretle: (slug: string) => void;
  kullaniciAdiniKaydet: (ad: string) => void;
  sertifikaGetirYaDaOlustur: (anahtar: string) => Promise<KazanilanSertifika>;
  uniteSinaviSonucunuKaydet: (uniteId: number, dogruSayisi: number, toplamSoru: number) => void;
  puanTazele: () => void;
}

const ProgressContext = createContext<ProgressContextValue>({
  ilerleme: getServerSnapshot(),
  alistirmaDurumunuAyarla,
  dersiTamamlaninIsaretle,
  miniQuizSonucunuKaydet,
  mulakatSorusunuCozulduIsaretle,
  kullaniciAdiniKaydet,
  sertifikaGetirYaDaOlustur,
  uniteSinaviSonucunuKaydet,
  puanTazele,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const ilerleme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ProgressContext.Provider
      value={{
        ilerleme,
        alistirmaDurumunuAyarla,
        dersiTamamlaninIsaretle,
        miniQuizSonucunuKaydet,
        mulakatSorusunuCozulduIsaretle,
        kullaniciAdiniKaydet,
        sertifikaGetirYaDaOlustur,
        uniteSinaviSonucunuKaydet,
        puanTazele,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  return useContext(ProgressContext);
}
