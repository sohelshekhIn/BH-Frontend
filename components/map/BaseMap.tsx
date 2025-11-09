"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Map, {
  MapRef,
  NavigationControl,
  ScaleControl,
  ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MAPBOX_TOKEN,
  MAP_STYLES,
  MapStyle,
  CANADA_CENTER,
  CANADA_ZOOM,
} from "@/lib/mapbox-config";
import "mapbox-gl/dist/mapbox-gl.css";

interface BaseMapProps {
  children?: React.ReactNode;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  onMapLoad?: (map: mapboxgl.Map) => void;
  onViewportChange?: (
    bounds: [number, number, number, number],
    zoom: number
  ) => void;
  className?: string;
}

export function BaseMap({
  children,
  initialViewState,
  onMapLoad,
  onViewportChange,
  className = "w-full h-full",
}: BaseMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");

  const defaultViewState = {
    longitude: CANADA_CENTER[0],
    latitude: CANADA_CENTER[1],
    zoom: CANADA_ZOOM,
  };

  useEffect(() => {
    if (mapRef.current && onMapLoad) {
      const map = mapRef.current.getMap();
      if (map) {
        onMapLoad(map);
      }
    }
  }, [onMapLoad]);

  const handleMoveEnd = useCallback(() => {
    if (mapRef.current && onViewportChange) {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      const bbox: [number, number, number, number] = [
        bounds?.getWest() || 0,
        bounds?.getSouth() || 0,
        bounds?.getEast() || 0,
        bounds?.getNorth() || 0,
      ];

      onViewportChange(bbox, zoom);
    }
  }, [onViewportChange]);

  return (
    <div className={`relative ${className}`}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewState || defaultViewState}
        mapStyle={MAP_STYLES[mapStyle]}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onMoveEnd={handleMoveEnd}
      >
        {/* Map Style Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <Select
            value={mapStyle}
            onValueChange={(value) => setMapStyle(value as MapStyle)}
          >
            <SelectTrigger className="w-[140px] bg-background/95 backdrop-blur">
              <SelectValue placeholder="Map style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="topo">Topographic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Controls */}
        <NavigationControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {children}
      </Map>
    </div>
  );
}
