"use client";

import { useEffect, useState } from "react";
import { Layer, Source, Popup, useMap } from "react-map-gl/mapbox";
import { Facility, FacilityMapPoint } from "@/types/facility";
import { getEmissionColor, getEmissionRadius } from "@/lib/mapbox-config";
import { Badge } from "@/components/ui/badge";

interface FacilityLayerProps {
  facilities: FacilityMapPoint[] | Facility[];
  onFacilityClick?: (facility: FacilityMapPoint | Facility) => void;
}

export function FacilityLayer({ facilities, onFacilityClick }: FacilityLayerProps) {
  const { current: map } = useMap();
  const [hoveredFacility, setHoveredFacility] = useState<FacilityMapPoint | Facility | null>(null);
  const [popupInfo, setPopupInfo] = useState<{ facility: FacilityMapPoint | Facility; x: number; y: number } | null>(
    null
  );

  // Handle map events
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: any) => {
      // Check if cluster was clicked
      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      
      if (clusterFeatures.length > 0) {
        const clusterId = clusterFeatures[0].properties?.cluster_id;
        const source = map.getSource('facilities') as mapboxgl.GeoJSONSource;
        
        if (source && 'getClusterExpansionZoom' in source) {
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom === null) return;
            
            const coordinates = (clusterFeatures[0].geometry as any).coordinates;
            map.easeTo({
              center: coordinates,
              zoom: zoom,
              duration: 500
            });
          });
        }
        return;
      }
      
      // Check if individual facility was clicked
      const facilityFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['facilities-circles']
      });
      
      if (facilityFeatures.length > 0 && onFacilityClick) {
        const feature = facilityFeatures[0];
        const facility = facilities.find((f) => f.id === feature.properties?.id);
        if (facility) {
          onFacilityClick(facility);
        }
      }
    };

    const handleMouseEnter = (e: any) => {
      // Check clusters first
      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      
      if (clusterFeatures.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        return;
      }
      
      // Then check individual facilities
      const facilityFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['facilities-circles']
      });
      
      if (facilityFeatures.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const feature = facilityFeatures[0];
        const facility = facilities.find((f) => f.id === feature.properties?.id);
        if (facility) {
          setHoveredFacility(facility);
        }
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      setHoveredFacility(null);
    };

    // Add event listeners
    map.on('click', handleClick);
    map.on('mouseenter', 'clusters', handleMouseEnter);
    map.on('mouseenter', 'facilities-circles', handleMouseEnter);
    map.on('mouseleave', 'clusters', handleMouseLeave);
    map.on('mouseleave', 'facilities-circles', handleMouseLeave);

    // Cleanup
    return () => {
      map.off('click', handleClick);
      map.off('mouseenter', 'clusters', handleMouseEnter);
      map.off('mouseenter', 'facilities-circles', handleMouseEnter);
      map.off('mouseleave', 'clusters', handleMouseLeave);
      map.off('mouseleave', 'facilities-circles', handleMouseLeave);
    };
  }, [map, facilities, onFacilityClick]);

  // Convert facilities to GeoJSON
  const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: facilities.map((facility) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [facility.longitude, facility.latitude],
      },
      properties: {
        id: facility.id,
        name: facility.name,
        co2e: facility.co2e_2023,
        province: facility.province,
        color: getEmissionColor(facility.co2e_2023),
        radius: getEmissionRadius(facility.co2e_2023),
      },
    })),
  };

  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(1)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  return (
    <>
      <Source
        id="facilities"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={8}
        clusterRadius={50}
      >
        {/* Cluster circles */}
        <Layer
          id="clusters"
          type="circle"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#64748b",  // slate-500 (1-9 facilities)
              10,
              "#475569",  // slate-600 (10-49 facilities)
              50,
              "#334155",  // slate-700 (50-99 facilities)
              100,
              "#1e293b"   // slate-800 (100+ facilities)
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              10,
              30,
              50,
              40,
              100,
              50
            ],
            "circle-opacity": 0.8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          }}
        />

        {/* Cluster count labels */}
        <Layer
          id="cluster-count"
          type="symbol"
          filter={["has", "point_count"]}
          layout={{
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          }}
          paint={{
            "text-color": "#ffffff",
          }}
        />

        {/* Individual facility circles */}
        <Layer
          id="facilities-circles"
          type="circle"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-radius": ["get", "radius"],
            "circle-color": ["get", "color"],
            "circle-opacity": 0.7,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.8,
          }}
        />
      </Source>

      {hoveredFacility && (
        <Popup
          longitude={hoveredFacility.longitude}
          latitude={hoveredFacility.latitude}
          closeButton={false}
          closeOnClick={false}
          offset={15}
          className="facility-popup"
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-1">{hoveredFacility.name}</h3>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {hoveredFacility.province}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs"
                style={{ backgroundColor: getEmissionColor(hoveredFacility.co2e_2023) + "20" }}
              >
                {formatEmissions(hoveredFacility.co2e_2023)} tCO₂e
              </Badge>
            </div>
            {"naics_description" in hoveredFacility && (
              <p className="text-xs text-muted-foreground">{hoveredFacility.naics_description}</p>
            )}
          </div>
        </Popup>
      )}
    </>
  );
}

