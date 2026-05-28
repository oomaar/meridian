import { FilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type UsersClientTableFilterMenuProps<T> = {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
};

export function UsersClientTableFilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
}: UsersClientTableFilterMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="m-pos-rel">
      <button className="m-filter" onClick={() => setOpen((p) => !p)}>
        <FilterIcon size={12} /> {label}: <b>{selected?.label ?? value}</b>
      </button>
      {open && (
        <div className="m-filter-menu">
          {options.map((o) => (
            <button
              key={o.value}
              className={`m-filter-menu__item${o.value === value ? " m-filter-menu__item--active" : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
