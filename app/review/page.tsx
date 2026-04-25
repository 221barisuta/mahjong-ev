import ReviewContainer from "@/components/review/ReviewContainer";

export default function ReviewPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-900">牌譜検討</h1>
        <p className="text-xs text-zinc-500">
          打牌ごとの受け入れ枚数・最善打・手役サジェスト
        </p>
      </div>
      <ReviewContainer />
    </div>
  );
}
