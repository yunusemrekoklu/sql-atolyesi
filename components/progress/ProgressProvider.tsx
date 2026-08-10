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
  sertifikaGetirYaDaOlustur,
  subscribe,
} from "@/lib/progress/store";

interface ProgressContextValue {
  ilerleme: IlerlemeVerisi;
  alistirmaDurumunuAyarla: (id: string, durum: AlistirmaDurumu) => void;
  dersiTamamlaninIsaretle: (dersSlug: string) => void;
  miniQuizSonucunuKaydet: (dersSlug: string, dogruSayisi: number, toplamSoru: number) => void;
  mulakatSorusunuCozulduIsaretle: (slug: string) => void;
  kullaniciAdiniKaydet: (ad: string) => void;
  sertifikaGetirYaDaOlustur: (anahtar: string) => KazanilanSertifika;
}

const ProgressContext = createContext<ProgressContextValue>({
  ilerleme: getServerSnapshot(),
  alistirmaDurumunuAyarla,
  dersiTamamlaninIsaretle,
  miniQuizSonucunuKaydet,
  mulakatSorusunuCozulduIsaretle,
  kullaniciAdiniKaydet,
  sertifikaGetirYaDaOlustur,
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
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  return useContext(ProgressContext);
}
