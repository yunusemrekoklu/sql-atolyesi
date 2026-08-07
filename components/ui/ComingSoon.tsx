export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-stone-600 dark:text-stone-300">{description}</p>
      <p className="text-sm text-stone-400 dark:text-stone-500">Bu bölüm yapım aşamasında.</p>
    </div>
  );
}
