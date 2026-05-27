"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { AdminCourseDTO } from "@/fake-db/dashboards";
import { SettingsFormState } from "../settings";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CREDITS = ["1", "2", "3", "4"];
const MODALITIES = ["In-person", "Hybrid", "Online"];
const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover";

type SettingsGeneralProps = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
  course: AdminCourseDTO;
};

export function SettingsGeneral({
  settingsForm,
  setSF,
  course,
}: SettingsGeneralProps) {
  const [openField, setOpenField] = useState<"credits" | "modality" | null>(
    null,
  );

  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">General</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Course title</span>
          <input
            className="m-field__input m-field--xl"
            value={settingsForm.title}
            onChange={(e) => setSF("title", e.target.value)}
          />
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Credits</span>
          <Popover
            open={openField === "credits"}
            onOpenChange={(o) => setOpenField(o ? "credits" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="m-field__input m-field__trigger m-field--md"
              >
                <span>
                  {settingsForm.credits} credit
                  {settingsForm.credits !== "1" ? "s" : ""}
                </span>
                <ChevronDownIcon size={14} className="m-field__chevron" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={6}
              className={POPOVER_CLASSES}
            >
              {CREDITS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`m-role-option${settingsForm.credits === v ? " m-role-option--active" : ""}`}
                  onClick={() => {
                    setSF("credits", v);
                    setOpenField(null);
                  }}
                >
                  <span>
                    {v} credit{v !== "1" ? "s" : ""}
                  </span>
                  {settingsForm.credits === v && (
                    <CheckIcon size={12} className="m-role-option__check" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Modality</span>
          <Popover
            open={openField === "modality"}
            onOpenChange={(o) => setOpenField(o ? "modality" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="m-field__input m-field__trigger m-field--md"
              >
                <span>{settingsForm.modality}</span>
                <ChevronDownIcon size={14} className="m-field__chevron" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={6}
              className={POPOVER_CLASSES}
            >
              {MODALITIES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`m-role-option${settingsForm.modality === m ? " m-role-option--active" : ""}`}
                  onClick={() => {
                    setSF("modality", m);
                    setOpenField(null);
                  }}
                >
                  <span>{m}</span>
                  {settingsForm.modality === m && (
                    <CheckIcon size={12} className="m-role-option__check" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Location</span>
          <span className="m-settings-row__value m-mono">
            {course.location.building} {course.location.room}
          </span>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Schedule</span>
          <span className="m-settings-row__value m-mono">
            {course.meetingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
