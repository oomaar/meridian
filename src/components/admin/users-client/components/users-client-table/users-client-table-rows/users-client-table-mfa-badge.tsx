import { CheckIcon } from "lucide-react";

type UsersClientTableMfaBadgeProps = { mfa: boolean };

export function UsersClientTableMfaBadge({
  mfa,
}: UsersClientTableMfaBadgeProps) {
  return mfa ? (
    <span className="m-badge m-badge--success">
      <CheckIcon /> Required
    </span>
  ) : (
    <span className="m-badge m-badge--warning">Not set</span>
  );
}
