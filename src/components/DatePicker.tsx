"use client";

import * as React from "react";

// format-date-lib
import { format } from "date-fns";

// icons
import { Calendar as CalendarIcon } from "lucide-react";

// helper
import { cn } from "@/lib/utils";

// components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CustomDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  classNameBtn?: string;
}

const DatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  disabled = false,
  className,
  classNameBtn,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) onChange(selectedDate);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal flex-row-reverse",
              "flex items-center gap-2",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              classNameBtn,
            )}
          >
            <CalendarIcon className="h-4 w-4 opacity-70" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
