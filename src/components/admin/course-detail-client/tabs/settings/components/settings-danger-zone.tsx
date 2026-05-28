import { AlertTriangleIcon, ArchiveIcon } from "lucide-react";

export function SettingsDangerZone() {
  return (
    <div className="m-card m-card--danger">
      <div className="m-settings-section">
        <p className="m-settings-section__title m-settings-section__title--danger">
          Danger zone
        </p>
        <div className="m-danger-zone">
          <AlertTriangleIcon size={16} className="m-danger-zone__icon" />
          <div className="m-danger-zone__body">
            <div className="m-danger-zone__title">Archive this course</div>
            <div className="m-danger-zone__desc">
              Removes the course from the active catalog. Students lose access
              to new content. Grades and history are preserved.
            </div>
            <button className="m-btn m-btn--ghost m-btn--danger">
              <ArchiveIcon size={13} /> Archive course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
