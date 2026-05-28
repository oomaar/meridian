import { useEffect, useRef, useState } from "react";

type CoursesViewsFilterMenuProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
};

export function CoursesViewsFilterMenu({
  label,
  value,
  options,
  onChange,
}: CoursesViewsFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== "all";
  const displayLabel = isActive
    ? (options.find((o) => o.value === value)?.label ?? value)
    : "all";

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="m-filter-wrap">
      <button
        className={`m-filter${isActive ? " m-filter--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}: <b>{displayLabel}</b>
      </button>
      {open && (
        <div className="m-filter-panel">
          <button
            className={`m-filter-panel__opt${value === "all" ? " m-filter-panel__opt--active" : ""}`}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`m-filter-panel__opt${value === opt.value ? " m-filter-panel__opt--active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
