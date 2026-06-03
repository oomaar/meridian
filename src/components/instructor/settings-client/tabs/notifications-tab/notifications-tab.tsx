"use client";

import { CardSection } from "@/components/admin/settings-client/components/card-section";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

type Channel = "email" | "inapp" | "push";

const EVENTS: { id: string; label: string }[] = [
  { id: "newSubmission", label: "New submission received" },
  { id: "gradingDeadline", label: "Grading deadline approaching (48h)" },
  { id: "studentQuestion", label: "Student question in discussion" },
  { id: "gradePassback", label: "Grade passback complete" },
  { id: "rosterChange", label: "Roster change (add / drop)" },
  { id: "announcementReply", label: "Student reply to announcement" },
  { id: "systemMaintenance", label: "System maintenance notice" },
];

type Prefs = Record<string, Record<Channel, boolean>>;

function buildInitial(): Prefs {
  return Object.fromEntries(
    EVENTS.map(({ id }, i) => [
      id,
      { email: i % 2 === 0, inapp: true, push: i < 3 },
    ]),
  );
}

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<Prefs>(buildInitial);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  function toggle(id: string, ch: Channel) {
    setPrefs((p) => ({ ...p, [id]: { ...p[id], [ch]: !p[id][ch] } }));
  }

  function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 900);
  }

  return (
    <CardSection
      title="Channels & preferences"
      action={
        <button
          className="m-btn m-btn--primary m-btn--sm"
          onClick={handleSave}
          disabled={saveState === "saving"}
        >
          {saveState === "idle" && "Save preferences"}
          {saveState === "saving" && (
            <>
              <Loader2Icon size={12} className="m-spin" /> Saving…
            </>
          )}
          {saveState === "saved" && (
            <>
              <CheckIcon size={12} /> Saved
            </>
          )}
        </button>
      }
    >
      <table className="m-table mt-1">
        <thead>
          <tr>
            <th>Event</th>
            <th className="text-center w-22.5">Email</th>
            <th className="text-center w-22.5">In-app</th>
            <th className="text-center w-22.5">Mobile push</th>
          </tr>
        </thead>
        <tbody>
          {EVENTS.map(({ id, label }) => (
            <tr key={id}>
              <td className="text-[13px]">{label}</td>
              {(["email", "inapp", "push"] as Channel[]).map((ch) => (
                <td key={ch} className="text-center">
                  <input
                    type="checkbox"
                    className="m-checkbox"
                    checked={prefs[id][ch]}
                    onChange={() => toggle(id, ch)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardSection>
  );
}
