export function ReportModalInsights() {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--m-text-3)",
          marginBottom: 12,
        }}
      >
        Insights
      </div>
      <div className="m-modal-insights">
        {[
          "Submissions peak in weeks 8–10, aligning with midterm exam windows across all departments.",
          "Late submission rate of 4.2% is below the institutional target of 6.0% — on track.",
          "ECON-405 accounts for 18% of ungraded backlog and is currently in SLA breach.",
          "Online sections show a 22% higher submission rate than in-person equivalents this term.",
        ].map((text, i) => (
          <div key={i} className="m-modal-insight">
            <div className="m-modal-insight__dot" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
