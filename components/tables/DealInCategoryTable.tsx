import { DEAL_IN_CATEGORIES } from "@/lib/constants";

export default function DealInCategoryTable() {
  return (
    <div>
      <h3 className="font-bold text-zinc-800 mb-2">放銃率カテゴリ表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">牌のカテゴリ</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">放銃率</th>
            </tr>
          </thead>
          <tbody>
            {DEAL_IN_CATEGORIES.map((cat) => (
              <tr key={cat.key}>
                <td className="border border-zinc-300 px-2 py-1.5 font-medium">{cat.label}</td>
                <td className="border border-zinc-300 px-2 py-1.5 text-center font-mono">
                  {cat.range}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
