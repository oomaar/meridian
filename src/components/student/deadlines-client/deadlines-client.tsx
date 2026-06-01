"use client";

import { useState } from "react";
import type { StudentDeadlineItem } from "@/fake-db/dashboards";
import { DeadlinesTabs } from "./components/deadlines-tabs/deadlines-tabs";
import { DeadlineGroup } from "./components/deadline-group";
import { groupDeadlinesByDate } from "./helpers/groupDeadlinesByDate";
import type { DeadlineType } from "./types/DeadlineType";
import { DEADLINE_GROUPS } from "./data/DEADLINE_GROUPS";

type DeadlinesClientProps = {
  deadlines: StudentDeadlineItem[];
};

export function DeadlinesClient({ deadlines }: DeadlinesClientProps) {
  const [activeTab, setActiveTab] = useState<DeadlineType>("all");

  const filteredDeadlines =
    activeTab === "all"
      ? deadlines
      : deadlines.filter((d) => d.type === activeTab);

  const groupedDeadlines = groupDeadlinesByDate(filteredDeadlines);
  const hasAnyDeadlines = filteredDeadlines.length > 0;

  const counts = {
    all: deadlines.length,
    assignment: deadlines.filter((d) => d.type === "assignment").length,
    paper: deadlines.filter((d) => d.type === "paper").length,
    discussion: deadlines.filter((d) => d.type === "discussion").length,
    milestone: deadlines.filter((d) => d.type === "milestone").length,
  };

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Academic</span>
          <h1 className="m-page__h">Deadlines</h1>
          <p className="m-page__sub">
            {filteredDeadlines.length} upcoming{" "}
            {activeTab === "all"
              ? "deadlines"
              : activeTab + (filteredDeadlines.length === 1 ? "" : "s")}
          </p>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-deadlines-layout">
          <DeadlinesTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />

          <div className="m-deadlines-content">
            {hasAnyDeadlines ? (
              DEADLINE_GROUPS.filter(
                (g) =>
                  groupedDeadlines[g.key as keyof typeof groupedDeadlines]
                    .length > 0,
              ).map((group) => (
                <DeadlineGroup
                  key={group.key}
                  heading={group.label}
                  deadlines={
                    groupedDeadlines[group.key as keyof typeof groupedDeadlines]
                  }
                />
              ))
            ) : (
              <div className="m-deadlines-empty">
                <p>No deadlines to show</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
