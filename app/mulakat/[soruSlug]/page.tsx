import { ComingSoon } from "@/components/ui/ComingSoon";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default async function MulakatSoruPage({
  params,
}: {
  params: Promise<{ soruSlug: string }>;
}) {
  const { soruSlug } = await params;
  return <ComingSoon title="Mülakat Sorusu" description={`"${soruSlug}" sorusu yakında burada.`} />;
}
