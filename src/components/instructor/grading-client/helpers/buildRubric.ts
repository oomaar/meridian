import type { InstructorGradingQueueItem } from "@/fake-db/dashboards";
import type { RubricCriterion } from "../types/RubricCriterion";
import { strHash } from "./strHash";
import { RUBRIC_BY_TYPE } from "../data/RUBRIC_BY_TYPE";

export function buildRubric(
  item: InstructorGradingQueueItem,
): RubricCriterion[] {
  const template = RUBRIC_BY_TYPE[item.assignmentType] ?? RUBRIC_BY_TYPE.quiz;

  return template.map((t, i) => {
    const h = strHash(item.id + t.title);
    const scoreRatio = 0.65 + (h % 31) / 100;

    return {
      id: `R${i + 1}`,
      title: t.title,
      max: t.max,
      score: Math.round(t.max * scoreRatio),
    };
  });
}
