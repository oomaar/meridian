import { CheckIcon, Loader2Icon } from "lucide-react";

type SettingsSaveButtonProps = {
  saveSettings(): void;
  settingsSaving: boolean;
  settingsSaved: boolean;
};

export function SettingsSaveButton({
  saveSettings,
  settingsSaving,
  settingsSaved,
}: SettingsSaveButtonProps) {
  return (
    <div className="m-flex-end">
      <button
        className="m-btn m-btn--primary"
        onClick={saveSettings}
        disabled={settingsSaving}
      >
        {settingsSaving && (
          <>
            <Loader2Icon size={13} className="m-spin" /> Saving…
          </>
        )}
        {settingsSaved && (
          <>
            <CheckIcon size={13} /> Saved!
          </>
        )}
        {!settingsSaving && !settingsSaved && (
          <>
            <CheckIcon size={13} /> Save changes
          </>
        )}
      </button>
    </div>
  );
}
