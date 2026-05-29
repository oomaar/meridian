import { ProgressBar } from "@/components/progress-bar";
import type { TermOverview } from "@/fake-db/dashboards";

type TermOverviewProps = {
  termOverview: TermOverview;
};

export function TermOverview({ termOverview }: TermOverviewProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Term overview</span>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-14">
          <div className="m-kv-row">
            <span className="m-kv-row__label">Credits this term</span>
            <b className="m-mono">
              {termOverview.creditsThisTerm} / {termOverview.totalTermCredits}
            </b>
          </div>
          <div className="m-kv-row">
            <span className="m-kv-row__label">Cumulative GPA</span>
            <b className="m-kv-row__gpa m-mono">
              {termOverview.gpa.toFixed(2)}
            </b>
          </div>
          <div className="m-kv-row">
            <span className="m-kv-row__label">Degree progress</span>
            <b className="m-mono">{termOverview.degreeProgress}%</b>
          </div>
          <ProgressBar value={termOverview.degreeProgress / 100} lg />
          <hr className="m-rule" />
          <div className="m-term-footer">
            {termOverview.program} · Class of {termOverview.classYear} · Advisor{" "}
            <b>{termOverview.advisorName}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
