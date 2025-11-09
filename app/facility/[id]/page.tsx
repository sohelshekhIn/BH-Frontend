"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmissionsTrendCard } from "@/components/facility/EmissionsTrendCard";
import { NPRICoPollutantsCard } from "@/components/facility/NPRICoPollutantsCard";
import { OBPSStatusBanner } from "@/components/facility/OBPSStatusBanner";
import { RegulatoryContextCard } from "@/components/facility/RegulatoryContextCard";
import { DisturbedLandCard } from "@/components/facility/DisturbedLandCard";
import { FacilityDetail } from "@/types/facility";
import apiClient from "@/lib/api";
import { toast } from "sonner";

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const facilityId = params.id as string;

  const [facility, setFacility] = useState<FacilityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (facilityId) {
      loadFacility();
    }
  }, [facilityId]);

  const loadFacility = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getFacility(facilityId);
      setFacility(data);
    } catch (error) {
      console.error("Failed to load facility:", error);
      toast.error("Failed to load facility details", {
        description: "Please try again or return to the map.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(2)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  const handleExploreOffsets = () => {
    if (facility) {
      router.push(`/credit-builder?facility=${facility.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[350px]" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[300px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Facility Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The facility you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/map")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/map")}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Button>
              <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">{facility.id}</Badge>
                <Badge variant="outline">{facility.province}</Badge>
                <Badge variant="outline">
                  NAICS {facility.naics_code} - {facility.naics_description}
                </Badge>
                {facility.obps_covered && <Badge className="bg-blue-500">OBPS Covered</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">2023 Emissions</div>
              <div className="text-3xl font-bold">
                {formatEmissions(facility.co2e_2023)}{" "}
                <span className="text-lg font-normal text-muted-foreground">tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column (60%) */}
          <div className="lg:col-span-3 space-y-6">
            <EmissionsTrendCard data={facility.emissions_history} />
            <NPRICoPollutantsCard data={facility.pollutants} />
          </div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <OBPSStatusBanner status={facility.obps_status} />
            <RegulatoryContextCard
              context={facility.regulatory_context}
              facilityId={facility.id}
            />

            {/* Disturbed Land Assessment with Satellite Imagery */}
            <DisturbedLandCard
              facilityName={facility.name}
              latitude={facility.latitude}
              longitude={facility.longitude}
            />
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 mt-8 py-4 bg-background/95 backdrop-blur border-t">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => {
              const data = JSON.stringify(facility, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${facility.id}_profile.json`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Facility profile exported");
            }}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Facility Profile
            </Button>
            <Button size="lg" onClick={handleExploreOffsets}>
              Explore Offset Sites
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

