import { ROOT_LABEL } from "../data/ROOT_LABEL";
import { ROOT_HREF } from "../data/ROOT_HREF";
import { prettify } from "./prettify";

export type Crumb = { label: string; href: string | null };

export function deriveCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: "Meridian", href: null }];

  const role = segments[0];
  const crumbs: Crumb[] = [
    { label: ROOT_LABEL[role] ?? "Meridian", href: ROOT_HREF[role] ?? null },
  ];

  for (let i = 1; i < segments.length; i++) {
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: prettify(segments[i]),
      href: isLast ? null : "/" + segments.slice(0, i + 1).join("/"),
    });
  }

  return crumbs;
}
