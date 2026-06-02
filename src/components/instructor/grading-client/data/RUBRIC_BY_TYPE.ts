export const RUBRIC_BY_TYPE: Record<
  string,
  Array<{ title: string; max: number }>
> = {
  lab: [
    { title: "Correctness", max: 35 },
    { title: "Testing", max: 25 },
    { title: "Code quality", max: 25 },
    { title: "Documentation", max: 15 },
  ],
  project: [
    { title: "Implementation", max: 40 },
    { title: "Design", max: 25 },
    { title: "Testing", max: 20 },
    { title: "Documentation", max: 15 },
  ],
  quiz: [
    { title: "Completeness", max: 50 },
    { title: "Accuracy", max: 35 },
    { title: "Explanation", max: 15 },
  ],
  essay: [
    { title: "Writing quality", max: 30 },
    { title: "Analysis", max: 30 },
    { title: "Evidence", max: 25 },
    { title: "Format", max: 15 },
  ],
  exam: [
    { title: "Problem solving", max: 40 },
    { title: "Accuracy", max: 35 },
    { title: "Methodology", max: 25 },
  ],
  presentation: [
    { title: "Content", max: 35 },
    { title: "Delivery", max: 30 },
    { title: "Visuals", max: 20 },
    { title: "Q&A response", max: 15 },
  ],
};
