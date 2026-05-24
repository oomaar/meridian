export function strHash(s: string): number {
  let h = 0;

  for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffff;

  return h;
}
