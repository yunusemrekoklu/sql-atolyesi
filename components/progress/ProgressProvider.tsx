"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { AlistirmaDurumu, IlerlemeVerisi } from "@/lib/progress/types";
import {
  alistirmaDurumunuAyarla,
  dersiTamamlaninIsaretle,
  getServerSnapshot,
  getSnapshot,
  miniQuizSonucunuKaydet,
  subscribe,
} from "@/lib/progress/store";

interface ProgressContextValue {
  ilerleme: IlerlemeVerisi;
  alistirmaDurumunuAyarla: (id: string, durum: AlistirmaDurumu) => void;
  dersiTamamlaninIsaretle: (dersSlug: string) => void;
  miniQuizSonucunuKaydet: (dersSlug: string, dogruSayisi: number, toplamSoru: number) => void;
}

const ProgressContext = createContext<ProgressContextValue>({
  ilerleme: getServerSnapshot(),
  alistirmaDurumunuAyarla,
  dersiTamamlaninIsaretle,
  miniQuizSonucunuKaydet,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const ilerleme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ProgressContext.Provider
      value={{ ilerleme, alistirmaDurumunuAyarla, dersiTamamlaninIsaretle, miniQuizSonucunuKaydet }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  return useContext(ProgressContext);
}
