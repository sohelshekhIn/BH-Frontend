"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DataBarProps {
  selectedFacilityCo2e?: number;
  protectedAreasInView?: number;
  avgSuitability?: number;
  totalBufferArea?: number;
}

export function DataBar({
  selectedFacilityCo2e,
  protectedAreasInView = 0,
  avgSuitability,
  totalBufferArea,
}: DataBarProps) {
  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(2)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-10 rounded-none border-t border-x-0 border-b-0 bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around px-4 py-3 gap-4">
        {/* Selected Facility CO2e */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Selected Facility:</span>
          <Badge variant={selectedFacilityCo2e ? "default" : "secondary"}>
            {selectedFacilityCo2e ? `${formatEmissions(selectedFacilityCo2e)} tCO₂e (2023)` : "None"}
          </Badge>
        </div>

        {/* Protected Areas in View */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Protected Areas:</span>
          <Badge variant="outline">{protectedAreasInView}</Badge>
        </div>

        {/* Average Suitability Score */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Avg Suitability:</span>
          <Badge variant="outline">
            {avgSuitability !== undefined ? avgSuitability.toFixed(2) : "—"}
          </Badge>
        </div>

        {/* Total Buffer Area */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Buffer Area:</span>
          <Badge variant="outline">
            {totalBufferArea !== undefined ? `${totalBufferArea.toFixed(1)} km²` : "—"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

