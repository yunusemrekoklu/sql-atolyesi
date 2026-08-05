import { turkceHataMesaji } from "@/lib/sql/errors-tr";

export function QueryError({ mesaj }: { mesaj: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      <p className="font-medium">{turkceHataMesaji(mesaj)}</p>
      <p className="mt-1 font-mono text-xs text-red-600/80 dark:text-red-400/80">{mesaj}</p>
    </div>
  );
}
