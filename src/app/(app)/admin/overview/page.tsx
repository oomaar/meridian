export default function AdminOverviewPage() {
  return (
    <>
      <header className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Aldridge University · Operations</span>
          <h1 className="m-page__h">Overview</h1>
          <p className="m-page__sub">
            A real-time look at enrollment, instructor activity, and operational health for the
            Spring 2026 semester.
          </p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn m-btn--ghost m-btn--sm">Export</button>
          <button className="m-btn m-btn--primary m-btn--sm">New session</button>
        </div>
      </header>
      <div className="m-page__body">
        <p style={{ color: "var(--m-text-3)" }}>Overview content coming soon.</p>
      </div>
    </>
  );
}
