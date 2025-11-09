"use client";

import { Source, Layer } from "react-map-gl/mapbox";
import { useMemo } from "react";

interface BufferZoneLayerProps {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export function BufferZoneLayer({
  latitude,
  longitude,
  radiusKm,
}: BufferZoneLayerProps) {
  // Create circle geometry
  const circleGeoJSON = useMemo(() => {
    const points = 64;
    const coords: number[][] = [];
    const kmToDegreesLat = 1 / 111.32;
    const kmToDegreesLng = 1 / (111.32 * Math.cos((latitude * Math.PI) / 180));

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusKm * Math.cos(angle) * kmToDegreesLng;
      const dy = radiusKm * Math.sin(angle) * kmToDegreesLat;
      coords.push([longitude + dx, latitude + dy]);
    }

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Polygon" as const,
            coordinates: [coords],
          },
        },
      ],
    };
  }, [latitude, longitude, radiusKm]);

  return (
    <Source id="buffer-zone" type="geojson" data={circleGeoJSON}>
      <Layer
        id="buffer-zone-fill"
        type="fill"
        paint={{
          "fill-color": "#3b82f6",
          "fill-opacity": 0.05,
        }}
      />
      <Layer
        id="buffer-zone-outline"
        type="line"
        paint={{
          "line-color": "#3b82f6",
          "line-width": 2,
          "line-dasharray": [4, 2],
          "line-opacity": 0.6,
        }}
      />
    </Source>
  );
}
