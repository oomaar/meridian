"use client";

import { useState } from "react";
import type {
  AdminSemesterCard,
  AdminSemestersData,
} from "@/fake-db/dashboards";
import SemestersClientHeader from "./components/semesters-client-header";
import { SemestersClientCard } from "./components/semesters-client-card";
import { SemestersTimeline } from "./components/semesters-time-line";

type SemestersClientProps = { data: AdminSemestersData };

export function SemestersClient({ data }: SemestersClientProps) {
  const [semesters, setSemesters] = useState<AdminSemesterCard[]>(
    data.semesters,
  );

  function handleAdd(card: AdminSemesterCard) {
    setSemesters((prev) => {
      const next = [...prev, card].sort((a, b) => a.id.localeCompare(b.id));
      return next;
    });
  }

  return (
    <>
      <SemestersClientHeader handleAdd={handleAdd} semesters={semesters} />
      <div className="m-page__body">
        <div className="m-stack">
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">Term timeline</div>
                <div className="m-card__sub">2025 – 2027 academic years</div>
              </div>
            </div>
            <div className="pt-6 px-5 pb-5">
              <SemestersTimeline
                semesters={semesters}
                todayPct={data.todayPct}
                tlLabels={data.tlLabels}
              />
            </div>
          </div>
          <div className="m-grid m-grid-2">
            {semesters.map((semester) => (
              <SemestersClientCard key={semester.id} semester={semester} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
