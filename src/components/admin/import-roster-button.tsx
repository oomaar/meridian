"use client";

import { useRef, useState } from "react";
import {
  CheckIcon,
  FileTextIcon,
  Loader2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

type ImportState = "idle" | "uploading" | "done";

export function ImportRosterButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ImportState>("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleImport() {
    if (!file || state !== "idle") return;
    setState("uploading");
    setProgress(0);

    // simulate upload progress
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(tick);
          setState("done");
          return 100;
        }
        return p + Math.random() * 18 + 4;
      });
    }, 120);
  }

  function handleClose() {
    if (state === "uploading") return;
    setOpen(false);
    setFile(null);
    setState("idle");
    setProgress(0);
  }

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <UploadIcon size={14} /> Import roster
      </button>

      {open && (
        <>
          <div className="m-sheet-overlay" onClick={handleClose} />
          <div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Import roster"
          >
            <div className="m-sheet__head">
              <span className="m-sheet__title">Import roster</span>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={handleClose}
              >
                <XIcon size={15} />
              </button>
            </div>

            <div className="m-sheet__body">
              {state === "done" ? (
                <div className="m-import-done">
                  <div className="m-import-done__icon">
                    <CheckIcon size={28} />
                  </div>
                  <p className="m-import-done__title">Roster imported</p>
                  <p className="m-import-done__sub">
                    {file?.name} was processed successfully.
                    <br />
                    New students will appear in the roster shortly.
                  </p>
                </div>
              ) : (
                <>
                  {/* Drop zone */}
                  <div
                    className={`m-dropzone${file ? " m-dropzone--has-file" : ""}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".csv,.xlsx"
                      style={{ display: "none" }}
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    {file ? (
                      <div className="m-dropzone__file">
                        <FileTextIcon size={20} />
                        <span>{file.name}</span>
                        <span className="m-dropzone__size">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ) : (
                      <div className="m-dropzone__prompt">
                        <UploadIcon size={22} />
                        <span>Drop a file or click to browse</span>
                        <span className="m-dropzone__hint">CSV or XLSX</span>
                      </div>
                    )}
                  </div>

                  {/* Format note */}
                  <p className="m-import-note">
                    Required columns:{" "}
                    <code>First Name, Last Name, Email, Program, Standing</code>
                    <br />
                    Optional:{" "}
                    <code>Student ID, Status, GPA, Credits</code>
                  </p>

                  {/* Upload progress */}
                  {state === "uploading" && (
                    <div className="m-import-progress">
                      <div className="m-import-progress__bar">
                        <div
                          className="m-import-progress__fill"
                          style={{
                            width: `${Math.min(progress, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="m-import-progress__label">
                        Importing… {Math.min(Math.round(progress), 100)}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="m-sheet__foot">
              {state === "done" ? (
                <button className="m-btn m-btn--primary" onClick={handleClose}>
                  Done
                </button>
              ) : (
                <>
                  <button
                    className="m-btn m-btn--ghost"
                    onClick={handleClose}
                    disabled={state === "uploading"}
                  >
                    Cancel
                  </button>
                  <button
                    className="m-btn m-btn--primary"
                    disabled={!file || state !== "idle"}
                    onClick={handleImport}
                  >
                    {state === "uploading" ? (
                      <><Loader2Icon size={13} className="m-spin" /> Importing…</>
                    ) : (
                      <><UploadIcon size={13} /> Import</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
