"use client";

import { useEffect, useState, useRef } from "react";
import { Layer, Source, useMap, Popup } from "react-map-gl/mapbox";
import { IUCNBatteryIndicator } from "@/components/ui/IUCNBatteryIndicator";

interface ConservedAreasLayerProps {
  visible: boolean;
}

interface PopupInfo {
  longitude: number;
  latitude: number;
  name: string;
  type: string;
  iucn_category?: string;
}

export function ConservedAreasLayer({ visible }: ConservedAreasLayerProps) {
  const { current: map } = useMap();
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hover events with delay
  useEffect(() => {
    if (!map || !visible) return;

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["conserved-areas-fill"],
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

          // Debug: Log all properties to see what IUCN field exists
          console.log("🔍 Conserved area properties:", feature.properties);

          setPopupInfo({
            longitude: coordinates.lng,
            latitude: coordinates.lat,
            name:
              feature.properties?.NAME_E ||
              feature.properties?.name ||
              "Protected Area",
            type:
              feature.properties?.TYPE_E ||
              feature.properties?.type ||
              "Conservation Area",
            iucn_category:
              feature.properties?.IUCN_CAT || feature.properties?.iucn_category,
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
    map.on("mouseleave", "conserved-areas-fill", handleMouseLeave);

    return () => {
      map.off("mousemove", handleMouseMove);
      map.off("mouseleave", "conserved-areas-fill", handleMouseLeave);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [map, visible]);

  // Debug logging with detailed URL information
  useEffect(() => {
    if (!map || !visible) return;

    const tilesetUrl = "mapbox://sohelshekh12.conserved-area-tiles";
    console.log("🗺️ ConservedAreasLayer mounted");
    console.log("📍 Tileset URL:", tilesetUrl);
    console.log("🔍 Expected source-layer name: conserved_area");

    const handleSourceData = (e: mapboxgl.MapSourceDataEvent) => {
      if (e.sourceId === "conserved-areas") {
        console.log("✅ Conserved areas source data loaded:", {
          sourceId: e.sourceId,
          isSourceLoaded: e.isSourceLoaded,
          tile: e.tile,
        });
        const source = map.getSource("conserved-areas");
        if (source) {
          console.log("📦 Source loaded successfully");
        }
      }
    };

    const handleError = (e: mapboxgl.ErrorEvent) => {
      if (e.error?.message?.includes("conserved-area")) {
        console.error("❌ Conserved areas error:", {
          message: e.error.message,
          url: tilesetUrl,
          suggestion:
            "Verify tileset exists in Mapbox Studio at https://studio.mapbox.com/tilesets/",
        });
      }
    };

    map.on("sourcedata", handleSourceData);
    map.on("error", handleError);

    // Check source after delay
    setTimeout(() => {
      const source = map.getSource("conserved-areas");
      if (source) {
        console.log("✅ Source registered:", source);
      } else {
        console.warn(
          "⚠️ Source not found - tileset may not exist or URL is incorrect"
        );
        console.log("💡 Try these steps:");
        console.log("   1. Visit https://studio.mapbox.com/tilesets/");
        console.log("   2. Find your conserved areas tileset");
        console.log("   3. Copy the exact Tileset ID");
        console.log("   4. Update the URL in ConservedAreasLayer.tsx");
      }
    }, 2000);

    return () => {
      map.off("sourcedata", handleSourceData);
      map.off("error", handleError);
    };
  }, [map, visible]);

  if (!visible) return null;

  // Use published tileset format with your tileset ID
  const tilesetUrl = "mapbox://sohelshekh12.conserved-area-tiles";

  return (
    <Source id="conserved-areas" type="vector" url={tilesetUrl}>
      <Layer
        id="conserved-areas-fill"
        type="fill"
        source-layer="conserved_area"
        paint={{
          "fill-color": "#10b981", // emerald-500 for protected areas
          "fill-opacity": 0.3,
          "fill-outline-color": "#059669", // emerald-600
        }}
        minzoom={0}
        maxzoom={22}
      />
      <Layer
        id="conserved-areas-line"
        type="line"
        source-layer="conserved_area"
        paint={{
          "line-color": "#059669", // emerald-600
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
          className="conserved-area-popup"
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-1 text-emerald-700">
              {popupInfo.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Type:</span> {popupInfo.type}
            </p>
            {popupInfo.iucn_category && (
              <div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">IUCN Category:</span>{" "}
                  {popupInfo.iucn_category}
                </p>
                <IUCNBatteryIndicator category={popupInfo.iucn_category} />
              </div>
            )}
          </div>
        </Popup>
      )}
    </Source>
  );
}
