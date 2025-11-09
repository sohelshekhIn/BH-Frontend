"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSatelliteImageUrl } from "@/lib/mapbox-config";

interface DisturbedLandCardProps {
  facilityName: string;
  latitude: number;
  longitude: number;
}

export function DisturbedLandCard({
  facilityName,
  latitude,
  longitude,
}: DisturbedLandCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Zoom 12 shows ~8km x 8km area (more surrounding context than zoom 14)
  // Temporarily disable marker to debug loading issue
  const satelliteUrl = getSatelliteImageUrl(
    latitude,
    longitude,
    12,
    600,
    600,
    false
  );

  // Generate mock metrics based on coordinates (for demo)
  const disturbedHectares = Math.round((Math.abs(latitude * 10) % 50) + 20);
  const tailingsPonds = Math.round((Math.abs(longitude * 10) % 3) + 1);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Disturbed Land Assessment</h3>
          <Badge variant="outline" className="text-xs">
            Sentinel-2
          </Badge>
        </div>

        {/* Satellite Imagery */}
        <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden relative">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="absolute inset-0" />
              <span className="text-xs text-muted-foreground z-10">
                Loading imagery...
              </span>
            </div>
          )}
          {imageError ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center p-4">
              Unable to load satellite imagery
              <br />
              for this location
            </div>
          ) : (
            <img
              src={satelliteUrl}
              alt={`Satellite view of ${facilityName}`}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Overlay indicators */}
          {imageLoaded && (
            <>
              <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs">
                ~8km view
              </div>
              <div className="absolute top-2 left-2 bg-red-500/80 backdrop-blur px-2 py-1 rounded text-xs text-white">
                5km Analysis Buffer
              </div>
            </>
          )}
        </div>

        {/* Analysis Text */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Analysis of tailings ponds and disturbed areas within facility
            buffer. Suitable for repurposing in offset projects.
          </p>

          {/* Demo metrics based on location */}
          <div className="flex gap-2 text-xs flex-wrap">
            <Badge variant="secondary">~{disturbedHectares} ha disturbed</Badge>
            <Badge variant="secondary">
              {tailingsPonds} tailings pond{tailingsPonds > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
