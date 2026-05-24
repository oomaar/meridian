import type { Activity } from "@/fake-db";
import { relTime } from "../helpers/relTime";

type OverviewLiveActivityProps = {
  recentActivity: Activity[];
};

export function OverviewLiveActivity({
  recentActivity,
}: OverviewLiveActivityProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <h3 className="m-card__title">Live activity</h3>
        <span className="m-card__sub">real-time</span>
        <span className="m-live-badge">
          <span className="m-pulse-dot" />
          streaming
        </span>
      </div>
      <div className="m-card__body m-card__body--flush">
        <div className="m-feed-scroll">
          {recentActivity.slice(0, 7).map((item) => (
            <div key={item.id} className="m-feed-item">
              <span
                className={`m-feed-item__dot m-feed-item__dot--${item.dot}`}
              />
              <div
                className="m-feed-item__body"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
              <span className="m-feed-item__time">
                {relTime(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
