// 和了率テーブルのキー
export type WaitCount = 2 | 4 | 6 | 8;
export type RemainingTurns = 3 | 6 | 9 | 12;

// 放銃率カテゴリ
export type DealInCategory =
  | "genbutsu"      // 現物 0%
  | "suji19"        // 筋19牌 4%
  | "sujiChuhan"    // スジ中張牌 6%
  | "musuji19"      // 無筋19牌 9%
  | "musujiChuhan"  // 無筋中張牌 14.5%
  | "dangerous";    // ドラ・危険牌 18.5%

// 順位補正カテゴリ
export type RankSituation =
  | "east1to3"        // 東1-東3
  | "southTopBig"     // 南場トップ目(大差)
  | "southTopSmall"   // 南場トップ目(僅差)
  | "southSecond"     // 南場2着(僅差)
  | "southThird"      // 南場3着(逆転射程)
  | "orasLastChance"  // オーラス・ラス目(逆転可)
  | "orasNoChance";   // オーラス・ラス目(逆転不可)

// EV計算への入力
export interface EvInput {
  winRate: number;          // 和了率 (0-100)
  expectedScore: number;    // 期待打点
  opponentScore: number;    // 相手の打点（放銃点）
  dealInRate: number;       // 放銃率 (0-100)
  rankAdjustment: number;   // 順位補正値
}

// EV計算結果
export interface EvResult {
  pushEv: number;           // 押しEV
  foldEv: number;           // 降りEV (常に0)
  decision: "push" | "fold";
  winComponent: number;     // 和了率 × 期待打点
  loseComponent: number;    // 放銃率 × 放銃点
  rankComponent: number;    // 順位補正
}

// クイズシナリオ
export interface QuizScenario {
  id: number;
  title: string;
  description: string;
  situation: string;
  hand: string;
  tile: string;
  input: EvInput;
  answer: "push" | "fold" | "neutral";
  explanation: string;
}
