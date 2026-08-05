import { ComingSoon } from "@/components/ui/ComingSoon";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default async function SinavKonuPage({
  params,
}: {
  params: Promise<{ konuSlug: string }>;
}) {
  const { konuSlug } = await params;
  return <ComingSoon title="Ünite Quizi" description={`"${konuSlug}" quizi yakında burada.`} />;
}
