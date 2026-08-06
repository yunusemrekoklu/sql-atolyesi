"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ExamQuestion } from "@/types/content";
import type { SinavModu, SinavOturumu, SinavSonucu } from "@/lib/exam/types";
import { gecmiseEkle, gecmisiOku, oturumuKaydet, oturumuOku, oturumuTemizle } from "@/lib/exam/store";
import { sinaviDegerlendir, sorulariGetir, soruHavuzuOlustur } from "@/lib/exam/pool";
import { MOD_BASLIKLARI } from "@/lib/exam/labels";
import { ReportCard } from "./ReportCard";

const TUM_UNITELER = [1, 2, 3, 4, 5];

function sureyiFormatla(saniye: number): string {
  const dk = Math.floor(saniye / 60);
  const sn = saniye % 60;
  return `${String(dk).padStart(2, "0")}:${String(sn).padStart(2, "0")}`;
}

function GecmisSinavlar() {
  const [gecmis, setGecmis] = useState<SinavSonucu[] | null>(null);

  useEffect(() => {
    setGecmis(gecmisiOku());
  }, []);

  if (!gecmis || gecmis.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Geçmiş Sınavlarım</h3>
      <ul className="space-y-1 text-sm">
        {gecmis.slice(0, 5).map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <span>
              {MOD_BASLIKLARI[s.mod]} · {new Date(s.tarih).toLocaleDateString("tr-TR")}
            </span>
            <span className="font-medium">
              {s.dogruSayisi} / {s.toplamSoru}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExamSimulation({ tumSorular }: { tumSorular: ExamQuestion[] }) {
  const [oturum, setOturum] = useState<SinavOturumu | null | undefined>(undefined);
  const [sonuc, setSonuc] = useState<SinavSonucu | null>(null);
  const [kalanSaniye, setKalanSaniye] = useState(0);
  const [aktifSoruIndex, setAktifSoruIndex] = useState(0);

  const [mod, setMod] = useState<SinavModu>("vize");
  const [soruSayisi, setSoruSayisi] = useState(20);
  const [dakika, setDakika] = useState(25);
  const [seciliUniteler, setSeciliUniteler] = useState<number[]>(TUM_UNITELER);

  const oturumRef = useRef(oturum);
  useEffect(() => {
    oturumRef.current = oturum;
  }, [oturum]);

  useEffect(() => {
    setOturum(oturumuOku());
  }, []);

  const sorular = useMemo(() => {
    if (!oturum) return [];
    return sorulariGetir(oturum.soruIdleri, tumSorular);
  }, [oturum, tumSorular]);

  function bitir(bitenOturum: SinavOturumu) {
    const cozulenSorular = sorulariGetir(bitenOturum.soruIdleri, tumSorular);
    const yeniSonuc = sinaviDegerlendir(bitenOturum.mod, cozulenSorular, bitenOturum.cevaplar);
    gecmiseEkle(yeniSonuc);
    oturumuTemizle();
    setSonuc(yeniSonuc);
    setOturum(null);
  }

  useEffect(() => {
    if (!oturum) return;

    function guncelle() {
      const guncelOturum = oturumRef.current;
      if (!guncelOturum) return;
      const kalan = Math.max(0, Math.round((guncelOturum.bitisZamani - Date.now()) / 1000));
      setKalanSaniye(kalan);
      if (kalan <= 0) bitir(guncelOturum);
    }

    guncelle();
    const zamanlayici = setInterval(guncelle, 1000);
    return () => clearInterval(zamanlayici);
    // Sadece bitisZamani değiştiğinde (yeni sınav başladığında) yeniden kurulur —
    // her cevaplamada zamanlayıcıyı sıfırlamamak için oturumRef kullanılıyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oturum?.bitisZamani]);

  function baslat() {
    const ayarlar = { mod, soruSayisi, dakika, uniteIdleri: mod === "ozel" ? seciliUniteler : undefined };
    const secilenSorular = soruHavuzuOlustur(tumSorular, ayarlar);
    const simdi = Date.now();
    const yeniOturum: SinavOturumu = {
      mod,
      soruIdleri: secilenSorular.map((s) => s.id),
      cevaplar: {},
      baslangicZamani: simdi,
      bitisZamani: simdi + dakika * 60_000,
    };
    oturumuKaydet(yeniOturum);
    setSonuc(null);
    setAktifSoruIndex(0);
    setOturum(yeniOturum);
  }

  function cevaplaSecenek(soruId: string, secenekIndex: number) {
    if (!oturum) return;
    const guncelOturum = { ...oturum, cevaplar: { ...oturum.cevaplar, [soruId]: secenekIndex } };
    oturumuKaydet(guncelOturum);
    setOturum(guncelOturum);
  }

  function uniteSecimiDegistir(uniteId: number) {
    setSeciliUniteler((onceki) =>
      onceki.includes(uniteId) ? onceki.filter((u) => u !== uniteId) : [...onceki, uniteId].sort(),
    );
  }

  if (oturum === undefined) {
    return <p className="text-sm text-zinc-400">Yükleniyor…</p>;
  }

  if (sonuc) {
    return (
      <ReportCard
        sonuc={sonuc}
        yanlisSorular={sorulariGetir(sonuc.yanlisSoruIdleri, tumSorular)}
        onYenidenBasla={() => setSonuc(null)}
      />
    );
  }

  if (!oturum) {
    const baslatilabilirMi = mod !== "ozel" || seciliUniteler.length > 0;
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["vize", "final", "ozel"] as SinavModu[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMod(m)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mod === m ? "border-zinc-900 dark:border-white" : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <p className="font-semibold">{MOD_BASLIKLARI[m]}</p>
            </button>
          ))}
        </div>

        {mod === "ozel" && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Hangi üniteler dahil olsun?</p>
            <div className="flex flex-wrap gap-2">
              {TUM_UNITELER.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => uniteSecimiDegistir(u)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    seciliUniteler.includes(u)
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  Ünite {u}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex flex-col gap-1 text-sm">
            Soru sayısı
            <input
              type="number"
              min={5}
              max={50}
              value={soruSayisi}
              onChange={(e) => setSoruSayisi(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Süre (dakika)
            <input
              type="number"
              min={5}
              max={120}
              value={dakika}
              onChange={(e) => setDakika(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={baslat}
          disabled={!baslatilabilirMi}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sınavı Başlat
        </button>

        <GecmisSinavlar />
      </div>
    );
  }

  const aktifSoru = sorular[aktifSoruIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {MOD_BASLIKLARI[oturum.mod]} · {sorular.length} soru
        </p>
        <p className={`font-mono text-lg font-semibold ${kalanSaniye < 60 ? "text-red-600 dark:text-red-400" : ""}`}>
          {sureyiFormatla(kalanSaniye)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sorular.map((s, i) => {
          const cevaplandi = oturum.cevaplar[s.id] !== undefined;
          const aktif = i === aktifSoruIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setAktifSoruIndex(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                aktif
                  ? "border-zinc-900 dark:border-white"
                  : cevaplandi
                    ? "border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950"
                    : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {aktifSoru && (
        <div className="space-y-3">
          <p className="font-medium">
            {aktifSoruIndex + 1}. {aktifSoru.soru}
          </p>
          <div className="space-y-1.5">
            {aktifSoru.secenekler.map((secenek, j) => {
              const secili = oturum.cevaplar[aktifSoru.id] === j;
              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => cevaplaSecenek(aktifSoru.id, j)}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    secili ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {secenek}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAktifSoruIndex((i) => Math.max(0, i - 1))}
            disabled={aktifSoruIndex === 0}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-800"
          >
            ← Önceki
          </button>
          <button
            type="button"
            onClick={() => setAktifSoruIndex((i) => Math.min(sorular.length - 1, i + 1))}
            disabled={aktifSoruIndex === sorular.length - 1}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-800"
          >
            Sonraki →
          </button>
        </div>
        <button
          type="button"
          onClick={() => bitir(oturum)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Sınavı Bitir
        </button>
      </div>
    </div>
  );
}
