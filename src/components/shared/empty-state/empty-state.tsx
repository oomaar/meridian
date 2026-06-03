import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  heading: string;
  body: string;
  action?: ReactNode;
  size?: "default" | "sm";
};

export function EmptyState({
  icon: Icon,
  heading,
  body,
  action,
  size = "default",
}: EmptyStateProps) {
  return (
    <div className={size === "sm" ? "m-empty m-empty--sm" : "m-empty"}>
      <div className="m-empty__visual">
        <div className="m-empty__ring" />
        <div className="m-empty__ring" />
        <div className="m-empty__ring" />
        <div className="m-empty__icon">
          <Icon size={size === "sm" ? 18 : 24} />
        </div>
      </div>
      <h3 className="m-empty__heading">{heading}</h3>
      <p className="m-empty__body">{body}</p>
      {action && <div className="m-empty__action">{action}</div>}
    </div>
  );
}
