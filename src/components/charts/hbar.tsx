type HBarItem = { l: string; v: number; color?: string };

type HBarChartProps = {
  data: HBarItem[];
  format?: (v: number) => string;
};

export function HBarChart({ data, format = (v) => String(v) }: HBarChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="m-hbar">
      {data.map((d, i) => (
        <div key={i} className="m-hbar__row">
          <span className="m-hbar__label">{d.l}</span>
          <div className="m-hbar__track">
            <div
              className="m-hbar__fill"
              style={{
                width: `${((d.v / (max || 1)) * 100).toFixed(1)}%`,
                background: d.color ?? "var(--m-accent)",
              }}
            />
          </div>
          <span className="m-hbar__val">{format(d.v)}</span>
        </div>
      ))}
    </div>
  );
}
