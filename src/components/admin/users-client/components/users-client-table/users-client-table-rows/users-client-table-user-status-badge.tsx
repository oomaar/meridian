import type { UserStatus } from "@/fake-db";

type UsersClientTableUserStatusBadgeProps = { status: UserStatus };

export function UsersClientTableUserStatusBadge({
  status,
}: UsersClientTableUserStatusBadgeProps) {
  const map: Record<UserStatus, { label: string; mod: string }> = {
    active: { label: "Active", mod: "success" },
    invited: { label: "Invited", mod: "info" },
    suspended: { label: "Suspended", mod: "danger" },
  };

  const { label, mod } = map[status];

  return <span className={`m-badge m-badge--${mod}`}>{label}</span>;
}
