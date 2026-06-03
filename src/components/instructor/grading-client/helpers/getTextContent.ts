import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import { strHash } from "./strHash";
import { TEXT_SNIPPETS } from "../types/TEXT_SNIPPETS";

export function getTextContent(item: InstructorGradingQueueItem): string {
  const h = strHash(item.id);

  return TEXT_SNIPPETS[h % TEXT_SNIPPETS.length];
}
