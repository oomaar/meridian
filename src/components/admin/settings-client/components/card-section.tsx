type CardSectionProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClass?: string;
};

export function CardSection({
  title,
  action,
  children,
  bodyClass,
}: CardSectionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">{title}</div>
        {action}
      </div>
      <div className={`m-card__body${bodyClass ? ` ${bodyClass}` : ""}`}>
        {children}
      </div>
    </div>
  );
}
