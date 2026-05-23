import { THRESHOLDS } from "../data/THRESHOLDS";

export function NotificationsThresholds() {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div>
          <div className="m-card__title">Alert thresholds</div>
          <div className="m-card__sub">Triggers that notify you</div>
        </div>
      </div>
      <div className="m-card__body">
        <table className="m-table">
          <thead>
            <tr>
              <th>Alert</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {THRESHOLDS.map((t) => (
              <tr key={t.label}>
                <td style={{ fontWeight: 500 }}>{t.label}</td>
                <td>
                  <span
                    className={`m-badge${t.tone !== "default" ? ` m-badge--${t.tone}` : ""}`}
                  >
                    {t.value}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
