import { useState } from "react";
import type { Channel } from "./types/Channel";
import { NOTIFICATIONS_EVENTS } from "./data/NOTIFICATIONS_EVENTS";
import { CardSection } from "../components/card-section";
import { CheckIcon, Loader2Icon } from "lucide-react";

export function SettingsNotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, Record<Channel, boolean>>>(
    () =>
      Object.fromEntries(
        NOTIFICATIONS_EVENTS.map((ev, i) => [
          ev,
          { email: i % 2 === 0, inapp: true, push: i < 3 },
        ]),
      ),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  function toggle(ev: string, ch: Channel) {
    setPrefs((prev) => ({
      ...prev,
      [ev]: { ...prev[ev], [ch]: !prev[ev][ch] },
    }));
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
          {NOTIFICATIONS_EVENTS.map((ev) => (
            <tr key={ev}>
              <td className="text-[13px]">{ev}</td>
              {(["email", "inapp", "push"] as Channel[]).map((ch) => (
                <td key={ch} className="text-center">
                  <input
                    type="checkbox"
                    className="m-checkbox"
                    checked={prefs[ev][ch]}
                    onChange={() => toggle(ev, ch)}
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
