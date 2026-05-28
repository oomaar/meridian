"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SettingsFormState } from "../settings";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover";

const GRADE_SCALES = [
  { value: "letter", label: "Letter grades (A–F)" },
  { value: "percent", label: "Percentage (0–100)" },
  { value: "passfail", label: "Pass / Fail" },
];

const LATE_PENALTIES = [
  { value: "none", label: "No penalty" },
  { value: "10pct", label: "10% per day" },
  { value: "20pct", label: "20% per day" },
  { value: "zero", label: "Zero credit" },
];

type SettingsGradingPolicyProps = {
  settingsForm: SettingsFormState;
  setSF(k: string, v: string | boolean): void;
};

export function SettingsGradingPolicy({
  settingsForm,
  setSF,
}: SettingsGradingPolicyProps) {
  const [openField, setOpenField] = useState<
    "gradeScale" | "latePenalty" | null
  >(null);

  return (
    <div className="m-card">
      <div className="m-settings-section">
        <p className="m-settings-section__title">Grading policy</p>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Grade scale</span>
          <Popover
            open={openField === "gradeScale"}
            onOpenChange={(o) => setOpenField(o ? "gradeScale" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="m-field__input m-field__trigger m-field--lg"
              >
                <span>
                  {
                    GRADE_SCALES.find(
                      (s) => s.value === settingsForm.gradeScale,
                    )?.label
                  }
                </span>
                <ChevronDownIcon size={14} className="m-field__chevron" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={6}
              className={POPOVER_CLASSES}
            >
              {GRADE_SCALES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`m-role-option${settingsForm.gradeScale === s.value ? " m-role-option--active" : ""}`}
                  onClick={() => {
                    setSF("gradeScale", s.value);
                    setOpenField(null);
                  }}
                >
                  <span>{s.label}</span>
                  {settingsForm.gradeScale === s.value && (
                    <CheckIcon size={12} className="m-role-option__check" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="m-settings-row">
          <span className="m-settings-row__label">Late submission penalty</span>
          <Popover
            open={openField === "latePenalty"}
            onOpenChange={(o) => setOpenField(o ? "latePenalty" : null)}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="m-field__input m-field__trigger m-field--lg"
              >
                <span>
                  {
                    LATE_PENALTIES.find(
                      (p) => p.value === settingsForm.latePenalty,
                    )?.label
                  }
                </span>
                <ChevronDownIcon size={14} className="m-field__chevron" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={6}
              className={POPOVER_CLASSES}
            >
              {LATE_PENALTIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`m-role-option${settingsForm.latePenalty === p.value ? " m-role-option--active" : ""}`}
                  onClick={() => {
                    setSF("latePenalty", p.value);
                    setOpenField(null);
                  }}
                >
                  <span>{p.label}</span>
                  {settingsForm.latePenalty === p.value && (
                    <CheckIcon size={12} className="m-role-option__check" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
