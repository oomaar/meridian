"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "m-field__input m-datepicker-btn",
            !value && "m-datepicker-btn--empty",
            className
          )}
        >
          <CalendarIcon size={13} className="m-datepicker-btn__icon" />
          {value ? format(value, "MMM d, yyyy") : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="m-datepicker-popover" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          defaultMonth={value}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
