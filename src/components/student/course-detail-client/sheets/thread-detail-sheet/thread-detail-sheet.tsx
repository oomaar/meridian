"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { FAKE_REPLIES } from "./data/FAKE_REPLIES";
import { OriginalPost } from "./components/original-post";
import type { Thread } from "@/fake-db/dashboards";
import { Replies } from "./components/replies";
import { ReplyComposer } from "./components/reply-composer";

type ThreadDetailSheetProps = {
  thread: Thread;
  instructor: string;
  onClose: () => void;
};

export function ThreadDetailSheet({
  thread,
  instructor,
  onClose,
}: ThreadDetailSheetProps) {
  const replies: Thread[] = FAKE_REPLIES.map((r) => ({
    ...r,
    who: r.who === "__instructor__" ? instructor : r.who,
  }));
  const [userReplies, setUserReplies] = useState<Thread[]>([]);
  const allReplies = [...replies, ...userReplies];

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <div className="m-sheet__head">
          <span className="m-sheet__title">Discussion thread</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={14} />
          </button>
        </div>

        <div className="m-sheet__body">
          <OriginalPost thread={thread} />
          <Replies allReplies={allReplies} />
          <ReplyComposer setUserReplies={setUserReplies} />
        </div>
      </div>
    </>
  );
}
