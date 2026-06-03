import type { InstructorOfficeHoursSlot } from "@/fake-db/dashboards";
import { ClockIcon, MapPinIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { fmt } from "./helpers/fmt";

type OfficeHoursSheetDrawerProps = {
  officeLocation: string;
  officeHours: InstructorOfficeHoursSlot[];
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function OfficeHoursSheetDrawer({
  officeLocation,
  officeHours,
  setOpen,
}: OfficeHoursSheetDrawerProps) {
  return (
    <>
      <div
        className="m-sheet-overlay"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className="m-sheet" role="dialog" aria-label="Office hours">
        <div className="m-sheet__head">
          <ClockIcon size={16} className="m-oh-sheet-icon" />
          <div className="m-sheet__title">Office Hours</div>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={() => setOpen(false)}
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="m-sheet__body">
          <div className="m-oh-location">
            <MapPinIcon size={14} className="m-oh-location__icon" />
            <div>
              <div className="m-oh-location__label">Location</div>
              <div className="m-oh-location__value">{officeLocation}</div>
            </div>
          </div>

          <div className="m-oh-section-heading">Weekly schedule</div>
          <div className="m-oh-slots">
            {officeHours.map((slot, i) => (
              <div key={i} className="m-oh-slot">
                <div className="m-oh-slot__day">{slot.day}</div>
                <div className="m-oh-slot__time">
                  {fmt(slot.start)} – {fmt(slot.end)}
                </div>
                <span
                  className={`m-badge ${slot.type === "drop-in" ? "m-badge--success" : "m-badge--info"}`}
                >
                  {slot.type === "drop-in" ? "Drop-in" : "By appointment"}
                </span>
              </div>
            ))}
          </div>

          <div className="m-oh-section-heading">This week</div>
          <div className="m-oh-this-week">
            {officeHours.slice(0, 2).map((slot, i) => (
              <div key={i} className="m-oh-this-week__item">
                <div className="m-oh-this-week__dot" />
                <div>
                  <div className="m-oh-this-week__label">
                    {slot.day} — {fmt(slot.start)} to {fmt(slot.end)}
                  </div>
                  <div className="m-oh-this-week__sub">{officeLocation}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="m-oh-note">
            Students can book appointments via the student portal, or walk in
            during drop-in hours.
          </div>

          <div className="m-oh-actions">
            <button className="m-btn m-btn--ghost m-btn--sm">
              Cancel {`today's`} hours
            </button>
            <button className="m-btn m-btn--sm">Edit schedule</button>
          </div>
        </div>
      </aside>
    </>
  );
}
