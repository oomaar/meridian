export function ReportModalBreakdown() {
  return (
    <div className="mb-2">
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--m-text-3)",
          marginBottom: 14,
        }}
      >
        Breakdown by discipline
      </div>
      {[
        { label: "STEM", pct: 68, color: "var(--m-info)" },
        { label: "Humanities", pct: 19, color: "var(--m-accent)" },
        {
          label: "Social Sciences",
          pct: 13,
          color: "var(--m-warning)",
        },
      ].map((row) => (
        <div key={row.label} className="m-modal-breakdown-row">
          <div className="m-modal-breakdown-row__label">{row.label}</div>
          <div className="m-modal-breakdown-row__track">
            <div
              className="m-modal-breakdown-row__fill"
              style={{ width: `${row.pct}%`, background: row.color }}
            />
          </div>
          <div className="m-modal-breakdown-row__pct">{row.pct}%</div>
        </div>
      ))}
    </div>
  );
}
