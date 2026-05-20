type SparkProps = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
};

export function Spark({
  data,
  width = 88,
  height = 28,
  color = "var(--m-accent)",
}: SparkProps) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const dx = width / (data.length - 1);
  const pts = data
    .map(
      (v, i) =>
        `${(i * dx).toFixed(2)},${(height - ((v - min) / (max - min || 1)) * height).toFixed(2)}`,
    )
    .join(" ");
  const lastPt = pts.split(" ").at(-1)!.split(",").map(Number);

  return (
    <svg width={width} height={height}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} />
    </svg>
  );
}
