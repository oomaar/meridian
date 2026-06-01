import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import type { Thread } from "@/fake-db/dashboards";
import { LayersIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type CourseDetailClientDiscussionProps = {
  threads: Thread[];
  setAllThreadsOpen: Dispatch<SetStateAction<boolean>>;
  setThreadDetailOpen: Dispatch<SetStateAction<boolean>>;
};

export function CourseDetailClientDiscussion({
  threads,
  setAllThreadsOpen,
  setThreadDetailOpen,
}: CourseDetailClientDiscussionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Discussion</span>
        <span className="m-card__sub">{threads.length * 6} active threads</span>
        <button
          className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
          onClick={() => setAllThreadsOpen(true)}
        >
          <LayersIcon size={12} />
        </button>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-12">
          {threads.map((t, i) => (
            <div key={i} className="m-thread-item">
              <Avatar name={t.who} />
              <div>
                <div>
                  <span className="m-thread-item__who">{t.who}</span>
                  {" · "}
                  <span className="m-thread-item__when">{t.time}</span>
                </div>
                <div className="m-thread-item__body">{t.body}</div>
              </div>
            </div>
          ))}
          <button
            className="m-btn m-btn--ghost m-btn--sm"
            onClick={() => setThreadDetailOpen(true)}
          >
            Open full thread
          </button>
        </div>
      </div>
    </div>
  );
}
