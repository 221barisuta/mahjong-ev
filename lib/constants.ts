import type {
  WaitCount,
  RemainingTurns,
  DealInCategory,
  RankSituation,
  QuizScenario,
} from "./types";

// ========================================
// テーブル1: 和了率表 (待ち枚数 × 残り巡目)
// ========================================
export const WIN_RATE_TABLE: Record<WaitCount, Record<RemainingTurns, number>> = {
  8: { 12: 55, 9: 45, 6: 33, 3: 17 },
  6: { 12: 45, 9: 35, 6: 25, 3: 13 },
  4: { 12: 32, 9: 25, 6: 17, 3: 9 },
  2: { 12: 17, 9: 13, 6: 9, 3: 4.5 },
};

export const WIN_RATE_LABELS: Record<WaitCount, string> = {
  8: "8枚(両面)",
  6: "6枚(両面/ノベタン)",
  4: "4枚(カンチャン/ペンチャン)",
  2: "2枚(単騎/シャボ片方)",
};

export const REMAINING_TURNS_LABELS: Record<RemainingTurns, string> = {
  12: "残り12巡(序盤)",
  9: "残り9巡(中盤)",
  6: "残り6巡(中終盤)",
  3: "残り3巡(終盤)",
};

// 1シャンテン時の和了率（残り10巡目安）
export const SHANTEN_WIN_RATES = [
  { label: "受入20枚の良形1シャンテン", rate: 28 },
  { label: "受入12枚の1シャンテン", rate: 18 },
  { label: "受入8枚の悪形1シャンテン", rate: 12 },
  { label: "2シャンテン", rate: 5 },
];

// ========================================
// テーブル2: 打点素点表 (翻数→点数)
// ========================================
export const SCORE_TABLE = [
  { han: 1, label: "1翻", child: 1000, parent: 1500 },
  { han: 2, label: "2翻", child: 2000, parent: 2900 },
  { han: 3, label: "3翻", child: 3900, parent: 5800 },
  { han: 4, label: "4翻(満貫)", child: 8000, parent: 12000 },
  { han: 6, label: "6翻(跳満)", child: 12000, parent: 18000 },
  { han: 8, label: "8翻(倍満)", child: 16000, parent: 24000 },
];

export const SCORE_PRESETS = [1000, 2000, 3900, 5200, 7500, 8000, 12000];
export const OPPONENT_SCORE_PRESETS = [3900, 5200, 7000, 8000, 12000];

// ========================================
// テーブル3: 放銃率カテゴリ表
// ========================================
export const DEAL_IN_CATEGORIES: {
  key: DealInCategory;
  label: string;
  rate: number;
  range: string;
}[] = [
  { key: "genbutsu", label: "現物", rate: 0, range: "0%" },
  { key: "suji19", label: "筋の1-9牌", rate: 4, range: "3-5%" },
  { key: "sujiChuhan", label: "スジ中張牌", rate: 6, range: "5-7%" },
  { key: "musuji19", label: "無筋19牌", rate: 9, range: "8-10%" },
  { key: "musujiChuhan", label: "無筋中張牌", rate: 14.5, range: "12-17%" },
  { key: "dangerous", label: "ドラ・危険牌", rate: 18.5, range: "17-20%" },
];

// ========================================
// テーブル4: 押し許容放銃率表 ※最重要
// ========================================
export const ACCEPTABLE_DEAL_IN_TABLE = [
  { label: "倍満テンパイ", rate: "25%超", rateNum: 25 },
  { label: "跳満テンパイ", rate: "約20%", rateNum: 20 },
  { label: "満貫テンパイ", rate: "約12-15%", rateNum: 13.5 },
  { label: "5200-3900テンパイ", rate: "約8-10%", rateNum: 9 },
  { label: "2000テンパイ", rate: "約5-7%", rateNum: 6 },
  { label: "良形1シャンテン(満貫期待)", rate: "約8-10%", rateNum: 9 },
  { label: "良形1シャンテン(平均打点)", rate: "約5%", rateNum: 5 },
  { label: "悪形1シャンテン", rate: "3%以下", rateNum: 3 },
];

// ========================================
// テーブル5: 順位補正表
// ========================================
export const RANK_ADJUSTMENT_TABLE: {
  key: RankSituation;
  label: string;
  adjustment: number;
  description: string;
}[] = [
  { key: "east1to3", label: "東1-東3", adjustment: 0, description: "素点EVそのまま" },
  { key: "southTopBig", label: "南場トップ目(大差)", adjustment: -4000, description: "順位変わらず、放銃で2着落ちリスク" },
  { key: "southTopSmall", label: "南場トップ目(僅差)", adjustment: -1500, description: "まだ追われる可能性、守備寄り" },
  { key: "southSecond", label: "南場2着(僅差)", adjustment: 0, description: "素点がそのまま順位に" },
  { key: "southThird", label: "南場3着(逆転射程)", adjustment: 3000, description: "打点のある手は積極的に" },
  { key: "orasLastChance", label: "オーラス・ラス目(逆転可)", adjustment: 6000, description: "順位逆転条件を満たす打点なら超積極" },
  { key: "orasNoChance", label: "オーラス・ラス目(逆転不可)", adjustment: -3000, description: "放銃で点差広げず終わらせる" },
];

// ========================================
// クイズデータ
// ========================================
export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    title: "典型的な押し判断",
    description: "南2局6巡目、2着、親リーチ1巡目",
    situation: "南2局6巡目・2着・親リーチ1巡目",
    hand: "両面8枚待ちテンパイ、ダマ満貫確定(期待7500)",
    tile: "無筋中張牌",
    handTiles: ["2m","3m","4m","5p","6p","7p","2s","3s","4s","7p","7p","8m","8m"],
    cutTile: "5s",
    input: {
      winRate: 50,
      expectedScore: 7500,
      opponentScore: 7000,
      dealInRate: 13,
      rankAdjustment: 0,
    },
    answer: "push",
    explanation:
      "押しEV = (0.50 × 7500) - (0.13 × 7000) = 3750 - 910 = +2840。大幅にプラスなので押し。満貫テンパイなら許容放銃率は12-15%であり、13%はギリギリ許容範囲。",
  },
  {
    id: 2,
    title: "典型的な降り判断",
    description: "東1局10巡目、全員素点ゼロ、先制リーチ受け",
    situation: "東1局10巡目・先制リーチ受け",
    hand: "悪形1シャンテン(受入6枚、打点3900)",
    tile: "無筋中張牌",
    handTiles: ["1m","9m","3p","4p","5p","7s","8s","9s","E","E","W","C","C"],
    cutTile: "5m",
    input: {
      winRate: 10,
      expectedScore: 3900,
      opponentScore: 5200,
      dealInRate: 13,
      rankAdjustment: 0,
    },
    answer: "fold",
    explanation:
      "押しEV = (0.10 × 3900) - (0.13 × 5200) = 390 - 676 = -286。マイナスなので降り。悪形1シャンテンの許容放銃率は3%以下であり、13%は明らかにオーバー。",
  },
  {
    id: 3,
    title: "オーラスのラス目（順位補正）",
    description: "オーラス、4着で3着と満貫条件",
    situation: "オーラス・4着・3着と満貫条件",
    hand: "テンパイ、役ありダマ3900（満貫ではない）、親リーチ受け",
    tile: "無筋中張牌",
    handTiles: ["3m","4m","5m","2p","3p","4p","6p","7p","8p","2s","3s","4s","7s"],
    cutTile: "5s",
    input: {
      winRate: 30,
      expectedScore: 3900,
      opponentScore: 7000,
      dealInRate: 13,
      rankAdjustment: 0,
    },
    answer: "neutral",
    explanation:
      "押しEV = (0.30 × 3900) - (0.13 × 7000) = 1170 - 910 = +260。素点的には微プラスだが3900では順位変わらない。打点を伸ばす（満貫形に変える）チャンスを探す方がEV高い。",
  },
];
