"use client";

import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { QueueItem } from "./queue-item";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type GradingClientQueueProps = {
  selectedIdx: number;
  setSelectedIdx: Dispatch<SetStateAction<number>>;
  queueCountLocal: number;
  queue: InstructorGradingQueueItem[];
  releasedIds: Set<string>;
};

export function GradingClientQueue({
  selectedIdx,
  setSelectedIdx,
  queueCountLocal,
  queue,
  releasedIds,
}: GradingClientQueueProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll active queue item into view when selectedIdx changes
  useEffect(() => {
    itemRefs.current[selectedIdx]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedIdx]);

  return (
    <div className="m-card m-grading-queue-card">
      <div className="m-card__head">
        <div className="m-card__title">Queue · {queueCountLocal}</div>
      </div>
      <div className="m-grading-queue-list">
        {queue.map((item, i) => (
          <QueueItem
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            item={item}
            active={i === selectedIdx}
            released={releasedIds.has(item.id)}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}
