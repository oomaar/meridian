import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { strHash } from "./strHash";
import { INLINE_COMMENTS } from "../data/INLINE_COMMENTS";

export function getInlineComment(item: InstructorGradingQueueItem): string {
  const h = strHash(item.id + "comment");

  return INLINE_COMMENTS[h % INLINE_COMMENTS.length];
}
