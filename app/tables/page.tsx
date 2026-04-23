"use client";

import { useState } from "react";
import AcceptableDealInTable from "@/components/tables/AcceptableDealInTable";
import WinRateTable from "@/components/tables/WinRateTable";
import ScoreTable from "@/components/tables/ScoreTable";
import DealInCategoryTable from "@/components/tables/DealInCategoryTable";
import RankAdjustmentTable from "@/components/tables/RankAdjustmentTable";

const TABS = [
  { key: "acceptable", label: "許容放銃率" },
  { key: "winrate", label: "和了率" },
  { key: "score", label: "打点" },
  { key: "dealin", label: "放銃率" },
  { key: "rank", label: "順位補正" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function TablesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("acceptable");

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-zinc-900">参照テーブル</h1>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "acceptable" && <AcceptableDealInTable />}
      {activeTab === "winrate" && <WinRateTable />}
      {activeTab === "score" && <ScoreTable />}
      {activeTab === "dealin" && <DealInCategoryTable />}
      {activeTab === "rank" && <RankAdjustmentTable />}
    </div>
  );
}
