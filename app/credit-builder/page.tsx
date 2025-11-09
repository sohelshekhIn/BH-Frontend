"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProjectTypeSelector } from "@/components/credit-builder/ProjectTypeSelector";
import { BufferSlider } from "@/components/credit-builder/BufferSlider";
import { ConstraintPanel } from "@/components/credit-builder/ConstraintPanel";
import { MapLayerControls } from "@/components/credit-builder/MapLayerControls";
import { RankedPolygonsList } from "@/components/credit-builder/RankedPolygonsList";
import { CreditCalculationModal } from "@/components/credit-builder/CreditCalculationModal";
import { BaseMap } from "@/components/map/BaseMap";
import { BufferZoneLayer } from "@/components/map/BufferZoneLayer";
import { SuitabilityPolygonsLayer } from "@/components/map/SuitabilityPolygonsLayer";
import { FacilityMarkerLayer } from "@/components/map/FacilityMarkerLayer";
import { ConservedAreasLayer } from "@/components/map/ConservedAreasLayer";
import { IndigenousTerritoryLayer } from "@/components/map/IndigenousTerritoryLayer";
import {
  Facility,
  ProjectType,
  Constraints,
  SuitabilityPolygon,
} from "@/types/facility";
import { BUFFER_DEFAULT } from "@/lib/constants";
import apiClient from "@/lib/api";
import { toast } from "sonner";

function CreditBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facility");

  const [facility, setFacility] = useState<Facility | null>(null);
  const [projectType, setProjectType] = useState<ProjectType>("reforestation");
  const [bufferKm, setBufferKm] = useState(BUFFER_DEFAULT);
  const [constraints, setConstraints] = useState<Constraints>({
    exclude_cpcad: true,
    water_buffer: false,
    slope_limit: false,
    exclude_infrastructure: false,
    warn_indigenous: true,
  });
  const [polygons, setPolygons] = useState<SuitabilityPolygon[]>([]);
  const [selectedPolygonIds, setSelectedPolygonIds] = useState<Set<string>>(
    new Set()
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorPolygon, setCalculatorPolygon] =
    useState<SuitabilityPolygon | null>(null);
  const [showConservedAreas, setShowConservedAreas] = useState(true);
  const [showIndigenousTerritories, setShowIndigenousTerritories] =
    useState(false);

  // Load facility on mount
  useEffect(() => {
    if (facilityId) {
      loadFacility(facilityId);
    } else {
      toast.error("No facility selected", {
        description: "Please select a facility from the map first.",
      });
      router.push("/map");
    }
  }, [facilityId, router]);

  // Run analysis when parameters change
  useEffect(() => {
    if (facility) {
      runAnalysis();
    }
  }, [facility, projectType, bufferKm, constraints]);

  const loadFacility = async (id: string) => {
    try {
      const data = await apiClient.getFacility(id);
      setFacility(data);
    } catch (error) {
      console.error("Failed to load facility:", error);
      toast.error("Failed to load facility");
    }
  };

  const runAnalysis = async () => {
    if (!facility) return;

    setIsAnalyzing(true);
    try {
      const response = await apiClient.analyzeSuitability({
        facility_id: facility.id,
        buffer_km: bufferKm,
        project_type: projectType,
        constraints,
      });

      setPolygons(response.polygons);
      if (response.polygons.length === 0) {
        toast.info("No suitable sites found", {
          description: "Try adjusting your buffer distance or constraints.",
        });
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to analyze suitability", {
        description: "Please try again with different parameters.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTogglePolygon = (id: string) => {
    setSelectedPolygonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerateBrief = () => {
    if (selectedPolygonIds.size === 0) {
      toast.error("No sites selected", {
        description: "Please select at least one site to generate a brief.",
      });
      return;
    }

    if (!facility) {
      toast.error("Facility data not loaded");
      return;
    }

    // Store data for brief generation
    sessionStorage.setItem("creditBuilderPolygons", JSON.stringify(polygons));
    sessionStorage.setItem("projectType", projectType);
    sessionStorage.setItem("bufferKm", bufferKm.toString());
    
    // Navigate to brief page
    const selectedIdsArray = Array.from(selectedPolygonIds);
    router.push(`/brief?facility=${facility.id}&sites=${selectedIdsArray.join(',')}`);
  };

  const totalEstimatedCredits = polygons
    .filter((p) => selectedPolygonIds.has(p.id))
    .reduce((sum, p) => sum + p.est_credits_mid, 0);

  if (!facility) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-card px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/facility/${facility.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex-1">
              <h1 className="font-semibold text-lg">{facility.name}</h1>
              <p className="text-xs text-muted-foreground">Credit Builder</p>
            </div>

            <ProjectTypeSelector
              value={projectType}
              onChange={setProjectType}
            />

            <BufferSlider value={bufferKm} onChange={setBufferKm} />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                Selected Sites
              </div>
              <Badge
                variant={selectedPolygonIds.size > 0 ? "default" : "secondary"}
              >
                {selectedPolygonIds.size}
              </Badge>
            </div>

            {totalEstimatedCredits > 0 && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Total Est. Credits
                </div>
                <div className="font-semibold">
                  {(totalEstimatedCredits / 1000).toFixed(1)}k tCO₂e/yr
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerateBrief}
              disabled={selectedPolygonIds.size === 0}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Brief
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Map (60%) */}
        <div className="relative flex-[3]">
          {/* Constraint Panel Overlay */}
          <div className="absolute top-4 left-4 z-10 w-80">
            <ConstraintPanel
              constraints={constraints}
              onChange={setConstraints}
            />
          </div>

          {/* Layer Controls */}
          <MapLayerControls
            showConservedAreas={showConservedAreas}
            onToggleConservedAreas={setShowConservedAreas}
            showIndigenousTerritories={showIndigenousTerritories}
            onToggleIndigenousTerritories={setShowIndigenousTerritories}
          />

          <BaseMap
            initialViewState={{
              longitude: facility.longitude,
              latitude: facility.latitude,
              zoom: 10,
            }}
          >
            {/* Facility marker */}
            <FacilityMarkerLayer
              latitude={facility.latitude}
              longitude={facility.longitude}
              name={facility.name}
            />

            {/* Buffer zone circle */}
            <BufferZoneLayer
              latitude={facility.latitude}
              longitude={facility.longitude}
              radiusKm={bufferKm}
            />

            {/* Data overlays */}
            <ConservedAreasLayer visible={showConservedAreas} />
            <IndigenousTerritoryLayer visible={showIndigenousTerritories} />

            {/* Generated suitability polygons */}
            <SuitabilityPolygonsLayer
              polygons={polygons}
              selectedIds={selectedPolygonIds}
              onPolygonClick={(polygon) => handleTogglePolygon(polygon.id)}
            />
          </BaseMap>

          {isAnalyzing && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur p-4 rounded-lg shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Analyzing suitability...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Ranked List (40%) */}
        <div className="flex-[2] border-l bg-muted/30">
          <div className="p-6 h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Ranked Sites</h2>
              <p className="text-sm text-muted-foreground">
                {polygons.length} sites found, sorted by estimated credits
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <RankedPolygonsList
                polygons={polygons}
                selectedIds={selectedPolygonIds}
                onToggleSelect={handleTogglePolygon}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Calculation Modal */}
      {calculatorPolygon && (
        <CreditCalculationModal
          open={showCalculator}
          onOpenChange={setShowCalculator}
          areaHa={calculatorPolygon.area_ha}
          projectType={projectType}
        />
      )}
    </div>
  );
}

export default function CreditBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CreditBuilderContent />
    </Suspense>
  );
}
