"use client";

import { Source, Layer, useMap } from "react-map-gl/mapbox";
import { useEffect, useMemo } from "react";
import { SuitabilityPolygon } from "@/types/facility";
import { getSuitabilityColor } from "@/lib/mapbox-config";

interface SuitabilityPolygonsLayerProps {
  polygons: SuitabilityPolygon[];
  selectedIds: Set<string>;
  onPolygonClick?: (polygon: SuitabilityPolygon) => void;
}

export function SuitabilityPolygonsLayer({
  polygons,
  selectedIds,
  onPolygonClick,
}: SuitabilityPolygonsLayerProps) {
  const { current: map } = useMap();

  // Convert polygons to GeoJSON
  const geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = useMemo(
    () => ({
      type: "FeatureCollection",
      features: polygons.map((polygon) => ({
        type: "Feature",
        properties: {
          id: polygon.id,
          suitability: polygon.suitability_score,
          area_ha: polygon.area_ha,
          credits: polygon.est_credits_mid,
          selected: selectedIds.has(polygon.id),
          color: getSuitabilityColor(polygon.suitability_score),
        },
        geometry: polygon.geometry as GeoJSON.Polygon,
      })),
    }),
    [polygons, selectedIds]
  );

  // Handle map clicks
  useEffect(() => {
    if (!map || !onPolygonClick) return;

    const handleClick = (e: any) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["suitability-polygons-fill"],
      });

      if (features.length > 0) {
        const feature = features[0];
        const polygon = polygons.find((p) => p.id === feature.properties?.id);
        if (polygon) {
          onPolygonClick(polygon);
        }
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", handleClick);
    map.on("mouseenter", "suitability-polygons-fill", handleMouseEnter);
    map.on("mouseleave", "suitability-polygons-fill", handleMouseLeave);

    return () => {
      map.off("click", handleClick);
      map.off("mouseenter", "suitability-polygons-fill", handleMouseEnter);
      map.off("mouseleave", "suitability-polygons-fill", handleMouseLeave);
    };
  }, [map, polygons, onPolygonClick]);

  return (
    <Source id="suitability-polygons" type="geojson" data={geojson}>
      {/* Fill layer */}
      <Layer
        id="suitability-polygons-fill"
        type="fill"
        paint={{
          "fill-color": ["get", "color"],
          "fill-opacity": [
            "case",
            ["get", "selected"],
            0.5, // Higher opacity for selected
            0.3, // Lower opacity for unselected
          ],
        }}
      />

      {/* Outline layer */}
      <Layer
        id="suitability-polygons-outline"
        type="line"
        paint={{
          "line-color": [
            "case",
            ["get", "selected"],
            "#ffffff", // White outline for selected
            ["get", "color"], // Matching color for unselected
          ],
          "line-width": [
            "case",
            ["get", "selected"],
            3, // Thicker for selected
            1.5,
          ],
          "line-opacity": 0.8,
        }}
      />
    </Source>
  );
}
