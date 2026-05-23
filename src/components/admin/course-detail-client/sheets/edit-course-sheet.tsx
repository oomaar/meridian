import { CheckIcon, Loader2Icon, PenIcon, XIcon } from "lucide-react";
import { useState } from "react";

type EditCourseSheetProps = {
  course: {
    title: string;
    credits: number;
    modality: string;
    cap: number;
    status: string;
  };
  onClose: () => void;
};

export function EditCourseSheet({ course, onClose }: EditCourseSheetProps) {
  const [form, setForm] = useState({
    title: course.title,
    credits: String(course.credits),
    modality: course.modality,
    cap: String(course.cap),
    status: course.status,
  });

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => {
        onClose();
        setSaveState("idle");
      }, 1000);
    }, 1100);
  }

  return (
    <>
      <div
        className="m-sheet-overlay"
        onClick={saveState === "saving" ? undefined : onClose}
      />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Edit course"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">Edit course</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
            disabled={saveState === "saving"}
          >
            <XIcon size={15} />
          </button>
        </div>
        <form
          className="m-sheet__body"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="m-field">
            <span className="m-field__label">Course title</span>
            <input
              className="m-field__input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </label>
          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Credits</span>
              <select
                className="m-field__input m-field__select"
                value={form.credits}
                onChange={(e) => set("credits", e.target.value)}
              >
                {["1", "2", "3", "4"].map((v) => (
                  <option key={v} value={v}>
                    {v} credit{v !== "1" ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="m-field">
              <span className="m-field__label">Enrollment cap</span>
              <input
                className="m-field__input m-mono"
                type="number"
                min={1}
                max={500}
                value={form.cap}
                onChange={(e) => set("cap", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Modality</span>
              <select
                className="m-field__input m-field__select"
                value={form.modality}
                onChange={(e) => set("modality", e.target.value)}
              >
                {["In-person", "Hybrid", "Online"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="m-field">
              <span className="m-field__label">Status</span>
              <select
                className="m-field__input m-field__select"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="planning">Planning</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </form>
        <div className="m-sheet__foot">
          <button
            className="m-btn m-btn--ghost"
            onClick={onClose}
            disabled={saveState === "saving"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            onClick={save}
            disabled={saveState !== "idle" || !form.title.trim()}
          >
            {saveState === "idle" && (
              <>
                <PenIcon size={13} /> Save changes
              </>
            )}
            {saveState === "saving" && (
              <>
                <Loader2Icon size={13} className="m-spin" /> Saving…
              </>
            )}
            {saveState === "saved" && (
              <>
                <CheckIcon size={13} /> Saved!
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
