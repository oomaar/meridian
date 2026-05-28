type AreaChartProps = {
  data: { l: string; v: number }[];
  height?: number;
  color?: string;
  gradientId?: string;
};

export function AreaChart({
  data,
  height = 160,
  color = "var(--m-accent)",
  gradientId = "m-area",
}: AreaChartProps) {
  if (data.length < 2) return null;

  const width = 600;
  const pad = { l: 32, r: 8, t: 12, b: 22 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.v));
  const dx = W / (data.length - 1);

  const pts = data.map((d, i) => {
    const x = pad.l + i * dx;
    const y = pad.t + H - (d.v / (max || 1)) * H;
    return [x, y] as [number, number];
  });

  const linePath = pts
    .map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1))
    .join(" ");
  const areaPath =
    linePath + ` L ${(pad.l + W).toFixed(1)} ${(pad.t + H).toFixed(1)} L ${pad.l} ${(pad.t + H).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="m-chart"
      preserveAspectRatio="none"
      style={{ height }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: 5 }, (_, i) => {
        const y = pad.t + (H * i) / 4;
        const val = Math.round(max - (max * i) / 4);
        return (
          <g key={i}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={y}
              y2={y}
              className="m-chart-axis-line"
              strokeDasharray={i === 4 ? "" : "2 4"}
            />
            <text
              x={pad.l - 6}
              y={y + 3}
              textAnchor="end"
              className="m-chart-axis-text"
            >
              {val}
            </text>
          </g>
        );
      })}

      {data.map((d, i) =>
        i % 2 === 0 ? (
          <text
            key={i}
            x={pad.l + i * dx}
            y={height - 6}
            textAnchor="middle"
            className="m-chart-axis-text"
          >
            {d.l}
          </text>
        ) : null,
      )}

      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="2.2"
          fill="var(--m-surface)"
          stroke={color}
          strokeWidth="1.4"
        />
      ))}
    </svg>
  );
}
