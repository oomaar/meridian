export function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--m-line)",
        padding: "32px 40px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        gap: 16,
        color: "var(--m-text-3)",
        fontSize: 12,
      }}
    >
      <div
        className="m-brand-mark"
        style={{ width: 22, height: 22, fontSize: 13 }}
      >
        M
      </div>
      <span>
        Meridian Operations Inc. · Princeton, NJ · v4.2.18 · build 0c9a142
      </span>
      <span className="m-spacer" />
      <a style={{ cursor: "pointer" }}>Privacy</a>
      <a style={{ cursor: "pointer" }}>Terms</a>
      <a style={{ cursor: "pointer" }}>Status</a>
      <a style={{ cursor: "pointer" }}>Security</a>
    </footer>
  );
}
