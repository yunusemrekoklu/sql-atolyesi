import { ComingSoon } from "@/components/ui/ComingSoon";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default async function PratikSetPage({
  params,
}: {
  params: Promise<{ setSlug: string }>;
}) {
  const { setSlug } = await params;
  return <ComingSoon title="Pratik Seti" description={`"${setSlug}" seti yakında burada.`} />;
}
