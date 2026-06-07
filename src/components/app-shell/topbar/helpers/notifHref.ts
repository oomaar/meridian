export function notifHref(pathname: string): string {
  const role = pathname.split("/")[1];
  return `/${role}/notifications`;
}
