"use client";

import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import type { StudentCourseDetailData, Thread } from "@/fake-db/dashboards";
import { LayersIcon } from "lucide-react";
import { useState } from "react";
import { AllThreadsSheet } from "../sheets/all-threads-sheet/all-threads-sheet";
import { ThreadDetailSheet } from "../sheets/thread-detail-sheet/thread-detail-sheet";

type CourseDetailClientDiscussionProps = {
  threads: Thread[];
  course: StudentCourseDetailData["course"];
};

type ThreadSheetsState = {
  allThreadsOpen: boolean;
  threadDetailOpen: boolean;
};

export function CourseDetailClientDiscussion({
  threads,
  course,
}: CourseDetailClientDiscussionProps) {
  const [threadSheets, setThreadSheets] = useState<ThreadSheetsState>({
    allThreadsOpen: false,
    threadDetailOpen: false,
  });

  return (
    <>
      <div className="m-card">
        <div className="m-card__head">
          <span className="m-card__title">Discussion</span>
          <span className="m-card__sub">
            {threads.length * 6} active threads
          </span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={() =>
              setThreadSheets((prev) => ({ ...prev, allThreadsOpen: true }))
            }
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
              onClick={() =>
                setThreadSheets((prev) => ({ ...prev, threadDetailOpen: true }))
              }
            >
              Open full thread
            </button>
          </div>
        </div>
      </div>
      {threadSheets.allThreadsOpen && (
        <AllThreadsSheet
          threads={threads}
          onClose={() =>
            setThreadSheets((prev) => ({ ...prev, allThreadsOpen: false }))
          }
          onOpenThread={() => {
            setThreadSheets((prev) => ({
              ...prev,
              allThreadsOpen: false,
              threadDetailOpen: true,
            }));
          }}
        />
      )}
      {threadSheets.threadDetailOpen && (
        <ThreadDetailSheet
          thread={threads[0]}
          instructor={course.instructor}
          onClose={() =>
            setThreadSheets((prev) => ({ ...prev, threadDetailOpen: false }))
          }
        />
      )}
    </>
  );
}
