type InfoRowProps = { label: string; value: string; mono?: boolean };

export function InfoRow({ label, value, mono }: InfoRowProps) {
  return (
    <div className="m-info-row">
      <span className="m-info-row__label">{label}</span>
      <span className={`m-info-row__value${mono ? " m-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
