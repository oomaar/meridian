import type { Resource } from "@/fake-db/dashboards";
import { DownloadIcon, PaperclipIcon } from "lucide-react";

type CourseDetailClientLessonResourcesProps = {
  resources: Resource[];
};

export function CourseDetailClientLessonResources({
  resources,
}: CourseDetailClientLessonResourcesProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Lesson resources</span>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-8">
          {resources.map((r) => (
            <div key={r.name} className="m-resource-item">
              <PaperclipIcon size={13} className="m-resource-icon" />
              <div className="m-resource-item__body">
                <div className="m-resource-item__name">{r.name}</div>
                <div className="m-resource-item__meta">{r.meta}</div>
              </div>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                tabIndex={-1}
              >
                <DownloadIcon size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
