"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Card, CardContent } from "@/components/ui/card";
import { MAPBOX_TOKEN } from "@/lib/mapbox-config";

interface MapProjectionProps {
  facility: {
    latitude: number;
    longitude: number;
    name: string;
  };
  sites: Array<{
    id: string;
    center: [number, number];
    area_ha: number;
  }>;
}

export function MapProjection({ facility, sites }: MapProjectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Validate coordinates outside useEffect for legend/summary
  const validFacilityCoords = 
    !isNaN(facility.longitude) && 
    !isNaN(facility.latitude) &&
    facility.longitude !== 0 &&
    facility.latitude !== 0;

  const validSites = sites.filter(site => 
    !isNaN(site.center[0]) && 
    !isNaN(site.center[1]) &&
    site.center[0] !== 0 &&
    site.center[1] !== 0
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!validFacilityCoords && validSites.length === 0) {
      console.warn("No valid coordinates for map projection");
      return;
    }

    // Calculate bounds to fit facility and all sites
    const bounds = new mapboxgl.LngLatBounds();
    if (validFacilityCoords) {
      bounds.extend([facility.longitude, facility.latitude]);
    }
    validSites.forEach(site => bounds.extend(site.center));

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      accessToken: MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      bounds: bounds,
      fitBoundsOptions: { padding: 60 },
      interactive: false, // Static map for brief
    });

    map.on('load', () => {
      // Add facility marker (only if valid)
      if (validFacilityCoords) {
        const facilityEl = document.createElement('div');
        facilityEl.className = 'w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg';
        new mapboxgl.Marker(facilityEl)
          .setLngLat([facility.longitude, facility.latitude])
          .addTo(map);
      }

      // Add site markers (only valid ones)
      validSites.forEach((site, idx) => {
        const siteEl = document.createElement('div');
        siteEl.className = 'w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-md';
        siteEl.innerHTML = `<span class="text-[10px] font-bold text-white flex items-center justify-center w-full h-full">${idx + 1}</span>`;
        new mapboxgl.Marker(siteEl)
          .setLngLat(site.center)
          .addTo(map);

        // Draw arrow from facility to site (only if facility coords are valid)
        if (validFacilityCoords) {
          map.addSource(`arrow-${site.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [facility.longitude, facility.latitude],
                  site.center
                ]
              }
            }
          });

          map.addLayer({
            id: `arrow-${site.id}`,
            type: 'line',
            source: `arrow-${site.id}`,
            paint: {
              'line-color': '#10b981',
              'line-width': 2,
              'line-dasharray': [2, 2],
              'line-opacity': 0.7
            }
          });
        }
      });

      // Add scale bar
      map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-right');
      
      // Add north arrow (compass)
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: false }), 'top-right');
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [facility, sites, validFacilityCoords, validSites]);

  return (
    <Card className="col-span-full">
      <CardContent className="p-6">
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-lg p-3 shadow-lg">
            <div className="space-y-2 text-xs">
              {validFacilityCoords && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className="font-medium">Facility Location</span>
                </div>
              )}
              {validSites.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <span className="font-medium">Offset Sites ({validSites.length})</span>
                </div>
              )}
              {validFacilityCoords && validSites.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-500 border-dashed"></div>
                  <span className="font-medium">Offset Flow</span>
                </div>
              )}
            </div>
          </div>

          {/* Project Area Summary */}
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-lg p-3 shadow-lg">
            <div className="text-xs">
              <div className="font-semibold mb-1">{facility.name}</div>
              <div className="text-muted-foreground">
                {validSites.length} site{validSites.length !== 1 ? 's' : ''} • {validSites.reduce((sum, s) => sum + s.area_ha, 0).toFixed(0)} ha total
              </div>
              {!validFacilityCoords && (
                <div className="text-amber-600 mt-1">
                  ⚠️ Facility coordinates unavailable
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

