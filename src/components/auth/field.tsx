"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const POPOVER_CLASSES =
  "p-1 gap-0 w-(--radix-popover-trigger-width) z-[300] m-popover max-h-52 overflow-y-auto";

type FieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
};

export function Field({
  label,
  type = "text",
  defaultValue,
  placeholder,
  name,
  autoComplete,
}: FieldProps) {
  return (
    <label className="m-field">
      <span className="m-field__label">{label}</span>
      <input
        className="m-field__input"
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name?: string;
  defaultValue?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );

  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? selected;

  return (
    <div className="m-field">
      <span className="m-field__label">{label}</span>
      {name && <input type="hidden" name={name} value={selected} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="m-field__input m-field__trigger">
            <span>{selectedLabel}</span>
            <ChevronDownIcon size={14} className="m-field__chevron" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className={POPOVER_CLASSES}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`m-role-option${selected === o.value ? " m-role-option--active" : ""}`}
              onClick={() => {
                setSelected(o.value);
                setOpen(false);
              }}
            >
              <span>{o.label}</span>
              {selected === o.value && (
                <CheckIcon size={12} className="m-role-option__check" />
              )}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
