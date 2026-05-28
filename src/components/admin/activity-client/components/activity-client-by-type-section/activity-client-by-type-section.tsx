import { XIcon } from "lucide-react";
import { FilterId } from "../../types/FilterId";
import { Dispatch, SetStateAction } from "react";
import { TYPE_FILTERS } from "./data/TYPE_FILTERS";

type ActivityClientByTypeSectionProps = {
  typeFilter: FilterId;
  setTypeFilter: Dispatch<SetStateAction<FilterId>>;
  counts: Record<FilterId, number>;
};

export function ActivityClientByTypeSection({
  typeFilter,
  setTypeFilter,
  counts,
}: ActivityClientByTypeSectionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">By type</div>
        {typeFilter !== "all" && (
          <button
            className="m-btn m-btn--ghost m-btn--sm"
            onClick={() => setTypeFilter("all")}
          >
            <XIcon size={12} /> Clear
          </button>
        )}
      </div>
      <div className="m-card__body m-card__body--flush">
        {TYPE_FILTERS.map((t) => (
          <div
            key={t.id}
            className={`m-type-row${typeFilter === t.id ? " m-type-row--active" : ""}`}
            onClick={() => setTypeFilter(t.id)}
          >
            <span className="m-type-row__label">{t.label}</span>
            <span className="m-type-row__count">{counts[t.id]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
