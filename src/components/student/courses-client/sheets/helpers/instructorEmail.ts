export function instructorEmail(instructor: string): string {
  const parts = instructor.replace("Prof. ", "").split(" ");

  return `${parts[0]?.toLowerCase() ?? "instructor"}.${parts[parts.length - 1]?.toLowerCase() ?? "x"}@aldridge.edu`;
}
