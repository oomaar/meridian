import { Dispatch, SetStateAction } from "react";
import type { FileTabState } from "../grading-client";
import type { FileTab } from "../types/FileTab";

type GradingClientViewModalBodyProps = {
  fileTabState: FileTabState;
  setFileTabState: Dispatch<SetStateAction<FileTabState>>;
  fileTabs: FileTab[] | null;
  textContent: string;
};

export function GradingClientViewModalBody({
  fileTabState,
  setFileTabState,
  fileTabs,
  textContent,
}: GradingClientViewModalBodyProps) {
  return (
    <div className="m-grading-view-modal__body">
      {fileTabs ? (
        <>
          <div className="m-grading-filetabs">
            {fileTabs.map((tab, i) => (
              <button
                key={tab.name}
                className={`m-grading-filetab${i === fileTabState.modalFileTab ? " m-grading-filetab--active" : ""}`}
                onClick={() =>
                  setFileTabState((prev) => ({
                    ...prev,
                    modalFileTab: i,
                  }))
                }
              >
                {tab.name}
              </button>
            ))}
          </div>
          <pre className="m-grading-code m-grading-code--modal">
            {fileTabs[fileTabState.modalFileTab].content}
          </pre>
        </>
      ) : (
        <div className="m-grading-text m-grading-text--modal">
          {textContent}
        </div>
      )}
    </div>
  );
}
