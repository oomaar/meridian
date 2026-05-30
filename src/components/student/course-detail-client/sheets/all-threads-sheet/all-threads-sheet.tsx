import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import { PencilLineIcon, XIcon } from "lucide-react";
import { EXTRA_THREADS } from "./data/EXTRA_THREADS";

type AllThreadsSheetProps = {
  threads: { who: string; time: string; body: string }[];
  onClose: () => void;
  onOpenThread: () => void;
};

export function AllThreadsSheet({
  threads,
  onClose,
  onOpenThread,
}: AllThreadsSheetProps) {
  const allThreads = [...threads, ...EXTRA_THREADS];
  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <div className="m-sheet__head">
          <span className="m-sheet__title">All discussions</span>
          <button
            className="m-btn m-btn--ghost m-btn--sm"
            onClick={onOpenThread}
          >
            <PencilLineIcon size={13} /> New thread
          </button>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={14} />
          </button>
        </div>
        <div className="m-sheet__body m-sheet__body--flush">
          {allThreads.map((t, i) => (
            <div
              key={i}
              className="m-thread-row m-thread-item"
              onClick={onOpenThread}
            >
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
        </div>
      </div>
    </>
  );
}
