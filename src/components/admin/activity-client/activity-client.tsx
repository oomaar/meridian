"use client";

import { useState } from "react";
import { FilterIcon, PlusIcon, XIcon, ZapIcon } from "lucide-react";
import type { Activity } from "@/fake-db/types/activity";
import { FilterId } from "./types/FilterId";
import { NewRuleDrawer } from "./NewRuleDrawer";
import { TYPE_FILTERS } from "./data/TYPE_FILTERS";
import { relTime } from "./helpers/relTime";
import { FiltersPanel } from "./FiltersPanel";
import { ExportButton } from "./ExportButton";
import { computeCounts } from "./helpers/computeCounts";
import { filterEvents } from "./helpers/filterEvents";
import { TimeRangeId } from "./types/TimeRangeId";
import { INIT_RULES } from "./data/INIT_RULES";

type ActivityClientProps = { events: Activity[] };

export function ActivityClient({ events }: ActivityClientProps) {
  const [typeFilter, setTypeFilter] = useState<FilterId>("all");
  const [timeRange, setTimeRange] = useState<TimeRangeId>("24h");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ruleDrawer, setRuleDrawer] = useState(false);
  const [rules, setRules] = useState<string[]>(INIT_RULES);

  const counts = computeCounts(events);
  const filtered = filterEvents(events, typeFilter, timeRange);
  const hasFilters = typeFilter !== "all" || timeRange !== "24h";

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Operations</span>
          <h1 className="m-page__h">Activity</h1>
          <p className="m-page__sub">
            Real-time stream of operational events across the platform. Last 24
            hours.
          </p>
        </div>
        <div className="m-page__actions">
          <ExportButton />
          <div style={{ position: "relative" }}>
            <button
              className={`m-btn${hasFilters ? " m-btn--primary" : ""}`}
              onClick={() => setFiltersOpen((p) => !p)}
            >
              <FilterIcon size={14} />
              Filters
              {hasFilters && (
                <span className="m-activity-filter-badge">
                  {(typeFilter !== "all" ? 1 : 0) +
                    (timeRange !== "24h" ? 1 : 0)}
                </span>
              )}
            </button>
            {filtersOpen && (
              <FiltersPanel
                typeFilter={typeFilter}
                timeRange={timeRange}
                counts={counts}
                onType={setTypeFilter}
                onTime={setTimeRange}
                onClose={() => setFiltersOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          {/* Event stream */}
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">Event stream</div>
                <div className="m-card__sub">
                  {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                  {hasFilters
                    ? " · filtered"
                    : " · streaming · 1.2k events/day"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {!hasFilters && <span className="m-pulse-dot" />}
                <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
                  {hasFilters ? "filtered" : "live"}
                </span>
              </div>
            </div>
            <div className="m-card__body m-card__body--flush m-card__body--feed">
              {filtered.length === 0 ? (
                <div className="m-activity-empty">
                  <FilterIcon size={22} />
                  <span>No events match the current filters</span>
                </div>
              ) : (
                filtered.map((ev, i) => (
                  <div key={ev.id} className="m-feed-item">
                    <span
                      className={`m-feed-item__dot m-feed-item__dot--${ev.dot}`}
                    />
                    <div>
                      <div
                        className="m-feed-item__body"
                        dangerouslySetInnerHTML={{ __html: ev.body }}
                      />
                      <div className="m-event-meta">
                        <span className="m-mono">
                          evt_{(0x13d92 + i).toString(16)}
                        </span>
                        {" · "}
                        {ev.type.replace(/_/g, " ")}
                      </div>
                    </div>
                    <span className="m-feed-item__time">
                      {relTime(ev.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Right column */}
          <div className="m-stack">
            {/* By type — clicking filters the stream */}
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
            {/* Notification rules */}
            <div className="m-card">
              <div className="m-card__head">
                <div>
                  <div className="m-card__title">Notification rules</div>
                  <div className="m-card__sub">{rules.length} active</div>
                </div>
              </div>
              <div className="m-card__body">
                <div className="m-stack" style={{ gap: 10 }}>
                  {rules.map((rule, i) => (
                    <div key={i} className="m-rule-item">
                      <ZapIcon size={14} className="m-rule-item__icon" />
                      <span className="m-rule-item__label">{rule}</span>
                      <span className="m-badge m-badge--success">On</span>
                    </div>
                  ))}
                  <button className="m-btn" onClick={() => setRuleDrawer(true)}>
                    <PlusIcon size={14} /> New rule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ruleDrawer && (
        <NewRuleDrawer
          onClose={() => setRuleDrawer(false)}
          onSave={(label) => {
            setRules((prev) => [...prev, label]);
            setRuleDrawer(false);
          }}
        />
      )}
    </>
  );
}
