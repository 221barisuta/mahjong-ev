import { RANK_ADJUSTMENT_TABLE } from "@/lib/constants";

export default function RankAdjustmentTable() {
  return (
    <div>
      <h3 className="font-bold text-zinc-800 mb-2">順位補正表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">場況</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">補正</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-left">説明</th>
            </tr>
          </thead>
          <tbody>
            {RANK_ADJUSTMENT_TABLE.map((row) => (
              <tr key={row.key}>
                <td className="border border-zinc-300 px-2 py-1.5 font-medium">{row.label}</td>
                <td
                  className={`border border-zinc-300 px-2 py-1.5 text-center font-mono font-bold ${
                    row.adjustment > 0
                      ? "text-emerald-700"
                      : row.adjustment < 0
                      ? "text-red-700"
                      : ""
                  }`}
                >
                  {row.adjustment > 0 ? "+" : ""}
                  {row.adjustment.toLocaleString()}
                </td>
                <td className="border border-zinc-300 px-2 py-1.5 text-zinc-600">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
