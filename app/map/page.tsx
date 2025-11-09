"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BaseMap } from "@/components/map/BaseMap";
import { FacilityLayer } from "@/components/map/FacilityLayer";
import { ConservedAreasLayer } from "@/components/map/ConservedAreasLayer";
import { IndigenousTerritoryLayer } from "@/components/map/IndigenousTerritoryLayer";
import { MapControls } from "@/components/map/MapControls";
import { FacilitySearch } from "@/components/search/FacilitySearch";
import { TopPollutersCard } from "@/components/map/TopPollutersCard";
import { FacilityQuickview } from "@/components/drawer/FacilityQuickview";
import { DataBar } from "@/components/ui/DataBar";
import { Facility, FacilityMapPoint } from "@/types/facility";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export default function MapPage() {
  const [viewport, setViewport] = useState<{
    bounds: [number, number, number, number];
    zoom: number;
  } | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showConservedAreas, setShowConservedAreas] = useState(false);
  const [showIndigenousTerritories, setShowIndigenousTerritories] =
    useState(false);
  const [protectedAreasCount, setProtectedAreasCount] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Use React Query for facilities data with caching
  const {
    data: facilities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facilities", viewport?.bounds, viewport?.zoom],
    queryFn: async () => {
      if (!viewport) return [];
      return apiClient.getFacilitiesInViewport({
        bounds: viewport.bounds,
        zoom: viewport.zoom,
      });
    },
    enabled: !!viewport, // Only run query when viewport is set
    staleTime: 60 * 1000, // Data is fresh for 60 seconds
  });

  // React Query for protected areas when conserved areas layer is visible
  const { data: protectedAreas = [] } = useQuery({
    queryKey: ["protectedAreas", viewport?.bounds, showConservedAreas],
    queryFn: async () => {
      if (!viewport || !showConservedAreas) return [];
      return apiClient.getProtectedAreas(viewport.bounds);
    },
    enabled: !!viewport && showConservedAreas,
    staleTime: 60 * 1000,
  });

  // Update protected areas count when data changes
  useEffect(() => {
    setProtectedAreasCount(protectedAreas.length);
  }, [protectedAreas]);

  const handleViewportChange = useCallback(
    (bounds: [number, number, number, number], zoom: number) => {
      // At extreme zoom out (< 3), don't make API calls
      // The entire world is visible, too much data to display meaningfully
      if (zoom < 3) {
        setViewport(null); // Clear facilities at extreme zoom
        return;
      }

      // Debounce viewport changes to avoid excessive API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setViewport({ bounds, zoom });
      }, 400); // 400ms debounce
    },
    []
  );

  // Show error toast if query fails
  if (error) {
    toast.error("Failed to load facilities", {
      description: "Unable to load facilities in this area.",
    });
  }

  const handleFacilitySelect = async (
    facility: FacilityMapPoint | Facility
  ) => {
    // Fly to facility location with animation
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [facility.longitude, facility.latitude],
        zoom: 12,
        duration: 2000, // 2 second animation
        essential: true,
      });
    }

    // If it's a lightweight FacilityMapPoint, fetch full details
    if (!("emissions_history" in facility)) {
      try {
        const fullFacility = await apiClient.getFacility(facility.id);
        setSelectedFacility(fullFacility);
      } catch (error) {
        console.error("Failed to load facility details:", error);
        toast.error("Failed to load facility details");
        return;
      }
    } else {
      setSelectedFacility(facility as Facility);
    }
    setDrawerOpen(true);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Search Bar and Top Polluters - Top Left */}
      <div className="absolute top-4 left-4 z-20 max-w-md w-full space-y-2">
        <FacilitySearch onFacilitySelect={handleFacilitySelect} />
        <TopPollutersCard onFacilitySelect={handleFacilitySelect} />
      </div>

      {/* Map */}
      <BaseMap
        className="w-full h-full"
        onMapLoad={(map) => (mapRef.current = map)}
        onViewportChange={handleViewportChange}
      >
        <ConservedAreasLayer visible={showConservedAreas} />
        <IndigenousTerritoryLayer visible={showIndigenousTerritories} />
        <FacilityLayer
          facilities={facilities}
          onFacilityClick={handleFacilitySelect}
        />
      </BaseMap>

      {/* Map Controls */}
      <MapControls
        showConservedAreas={showConservedAreas}
        onToggleConservedAreas={setShowConservedAreas}
        showIndigenousTerritories={showIndigenousTerritories}
        onToggleIndigenousTerritories={setShowIndigenousTerritories}
      />

      {/* Facility Quickview Drawer */}
      <FacilityQuickview
        facility={selectedFacility}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Bottom Data Bar */}
      <DataBar
        selectedFacilityCo2e={selectedFacility?.co2e_2023}
        protectedAreasInView={protectedAreasCount}
        avgSuitability={undefined} // Will be populated when suitability layer is active
        totalBufferArea={undefined} // Will be populated when suitability layer is active
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur p-4 rounded-lg shadow-lg z-30">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Loading facilities...</span>
          </div>
        </div>
      )}
    </div>
  );
}
