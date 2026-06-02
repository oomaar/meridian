"use client";

import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { MessageInstructorSheetBody } from "./message-instructor-sheet-body";

type MessageInstructorSheetProps = {
  instructor: string;
  courseCode: string;
};

export function MessageInstructorSheet({
  instructor,
  courseCode,
}: MessageInstructorSheetProps) {
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setMessageOpen(true)}>
        <MessageSquareIcon size={14} /> Message instructor
      </button>
      {messageOpen && (
        <MessageInstructorSheetBody
          instructor={instructor}
          courseCode={courseCode}
          onClose={() => setMessageOpen(false)}
        />
      )}
    </>
  );
}
