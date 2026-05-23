type ImportRosterUploadingStateProps = {
  progress: number;
};

export function ImportRosterUploadingState({
  progress,
}: ImportRosterUploadingStateProps) {
  return (
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
  );
}
