"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProjectType } from "@/types/facility";
import { PROJECT_TYPES } from "@/lib/constants";

interface ProjectTypeSelectorProps {
  value: ProjectType;
  onChange: (value: ProjectType) => void;
}

export function ProjectTypeSelector({ value, onChange }: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Project Type</label>
      <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as ProjectType)}>
        {PROJECT_TYPES.map((type) => (
          <ToggleGroupItem
            key={type.value}
            value={type.value}
            className="flex-1 gap-2"
            aria-label={type.label}
          >
            <span className="text-lg">{type.icon}</span>
            <span>{type.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

