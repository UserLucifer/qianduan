import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder, className }: MultiSelectProps) {
  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleUnselect(value);
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1 mb-2">
        {selected.map((val) => {
          const option = options.find((o) => o.value === val);
          return (
            <Badge key={val} variant="secondary" className="flex items-center gap-1 bg-[var(--admin-panel-strong)] text-[var(--admin-text)] border-[var(--admin-border)]">
              {option?.label || val}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(val)}
              >
                <X className="h-3 w-3 text-[var(--admin-muted)]" />
              </button>
            </Badge>
          );
        })}
      </div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="h-9 bg-background text-foreground">
          <SelectValue placeholder={placeholder || "请选择..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {selected.includes(option.value) && <span className="ml-2 text-blue-500">✓</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
