"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface MapLayerControlsProps {
  showConservedAreas: boolean;
  onToggleConservedAreas: (checked: boolean) => void;
  showIndigenousTerritories: boolean;
  onToggleIndigenousTerritories: (checked: boolean) => void;
}

export function MapLayerControls({
  showConservedAreas,
  onToggleConservedAreas,
  showIndigenousTerritories,
  onToggleIndigenousTerritories,
}: MapLayerControlsProps) {
  return (
    <Card className="absolute bottom-4 right-4 z-10 w-64">
      <CardContent className="pt-4 pb-3">
        <h3 className="text-sm font-medium mb-3">Data Layers</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="conserved-areas-cb"
              checked={showConservedAreas}
              onCheckedChange={onToggleConservedAreas}
            />
            <Label
              htmlFor="conserved-areas-cb"
              className="text-sm cursor-pointer flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-600" />
              Conserved Areas
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="indigenous-territories-cb"
              checked={showIndigenousTerritories}
              onCheckedChange={onToggleIndigenousTerritories}
            />
            <Label
              htmlFor="indigenous-territories-cb"
              className="text-sm cursor-pointer flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-sm bg-purple-500/40 border border-purple-600" />
              Indigenous Territories
            </Label>
          </div>

          {/* Legend for other visible layers */}
          <div className="pt-2 mt-2 border-t space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Facility Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border-2 border-blue-500 border-dashed" />
              <span>Analysis Buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500/40 border border-green-600" />
              <span>Suitable Sites</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
