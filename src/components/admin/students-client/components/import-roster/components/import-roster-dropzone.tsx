import { FileTextIcon, UploadIcon } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";

type ImportRosterDropzoneProps = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export function ImportRosterDropzone({
  file,
  setFile,
}: ImportRosterDropzoneProps) {
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

  return (
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
  );
}
