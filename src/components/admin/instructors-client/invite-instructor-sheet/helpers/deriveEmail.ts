export function deriveEmail(first: string, last: string): string {
  const f = first.toLowerCase().replace(/[^a-z]/g, "");
  const l = last.toLowerCase().replace(/[^a-z]/g, "");

  if (!f && !l) return "";

  return `${[f, l].filter(Boolean).join(".")}@aldridge.edu`;
}
