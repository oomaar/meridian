export function ProgressBar({
  value,
  lg,
}: {
  value: number;
  lg?: boolean;
}) {
  const pct = `${Math.min(100, Math.max(0, Math.round(value * 100)))}%`;
  return (
    <div className={`m-progress${lg ? " m-progress--lg" : ""}`}>
      <div
        className="m-progress__bar"
        style={{ "--m-bar": pct } as React.CSSProperties}
      />
    </div>
  );
}
