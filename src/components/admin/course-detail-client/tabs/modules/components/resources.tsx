import type { AdminResourceDTO } from "@/fake-db/dashboards";
import {
  CheckIcon,
  DownloadIcon,
  FileIcon,
  Loader2Icon,
  UploadIcon,
} from "lucide-react";
import { useRef, useState } from "react";

type ResourcesProps = {
  resources: AdminResourceDTO[];
};

export function Resources({ resources }: ResourcesProps) {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">(
    "idle",
  );
  const [uploadedRes, setUploadedRes] = useState<
    { name: string; size: string; uploaded: string }[]
  >([]);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState("uploading");
    setTimeout(() => {
      const kb = file.size / 1024;
      const sizeLabel =
        kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
      setUploadedRes((prev) => [
        { name: file.name, size: sizeLabel, uploaded: "just now" },
        ...prev,
      ]);
      setUploadState("done");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setUploadState("idle"), 1400);
    }, 1200);
  }

  const allResources = [...uploadedRes, ...resources];

  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Resources</span>
        <span className="m-card__sub">files &amp; attachments</span>
      </div>
      <div className="m-card__body">
        <div className="m-stack m-gap-8">
          {allResources.map((r, i) => (
            <div key={`${r.name}-${i}`} className="m-resource-item">
              <FileIcon size={14} className="m-text-3 m-shrink-0" />
              <div className="m-resource-item__body">
                <div className="m-resource-item__name">{r.name}</div>
                <div className="m-resource-item__meta m-mono">
                  {r.size} · uploaded {r.uploaded}
                </div>
              </div>
              <DownloadIcon size={14} className="m-text-3 m-shrink-0" />
            </div>
          ))}

          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="m-btn m-mt-4"
            disabled={uploadState === "uploading"}
            onClick={() => fileRef.current?.click()}
          >
            {uploadState === "idle" && (
              <>
                <UploadIcon size={14} /> Upload resource
              </>
            )}
            {uploadState === "uploading" && (
              <>
                <Loader2Icon size={14} className="m-spin" /> Uploading…
              </>
            )}
            {uploadState === "done" && (
              <>
                <CheckIcon size={14} /> Uploaded!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
