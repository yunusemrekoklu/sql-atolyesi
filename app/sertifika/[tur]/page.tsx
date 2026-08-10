import type { Metadata } from "next";
import { SertifikaSayfasi } from "@/components/certificate/SertifikaSayfasi";

const TUM_TURLER = ["unite-1", "unite-2", "unite-3", "unite-4", "unite-5", "pratik", "mulakat", "tumu"] as const;

export function generateStaticParams() {
  return TUM_TURLER.map((tur) => ({ tur }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tur: string }>;
}): Promise<Metadata> {
  const { tur } = await params;
  return { title: `Sertifika — ${tur}` };
}

export default async function SertifikaPage({ params }: { params: Promise<{ tur: string }> }) {
  const { tur } = await params;
  return <SertifikaSayfasi tur={tur} />;
}
