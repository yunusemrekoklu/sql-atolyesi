import type { QueryExecResult } from "sql.js";

export function ResultTable({ sonuc }: { sonuc: QueryExecResult | null }) {
  if (!sonuc || sonuc.values.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Sonuç yok (0 satır).</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="max-h-96 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {sonuc.columns.map((kolon, i) => (
                <th
                  key={`${kolon}-${i}`}
                  className="sticky top-0 whitespace-nowrap border-b border-zinc-200 bg-zinc-100 px-3 py-2 font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {kolon}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sonuc.values.map((satir, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white dark:bg-zinc-950" : "bg-zinc-50 dark:bg-zinc-900"}
              >
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
    </div>
  );
}
