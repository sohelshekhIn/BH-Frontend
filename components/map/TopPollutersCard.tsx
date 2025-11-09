"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Facility } from "@/types/facility";
import apiClient from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface TopPollutersCardProps {
  onFacilitySelect: (facility: Facility) => void;
}

export function TopPollutersCard({ onFacilitySelect }: TopPollutersCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: topPolluters, isLoading } = useQuery({
    queryKey: ["topPolluters"],
    queryFn: () => apiClient.getTopPolluters(5, 2023),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(1)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!topPolluters || topPolluters.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base">Top 5 Polluters</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!isCollapsed && (
          <CardDescription className="text-xs">
            Highest CO2e emissions in Canada (2023)
          </CardDescription>
        )}
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-1">
          {topPolluters.map((facility, index) => (
            <Button
              key={facility.id}
              variant="ghost"
              className="w-full justify-start h-auto py-2 px-3"
              onClick={() => onFacilitySelect(facility)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-destructive">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">
                    {facility.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {facility.province} • {formatEmissions(facility.co2e_2023)}{" "}
                    tCO₂e
                  </div>
                </div>
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              </div>
            </Button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
