"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MapControlsProps {
  showConservedAreas: boolean;
  onToggleConservedAreas: (checked: boolean) => void;
  showIndigenousTerritories?: boolean;
  onToggleIndigenousTerritories?: (checked: boolean) => void;
}

export function MapControls({
  showConservedAreas,
  onToggleConservedAreas,
  showIndigenousTerritories,
  onToggleIndigenousTerritories,
}: MapControlsProps) {
  return (
    <div className="absolute bottom-20 left-4 z-10 bg-background/95 backdrop-blur rounded-lg shadow-lg p-3 border">
      <div className="space-y-2">
        <h3 className="text-sm font-medium mb-2">Map Layers</h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="conserved-areas"
            checked={showConservedAreas}
            onCheckedChange={onToggleConservedAreas}
          />
          <Label
            htmlFor="conserved-areas"
            className="text-sm cursor-pointer flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-600" />
            Conserved Areas
          </Label>
        </div>

        {onToggleIndigenousTerritories && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="indigenous-territories"
              checked={showIndigenousTerritories}
              onCheckedChange={onToggleIndigenousTerritories}
            />
            <Label
              htmlFor="indigenous-territories"
              className="text-sm cursor-pointer flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-sm bg-purple-500/40 border border-purple-600" />
              Indigenous Territories
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
