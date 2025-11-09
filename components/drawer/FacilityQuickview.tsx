"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Building2, MapPin } from "lucide-react";
import apiClient from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Facility } from "@/types/facility";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FacilityQuickviewProps {
  facility: Facility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityQuickview({ facility, open, onOpenChange }: FacilityQuickviewProps) {
  const router = useRouter();
  const [nearProtectedArea, setNearProtectedArea] = useState(false);
  const [isCheckingProximity, setIsCheckingProximity] = useState(false);

  // Check CPCAD proximity using real spatial data
  useEffect(() => {
    if (!facility) return;

    const checkProximity = async () => {
      setIsCheckingProximity(true);
      try {
        const result = await apiClient.checkCPCADProximity(facility.id, 5);
        setNearProtectedArea(result.near_protected_area);
      } catch (error) {
        console.error("Failed to check CPCAD proximity:", error);
        setNearProtectedArea(false);
      } finally {
        setIsCheckingProximity(false);
      }
    };

    checkProximity();
  }, [facility?.id]);

  if (!facility) return null;

  const formatEmissions = (co2e: number): string => {
    if (co2e >= 1000000) {
      return `${(co2e / 1000000).toFixed(2)}M`;
    }
    return `${(co2e / 1000).toFixed(0)}k`;
  };

  // Calculate trend from co2e_trend array
  const getTrend = () => {
    if (!facility.co2e_trend || facility.co2e_trend.length < 2) return null;
    const last = facility.co2e_trend[facility.co2e_trend.length - 1];
    const previous = facility.co2e_trend[facility.co2e_trend.length - 2];
    const change = ((last - previous) / previous) * 100;
    return change;
  };

  const trend = getTrend();

  // Prepare sparkline data (last 5 years: 2019-2023)
  const sparklineData =
    facility.co2e_trend?.slice(0, 5).map((value, index) => ({
      year: 2019 + index,
      co2e: value / 1000000, // Convert to millions
    })) || [];

  const handleExploreOffsets = () => {
    onOpenChange(false);
    router.push(`/facility/${facility.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <Building2 className="h-6 w-6 mt-1 flex-shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-left">{facility.name}</SheetTitle>
              <SheetDescription className="text-left flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3" />
                {facility.province} • {facility.naics_description}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* OBPS Badge */}
          <div>
            {facility.obps_covered ? (
              <Badge className="bg-blue-500 hover:bg-blue-600">OBPS Covered</Badge>
            ) : (
              <Badge variant="secondary">Voluntary Market</Badge>
            )}
          </div>

          {/* Current Emissions Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">2023 Emissions</span>
                {trend !== null && (
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      trend > 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {trend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(trend).toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold">
                {formatEmissions(facility.co2e_2023)} <span className="text-lg">tCO₂e</span>
              </div>
            </CardContent>
          </Card>

          {/* Emissions Trend Sparkline */}
          {sparklineData.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium mb-3">5-Year Emissions Trend</div>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={sparklineData}>
                    <defs>
                      <linearGradient id="colorCo2e" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)}M tCO₂e`, "Emissions"]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="co2e"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCo2e)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Warning: Proximity to Protected Area */}
          {nearProtectedArea && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Facility is within 5km of a CPCAD protected area. Additional constraints may apply
                to offset projects.
              </AlertDescription>
            </Alert>
          )}

          {/* Info about offset potential */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Offset Potential</div>
              <p className="text-sm">
                {facility.obps_covered
                  ? "This facility can use offset credits for OBPS compliance. Explore suitable sites within your operational area."
                  : "Offset projects can support voluntary carbon neutrality goals for this facility."}
              </p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button onClick={handleExploreOffsets} className="w-full" size="lg">
            Explore Offset Sites
          </Button>

          {/* Facility Details */}
          <div className="pt-4 border-t space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Facility ID</span>
              <span className="font-medium">{facility.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NAICS Code</span>
              <span className="font-medium">{facility.naics_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">
                {facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

