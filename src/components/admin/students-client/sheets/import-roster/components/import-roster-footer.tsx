import { Loader2Icon, UploadIcon } from "lucide-react";
import type { ImportRosterForm } from "../types/ImportRosterForm";

type ImportRosterFooterProps = {
  handleClose: () => void;
  form: ImportRosterForm;
  handleImport(): void;
};

export function ImportRosterFooter({
  handleClose,
  form,
  handleImport,
}: ImportRosterFooterProps) {
  return (
    <div className="m-sheet__foot">
      {form.state === "done" ? (
        <button className="m-btn m-btn--primary" onClick={handleClose}>
          Done
        </button>
      ) : (
        <>
          <button
            className="m-btn m-btn--ghost"
            onClick={handleClose}
            disabled={form.state === "uploading"}
          >
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!form.file || form.state !== "idle"}
            onClick={handleImport}
          >
            {form.state === "uploading" ? (
              <>
                <Loader2Icon size={13} className="m-spin" /> Importing…
              </>
            ) : (
              <>
                <UploadIcon size={13} /> Import
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
