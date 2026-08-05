import { ComingSoon } from "@/components/ui/ComingSoon";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default async function DersPage({
  params,
}: {
  params: Promise<{ dersSlug: string }>;
}) {
  const { dersSlug } = await params;
  return <ComingSoon title="Ders" description={`"${dersSlug}" dersi yakında burada.`} />;
}
