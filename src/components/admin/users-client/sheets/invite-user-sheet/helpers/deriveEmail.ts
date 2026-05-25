export function deriveEmail(first: string, last: string): string {
  if (!first && !last) return "";

  const f = first.toLowerCase().replace(/\s+/g, "");
  const l = last.toLowerCase().replace(/\s+/g, "");

  if (!l) return f ? `${f}@aldridge.edu` : "";

  return `${f}.${l}@aldridge.edu`;
}
