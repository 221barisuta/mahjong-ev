import { ACCEPTABLE_DEAL_IN_TABLE } from "@/lib/constants";

export default function AcceptableDealInTable() {
  return (
    <div className="ring-2 ring-amber-400 rounded-xl p-4">
      <h3 className="font-bold text-zinc-800 mb-1">押し許容放銃率表</h3>
      <p className="text-xs text-amber-700 mb-2 font-medium">
        最重要テーブル: 自分の手の強さに対して何%まで放銃率を許容できるか
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">自分の状態</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">押し許容放銃率</th>
            </tr>
          </thead>
          <tbody>
            {ACCEPTABLE_DEAL_IN_TABLE.map((row) => (
              <tr key={row.label}>
                <td className="border border-zinc-300 px-2 py-1.5 font-medium">{row.label}</td>
                <td className="border border-zinc-300 px-2 py-1.5 text-center font-mono font-bold">
                  {row.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
