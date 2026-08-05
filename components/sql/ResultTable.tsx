import type { QueryExecResult } from "sql.js";

export function ResultTable({ sonuc }: { sonuc: QueryExecResult | null }) {
  if (!sonuc || sonuc.values.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Sonuç yok (0 satır).</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            {sonuc.columns.map((kolon, i) => (
              <th key={`${kolon}-${i}`} className="whitespace-nowrap px-3 py-2 font-medium text-zinc-600 dark:text-zinc-300">
                {kolon}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sonuc.values.map((satir, i) => (
            <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
              {satir.map((deger, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-2 font-mono text-zinc-800 dark:text-zinc-200">
                  {deger === null ? <span className="italic text-zinc-400">NULL</span> : String(deger)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
