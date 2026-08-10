import type { Metadata } from "next";
import { Alex_Brush, Geist, Geist_Mono, Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OkumaIlerlemeCubugu } from "@/components/layout/OkumaIlerlemeCubugu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const scriptFont = Alex_Brush({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "SQLCODEX — Tarayıcında Türkçe SQL Öğren",
    template: "%s — SQLCODEX",
  },
  description:
    "Kurulum yok. Tarayıcında gerçek SQL çalıştır. Üniversite sınavlarına hazırlan, mülakat sorularını çöz — tamamen Türkçe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${scriptFont.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col select-none" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ProgressProvider>
              <OkumaIlerlemeCubugu />
              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </ProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
