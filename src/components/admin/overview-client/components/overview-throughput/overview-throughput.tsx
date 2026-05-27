"use client";

import { ThroughputByWindow } from "@/fake-db/dashboards";
import { useEffect, useRef, useState } from "react";
import type { TpWindow } from "../../types/TpWindow";
import { ReportModal } from "./report-modal/report-modal";
import { OverviewThroughputHeader } from "./overview-throughput-header";
import { OverviewThroughputBody } from "./overview-throughput-body";

type OverviewThroughputProps = {
  windows: ThroughputByWindow;
  submissionsLast7d: number;
};

export function OverviewThroughput({ windows }: OverviewThroughputProps) {
  const [win, setWin] = useState<TpWindow>("12w");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const data = windows[win];
  const peakPt = data.reduce((b, p) => (p.v > b.v ? p : b), data[0]);
  const sorted = [...data].map((p) => p.v).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const total = data.reduce((s, p) => s + p.v, 0);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  return (
    <>
      <div className="m-card">
        <OverviewThroughputHeader
          win={win}
          setWin={setWin}
          menuRef={menuRef}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <OverviewThroughputBody
          data={data}
          win={win}
          peakPt={peakPt}
          setReportOpen={setReportOpen}
          median={median}
        />
      </div>
      {reportOpen && (
        <ReportModal
          data={data}
          median={median}
          peakPt={peakPt}
          setReportOpen={setReportOpen}
          total={total}
          win={win}
        />
      )}
    </>
  );
}
