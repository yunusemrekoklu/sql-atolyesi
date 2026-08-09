import type { QueryExecResult } from "sql.js";

export function ResultTable({ sonuc }: { sonuc: QueryExecResult | null }) {
  if (!sonuc || sonuc.values.length === 0) {
    return <p className="text-sm text-stone-500 dark:text-stone-400">Sonuç yok (0 satır).</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
      <div className="max-h-96 overflow-auto print:max-h-none print:overflow-visible">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {sonuc.columns.map((kolon, i) => (
                <th
                  key={`${kolon}-${i}`}
                  className="sticky top-0 whitespace-nowrap border-b border-stone-200 bg-stone-100 px-3 py-2 font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-200"
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
                className={i % 2 === 0 ? "bg-white dark:bg-stone-950" : "bg-stone-50 dark:bg-stone-900"}
              >
                {satir.map((deger, j) => (
                  <td key={j} className="whitespace-nowrap px-3 py-2 font-mono text-stone-800 dark:text-stone-200">
                    {deger === null ? <span className="italic text-stone-400">NULL</span> : String(deger)}
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
