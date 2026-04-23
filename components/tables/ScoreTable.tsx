import { SCORE_TABLE } from "@/lib/constants";

export default function ScoreTable() {
  return (
    <div>
      <h3 className="font-bold text-zinc-800 mb-2">打点素点表</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100">
              <th className="border border-zinc-300 px-2 py-1.5 text-left">翻数</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">子ロン</th>
              <th className="border border-zinc-300 px-2 py-1.5 text-center">親ロン</th>
            </tr>
          </thead>
          <tbody>
            {SCORE_TABLE.map((row) => (
              <tr key={row.han}>
                <td className="border border-zinc-300 px-2 py-1.5 font-medium">{row.label}</td>
                <td className="border border-zinc-300 px-2 py-1.5 text-center font-mono">
                  {row.child.toLocaleString()}
                </td>
                <td className="border border-zinc-300 px-2 py-1.5 text-center font-mono">
                  {row.parent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        ※ リーチ補正: 一発約10%, 裏ドラ約30%で1枚以上, ツモ約40-47% → 打点1.3-1.5倍
      </p>
    </div>
  );
}
