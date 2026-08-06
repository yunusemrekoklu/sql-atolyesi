import type { InterviewQuestion } from "@/types/content";
import { begeniAlmamisGonderiler } from "./begeni-almamis-gonderiler";
import { teslimEdilmemisSiparisler } from "./teslim-edilmemis-siparisler";
import { mukerrerEpostaAdresleri } from "./mukerrer-eposta-adresleri";
import { yorumAlmamisRestoranlar } from "./yorum-almamis-restoranlar";
import { departmanOrtalamasiUstuMaas } from "./departman-ortalamasi-ustu-maas";
import { aylikAktifKullanici } from "./aylik-aktif-kullanici";
import { kategoriSampiyonuUrun } from "./kategori-sampiyonu-urun";
import { yuzdeHesabiCastTuzagi } from "./yuzde-hesabi-cast-tuzagi";
import { ikinciEnYuksekMaas } from "./ikinci-en-yuksek-maas";
import { ucGunlukYuruyenOrtalama } from "./uc-gunluk-yuruyen-ortalama";
import { ayBazindaGeriDonenKullanici } from "./ay-bazinda-geri-donen-kullanici";
import { ustYoneticiRaporu } from "./ust-yonetici-raporu";
import { ardisikGunHarcamaSerisi } from "./ardisik-gun-harcama-serisi";

export const TUM_MULAKAT_SORULARI: InterviewQuestion[] = [
  begeniAlmamisGonderiler,
  teslimEdilmemisSiparisler,
  mukerrerEpostaAdresleri,
  yorumAlmamisRestoranlar,
  departmanOrtalamasiUstuMaas,
  aylikAktifKullanici,
  kategoriSampiyonuUrun,
  yuzdeHesabiCastTuzagi,
  ikinciEnYuksekMaas,
  ucGunlukYuruyenOrtalama,
  ayBazindaGeriDonenKullanici,
  ustYoneticiRaporu,
  ardisikGunHarcamaSerisi,
];

export function getMulakatSorusuBySlug(slug: string): InterviewQuestion | undefined {
  return TUM_MULAKAT_SORULARI.find((s) => s.slug === slug);
}
