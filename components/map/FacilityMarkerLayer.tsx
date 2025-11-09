"use client";

import { Source, Layer } from "react-map-gl/mapbox";

interface FacilityMarkerLayerProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function FacilityMarkerLayer({
  latitude,
  longitude,
  name,
}: FacilityMarkerLayerProps) {
  const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name,
        },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    ],
  };

  return (
    <Source id="facility-marker" type="geojson" data={geojson}>
      <Layer
        id="facility-marker-circle"
        type="circle"
        paint={{
          "circle-radius": 8,
          "circle-color": "#ef4444",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        }}
      />
      <Layer
        id="facility-marker-label"
        type="symbol"
        layout={{
          "text-field": ["get", "name"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        }}
        paint={{
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        }}
      />
    </Source>
  );
}
