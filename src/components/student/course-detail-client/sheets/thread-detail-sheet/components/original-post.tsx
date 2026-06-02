import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import type { Thread } from "@/fake-db/dashboards";

type OriginalPostProps = { thread: Thread };

export function OriginalPost({ thread }: OriginalPostProps) {
  return (
    <div className="m-thread-op">
      <div className="m-thread-item">
        <Avatar name={thread.who} />
        <div>
          <div>
            <span className="m-thread-item__who">{thread.who}</span>
            {" · "}
            <span className="m-thread-item__when">{thread.time}</span>
          </div>
          <div className="m-thread-item__body">{thread.body}</div>
        </div>
      </div>
    </div>
  );
}
