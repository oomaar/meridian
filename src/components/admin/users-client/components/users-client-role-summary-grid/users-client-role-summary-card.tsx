import type { RoleSummaryCard } from "@/fake-db/dashboards";

type UsersClientRoleSummaryCardProps = { card: RoleSummaryCard };

export function UsersClientRoleSummaryCard({
  card,
}: UsersClientRoleSummaryCardProps) {
  return (
    <div className="m-card m-role-card">
      <div className="m-role-card__head">
        <span className="m-role-card__dot" style={{ background: card.color }} />
        <b className="m-role-card__name">{card.name}</b>
        <span className="m-spacer" />
        <span className="m-role-card__count m-mono">
          {card.count.toLocaleString()}
        </span>
      </div>
      <div className="m-role-card__scope">{card.scope}</div>
    </div>
  );
}
