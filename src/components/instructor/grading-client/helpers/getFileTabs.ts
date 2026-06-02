import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import type { FileTab } from "../types/FileTab";
import { strHash } from "./strHash";
import { TAB_SETS } from "../data/TAB_SETS";

export function getFileTabs(
  item: InstructorGradingQueueItem,
): FileTab[] | null {
  const codeTypes = ["lab", "project", "quiz"];

  if (!codeTypes.includes(item.assignmentType)) return null;

  const h = strHash(item.id);

  return TAB_SETS[h % TAB_SETS.length];
}
