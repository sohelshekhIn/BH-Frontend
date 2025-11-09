"use client";

import { useEffect, useState, useRef } from "react";
import { Layer, Source, useMap, Popup } from "react-map-gl/mapbox";

interface IndigenousTerritoryLayerProps {
  visible: boolean;
}

interface PopupInfo {
  longitude: number;
  latitude: number;
  name: string;
  description?: string;
  color?: string;
}

export function IndigenousTerritoryLayer({
  visible,
}: IndigenousTerritoryLayerProps) {
  const { current: map } = useMap();
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hover events with delay
  useEffect(() => {
    if (!map || !visible) return;

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["indigenous-fill"],
      });

      if (features.length > 0) {
        map.getCanvas().style.cursor = "pointer";

        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }

        // Set new timeout for 1 second hover
        hoverTimeoutRef.current = setTimeout(() => {
          const feature = features[0];
          const coordinates = e.lngLat;

          setPopupInfo({
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            name:
              feature.properties?.Name ||
              feature.properties?.name ||
              "Indigenous Territory",
            description:
              feature.properties?.description ||
              feature.properties?.Description,
            color: feature.properties?.color || feature.properties?.Color,
          });
        }, 1000); // 1 second delay
      } else {
        map.getCanvas().style.cursor = "";
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        setPopupInfo(null);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setPopupInfo(null);
    };

    map.on("mousemove", handleMouseMove);
    map.on("mouseleave", "indigenous-fill", handleMouseLeave);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("mouseleave", "indigenous-fill", handleMouseLeave);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [map, visible]);

  // Debug logging
  useEffect(() => {
    if (!map || !visible) return;

    console.log("🏛️ IndigenousTerritoryLayer mounted");
    console.log(
      "📍 Tileset: mapbox://nativeland.4pgB_next_nld_terr_prod_layer"
    );
    console.log("🇨🇦 Filtering to Canada only for performance");

    const handleError = (e: mapboxgl.ErrorEvent) => {
      if (e.error?.message?.includes("nativeland")) {
        console.error("❌ Indigenous territories error:", e.error.message);
      }
    };

    map.on("error", handleError);

    return () => {
      map.off("error", handleError);
    };
  }, [map, visible]);

  if (!visible) return null;

  // Canada bounding box for filtering (performance optimization)
  const canadaBounds: [number, number, number, number] = [-141, 41, -52, 84];

  return (
    <Source
      id="indigenous-territories"
      type="vector"
      url="mapbox://nativeland.4pgB_next_nld_terr_prod_layer"
      bounds={canadaBounds}
    >
      <Layer
        id="indigenous-fill"
        type="fill"
        source-layer="4pgB_next_nld_terr_prod_source_layer"
        paint={{
          "fill-color": "#a855f7", // purple-500
          "fill-opacity": 0.2,
        }}
        minzoom={0}
        maxzoom={22}
      />
      <Layer
        id="indigenous-outline"
        type="line"
        source-layer="4pgB_next_nld_terr_prod_source_layer"
        paint={{
          "line-color": "#9333ea", // purple-600
          "line-width": 1.5,
          "line-opacity": 0.6,
        }}
        minzoom={0}
        maxzoom={22}
      />

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeButton={false}
          closeOnClick={false}
          offset={10}
          className="indigenous-territory-popup"
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-1 text-purple-700">
              {popupInfo.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Indigenous Territory</span>
            </p>
            {popupInfo.description && (
              <p className="text-xs text-muted-foreground mt-2">
                {popupInfo.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 italic">
              Data from Native Land Digital
            </p>
          </div>
        </Popup>
      )}
    </Source>
  );
}
