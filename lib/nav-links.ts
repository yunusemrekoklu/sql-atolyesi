// Header'daki masaüstü nav'ı ve mobil tam ekran menüsü aynı listeyi ve
// aynı "aktif sayfa" mantığını kullanır — burada tek kaynaktan yönetiliyor.
export type NavLink = { href: string; label: string };

export const NAV_LINKS: NavLink[] = [
  { href: "/ogren", label: "Öğren" },
  { href: "/pratik", label: "Pratik" },
  { href: "/sinav", label: "Test Sınavı" },
  { href: "/mulakat", label: "Mülakat" },
  { href: "/dedektif", label: "Dedektif" },
  { href: "/fonksiyonlar", label: "Fonksiyonlar" },
  { href: "/playground", label: "Playground" },
  { href: "/lider-tablosu", label: "Lider Tablosu" },
  { href: "/hakkinda", label: "Hakkında" },
];

export function navLinkAktifMi(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
