"use client";

import type { Thread } from "@/fake-db/dashboards";
import { CheckIcon, SendIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type ReplyComposerProps = {
  setUserReplies: Dispatch<SetStateAction<Thread[]>>;
};

export function ReplyComposer({ setUserReplies }: ReplyComposerProps) {
  const [reply, setReply] = useState("");
  const [posted, setPosted] = useState(false);

  return (
    <div className="m-thread-composer">
      <div className="m-thread-composer__label">Reply</div>
      {posted ? (
        <div className="m-assignment-submitted">
          <CheckIcon size={13} />
          Reply posted
        </div>
      ) : (
        <>
          <textarea
            className="m-assignment-textarea m-thread-composer__textarea"
            placeholder="Write a reply…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="m-thread-composer__footer">
            <button
              className="m-btn m-btn--primary m-btn--sm"
              disabled={reply.trim().length < 3}
              onClick={() => {
                setUserReplies((prev) => [
                  ...prev,
                  { who: "You", time: "Just now", body: reply.trim() },
                ]);
                setReply("");
                setPosted(true);
                setTimeout(() => setPosted(false), 2000);
              }}
            >
              <SendIcon size={12} /> Post reply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
