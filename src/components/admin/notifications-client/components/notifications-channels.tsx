import { CHANNELS } from "../data/CHANNELS";

export function NotificationsChannels() {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div>
          <div className="m-card__title">Channels</div>
          <div className="m-card__sub">Delivery preferences</div>
        </div>
      </div>
      <div className="m-card__body">
        {CHANNELS.map((ch) => (
          <div key={ch.label} className="m-pref-row">
            <ch.icon
              size={15}
              style={{ color: "var(--m-text-3)", flexShrink: 0 }}
            />
            <div className="m-pref-row__info">
              <div className="m-pref-row__label">{ch.label}</div>
              <div className="m-pref-row__sub">{ch.sub}</div>
            </div>
            <span className="m-badge m-badge--success">On</span>
          </div>
        ))}
      </div>
    </div>
  );
}
