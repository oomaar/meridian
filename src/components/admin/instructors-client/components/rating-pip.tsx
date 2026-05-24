import { StarIcon } from "lucide-react";

type RatingPipProps = { rating: number };

export function RatingPip({ rating }: RatingPipProps) {
  const color =
    rating >= 4.5
      ? "var(--m-success)"
      : rating >= 3.8
        ? "var(--m-text-2)"
        : "var(--m-warning)";

  return (
    <span className="m-rating" style={{ color }}>
      <StarIcon size={10} fill="currentColor" />
      {rating.toFixed(1)}
    </span>
  );
}
