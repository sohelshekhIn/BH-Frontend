"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PolygonCard } from "./PolygonCard";
import { SuitabilityPolygon } from "@/types/facility";

interface RankedPolygonsListProps {
  polygons: SuitabilityPolygon[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

export function RankedPolygonsList({
  polygons,
  selectedIds,
  onToggleSelect,
}: RankedPolygonsListProps) {
  if (polygons.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <p className="text-muted-foreground mb-2">No suitable sites found</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting the buffer distance or constraint settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-3">
        {polygons.map((polygon) => (
          <PolygonCard
            key={polygon.id}
            polygon={polygon}
            selected={selectedIds.has(polygon.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

