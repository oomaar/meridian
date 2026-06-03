import { ROOT_LABEL } from "../data/ROOT_LABEL";
import { prettify } from "./prettify";

export function deriveCrumbs(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return ["Meridian"];
  const root = ROOT_LABEL[segments[0]] ?? "Meridian";
  return [root, ...segments.slice(1).map(prettify)];
}
