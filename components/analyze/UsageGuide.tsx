"use client";

import { useState } from "react";

export default function UsageGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--c-text-dim)" }}
        >
          使い方ガイド
        </span>
        <span
          className="text-sm"
          style={{ color: "var(--c-text-faint)" }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-xs text-zinc-600 space-y-3">
          <section>
            <h3 className="font-bold text-zinc-800 mb-1">
              Step 1: 天鳳の牌譜URLを取得
            </h3>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>天鳳でゲーム終了後、牌譜一覧から対象の対局を選択</li>
              <li>
                ブラウザのアドレスバーからURLをコピー
              </li>
              <li>
                URLの形式:{" "}
                <code className="bg-zinc-100 px-1 rounded text-[10px]">
                  https://tenhou.net/0/?log=XXXXX&tw=N
                </code>
              </li>
            </ol>
            <p className="mt-1 text-zinc-500">
              <code className="bg-zinc-100 px-1 rounded">tw=N</code>{" "}
              は自分の席番号（0-3）。URLに含まれていない場合は tw=0 として分析します。
            </p>
          </section>

          <section>
            <h3 className="font-bold text-zinc-800 mb-1">
              Step 2: 分析を実行
            </h3>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>URLを入力欄に貼り付け</li>
              <li>「分析する」ボタンを押す（またはEnter）</li>
              <li>全局の一覧が表示される</li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-zinc-800 mb-1">
              Step 3: 押し引き判断を確認
            </h3>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                <span className="bg-amber-100 text-amber-800 px-1 rounded">
                  N判断
                </span>{" "}
                バッジがついた局にリーチ対応の判断あり
              </li>
              <li>各判断に打牌の危険度と押し/降りEVが自動表示</li>
              <li>
                <span className="font-medium text-zinc-800">
                  「詳細・調整」
                </span>
                を開くと手牌とEV入力値の調整が可能
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-zinc-800 mb-1">
              Step 4: 値を調整して正確なEVを算出
            </h3>
            <p>以下の値は自動入力されます:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>
                <span className="font-medium">放銃率</span> —
                牌の種類から自動判定（現物0%/筋4%/無筋中張14.5%等）
              </li>
              <li>
                <span className="font-medium">相手打点</span> —
                親リーチ7,000 / 子リーチ5,200
              </li>
              <li>
                <span className="font-medium">順位補正</span> —
                局面と持ち点から自動推定
              </li>
            </ul>
            <p className="mt-1">以下は手牌を見て手動で調整してください:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>
                <span className="font-medium">和了率</span> —
                テンパイなら待ち枚数×残り巡目で参照表を確認。1シャンテンは12-28%目安
              </li>
              <li>
                <span className="font-medium">期待打点</span> —
                手牌から翻数を数えて打点素点表で確認
              </li>
            </ul>
          </section>

          <section className="bg-zinc-50 rounded-lg p-2.5">
            <h3 className="font-bold text-zinc-800 mb-1">
              EV判断の読み方
            </h3>
            <ul className="space-y-0.5">
              <li>
                <span className="inline-block w-12 text-center bg-emerald-500 text-white text-[10px] px-1 rounded-full">
                  押し
                </span>{" "}
                押しEV &gt; 0 → 押すべき場面
              </li>
              <li>
                <span className="inline-block w-12 text-center bg-red-500 text-white text-[10px] px-1 rounded-full">
                  降り
                </span>{" "}
                押しEV &lt; 0 → 降りるべき場面
              </li>
              <li className="text-zinc-500">
                ※ EV値はあくまで推定。実戦では±500程度は誤差と考えてOK
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
