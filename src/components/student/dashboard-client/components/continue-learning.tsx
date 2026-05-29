import { ProgressBar } from "@/components/progress-bar";
import type { ContinueLearning } from "@/fake-db/dashboards";
import { FileIcon, PlayIcon } from "lucide-react";

type ContinueLearningProps = { continueLearning: ContinueLearning };

export function ContinueLearning({ continueLearning }: ContinueLearningProps) {
  return (
    <>
      {continueLearning && (
        <div className="m-card">
          <div className="m-card__head">
            <span className="m-card__title">Continue where you left off</span>
            <span className="m-card__sub">{continueLearning.moduleSub}</span>
            <span className="m-badge m-badge--accent">
              {Math.round(continueLearning.progress * 100)}% complete
            </span>
          </div>
          <div className="m-card__body">
            <div className="m-lesson-card">
              <div className="m-lesson-card__cover m-ph">
                lecture cover
                <br />
                <span className="m-lesson-card__meta">
                  {continueLearning.lessonMeta}
                </span>
              </div>
              <div className="m-lesson-card__body">
                <h3 className="m-lesson-card__title">
                  {continueLearning.lessonTitle}
                </h3>
                <p className="m-lesson-card__desc">
                  {continueLearning.lessonDesc}
                </p>
                <div className="m-lesson-card__actions">
                  <button className="m-btn m-btn--primary m-btn--sm">
                    <PlayIcon size={12} /> Resume ·{" "}
                    {continueLearning.minutesLeft} min left
                  </button>
                  <button className="m-btn m-btn--sm">
                    <FileIcon size={12} /> Open notebook
                  </button>
                </div>
                <ProgressBar value={continueLearning.progress} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
