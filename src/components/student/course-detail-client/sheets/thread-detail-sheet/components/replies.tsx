import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import type { Thread } from "@/fake-db/dashboards";

type Props = { allReplies: Thread[] };

export function Replies({ allReplies }: Props) {
  return (
    <div className="m-thread-replies">
      <div className="m-thread-replies__count">{allReplies.length} replies</div>
      {allReplies.map((r, i) => (
        <div key={i} className="m-thread-item">
          <Avatar name={r.who} />
          <div>
            <div>
              <span className="m-thread-item__who">{r.who}</span>
              {" · "}
              <span className="m-thread-item__when">{r.time}</span>
            </div>
            <div className="m-thread-item__body">{r.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
