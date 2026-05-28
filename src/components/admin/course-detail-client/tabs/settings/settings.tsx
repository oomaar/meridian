import { AdminCourseDTO, AdminInstructorDTO } from "@/fake-db/dashboards";
import { useState } from "react";
import { SettingsDangerZone } from "./components/settings-danger-zone";
import { SettingsCourseInfo } from "./components/settings-course-info";
import { SettingsCourseNotifications } from "./components/settings-course-notifications";
import { SettingsSaveButton } from "./components/settings-save-button";
import { SettingsGradingPolicy } from "./components/settings-grading-policy";
import { SettingsEnrollment } from "./components/settings-enrollment";
import { SettingsGeneral } from "./components/settings-general";

type SettingsProps = { course: AdminCourseDTO; instructor: AdminInstructorDTO };

export type SettingsFormState = {
  title: string;
  credits: string;
  modality: string;
  cap: string;
  waitlist: boolean;
  autoClose: boolean;
  gradeScale: string;
  latePenalty: string;
  emailNew: boolean;
  emailGrades: boolean;
};

export function Settings({ course, instructor }: SettingsProps) {
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>({
    title: course.title,
    credits: String(course.credits),
    modality: course.modality,
    cap: String(course.cap),
    waitlist: false,
    autoClose: true,
    gradeScale: "letter",
    latePenalty: "10pct",
    emailNew: true,
    emailGrades: false,
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  function setSF(k: string, v: string | boolean) {
    setSettingsForm((f) => ({ ...f, [k]: v }));
  }

  function saveSettings() {
    setSettingsSaving(true);
    setTimeout(() => {
      setSettingsSaving(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }, 1100);
  }

  return (
    <div className="m-grid m-grid-2-1 m-grid--top">
      <div className="m-stack">
        <SettingsGeneral
          settingsForm={settingsForm}
          setSF={setSF}
          course={course}
        />
        <SettingsEnrollment settingsForm={settingsForm} setSF={setSF} />
        <SettingsGradingPolicy settingsForm={settingsForm} setSF={setSF} />
        <SettingsSaveButton
          saveSettings={saveSettings}
          settingsSaving={settingsSaving}
          settingsSaved={settingsSaved}
        />
      </div>
      <div className="m-stack">
        <SettingsCourseNotifications
          settingsForm={settingsForm}
          setSF={setSF}
        />
        <SettingsCourseInfo course={course} instructor={instructor} />
        <SettingsDangerZone />
      </div>
    </div>
  );
}
