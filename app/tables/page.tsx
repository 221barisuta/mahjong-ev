"use client";

import { useState } from "react";
import AcceptableDealInTable from "@/components/tables/AcceptableDealInTable";
import WinRateTable from "@/components/tables/WinRateTable";
import ScoreTable from "@/components/tables/ScoreTable";
import DealInCategoryTable from "@/components/tables/DealInCategoryTable";
import RankAdjustmentTable from "@/components/tables/RankAdjustmentTable";

const TABS = [
  { key: "acceptable", label: "押し許容放銃率" },
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
      <div>
        <h1
          className="text-xl md:text-[22px] font-bold"
          style={{ letterSpacing: "-0.02em" }}
        >
          参照テーブル
        </h1>
        <p
          className="text-xs md:text-sm mt-1"
          style={{ color: "var(--c-text-dim)" }}
        >
          判断の物差し・卓上で素早く確認
        </p>
      </div>

      <div
        className="flex gap-1 p-1 overflow-x-auto"
        style={{
          background: "var(--c-card)",
          border: "1px solid var(--c-border)",
          borderRadius: 10,
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="px-3 py-2 text-xs md:text-[13px] font-semibold whitespace-nowrap transition-colors rounded-md"
              style={{
                background: active ? "var(--c-ink)" : "transparent",
                color: active ? "#fff" : "var(--c-text-dim)",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "acceptable" && <AcceptableDealInTable />}
      {activeTab === "winrate" && <WinRateTable />}
      {activeTab === "score" && <ScoreTable />}
      {activeTab === "dealin" && <DealInCategoryTable />}
      {activeTab === "rank" && <RankAdjustmentTable />}
    </div>
  );
}
