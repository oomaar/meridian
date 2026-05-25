"use client";

import { CheckIcon } from "lucide-react";
import { ImportRosterHeader } from "./components/import-roster-header";
import { ImportRosterDropzone } from "./components/import-roster-dropzone";
import { ImportRosterNote } from "./components/import-roster-note";
import { ImportRosterUploadingState } from "./components/import-roaster-uploading-state";
import { ImportRosterFooter } from "./components/import-roster-footer";
import { Dispatch, SetStateAction, useState } from "react";
import type { ImportRosterForm } from "./types/ImportRosterForm";
import { INITIAL_ROSTER_FORM } from "./data/INITIAL_ROSTER_FORM";

type ImportRosterSheetDrawerProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function ImportRosterSheetDrawer({
  setOpen,
}: ImportRosterSheetDrawerProps) {
  const [form, setForm] = useState<ImportRosterForm>(INITIAL_ROSTER_FORM);

  function handleClose() {
    if (form.state === "uploading") return;
    setOpen(false);
    setForm(INITIAL_ROSTER_FORM);
  }

  function handleImport() {
    if (!form.file || form.state !== "idle") return;
    setForm({ ...form, state: "uploading" });
    setForm({ ...form, progress: 0 });

    // simulate upload progress
    const tick = setInterval(() => {
      setForm((prevForm) => {
        if (prevForm.progress >= 100) {
          clearInterval(tick);
          return { ...prevForm, state: "done", progress: 100 };
        }
        return {
          ...prevForm,
          progress: prevForm.progress + Math.random() * 18 + 4,
        };
      });
    }, 120);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={handleClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Import roster"
      >
        <ImportRosterHeader handleClose={handleClose} />
        <div className="m-sheet__body">
          {form.state === "done" ? (
            <div className="m-import-done">
              <div className="m-import-done__icon">
                <CheckIcon size={28} />
              </div>
              <p className="m-import-done__title">Roster imported</p>
              <p className="m-import-done__sub">
                {form.file?.name} was processed successfully.
                <br />
                New students will appear in the roster shortly.
              </p>
            </div>
          ) : (
            <>
              <ImportRosterDropzone form={form} setForm={setForm} />
              <ImportRosterNote />
              {form.state === "uploading" && (
                <ImportRosterUploadingState progress={form.progress} />
              )}
            </>
          )}
        </div>
        <ImportRosterFooter
          handleClose={handleClose}
          form={form}
          handleImport={handleImport}
        />
      </div>
    </>
  );
}
