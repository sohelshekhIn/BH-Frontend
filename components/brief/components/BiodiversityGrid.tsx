"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Bird, Trees, Flower2, DollarSign } from "lucide-react";

interface BiodiversityData {
  habitat_area_ha: number;
  native_trees_planted: number;
  wildlife_corridors_km: number;
  pollinator_support_index: number;
  ecosystem_services_usd_annual: number;
}

interface BiodiversityGridProps {
  data: BiodiversityData;
}

export function BiodiversityGrid({ data }: BiodiversityGridProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  const metrics = [
    {
      icon: Trees,
      label: "Habitat Area",
      value: data.habitat_area_ha.toFixed(1),
      unit: "hectares",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: Leaf,
      label: "Native Trees",
      value: formatNumber(data.native_trees_planted),
      unit: "planted",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: Bird,
      label: "Wildlife Corridors",
      value: data.wildlife_corridors_km.toFixed(1),
      unit: "km",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Flower2,
      label: "Pollinator Support",
      value: data.pollinator_support_index.toFixed(0),
      unit: "index score",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      icon: DollarSign,
      label: "Ecosystem Services",
      value: formatCurrency(data.ecosystem_services_usd_annual),
      unit: "per year",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-600" />
          Biodiversity & Ecosystem Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`${metric.bgColor} rounded-lg p-3 border border-border/50 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.unit}</div>
                </div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Ecological Benefits</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Restores <strong>{data.habitat_area_ha.toFixed(0)} ha</strong> of natural habitat
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Establishes <strong>{formatNumber(data.native_trees_planted)}</strong> native trees and plants
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Creates <strong>{data.wildlife_corridors_km.toFixed(1)} km</strong> of wildlife corridors
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Supports pollinators with score of <strong>{data.pollinator_support_index.toFixed(0)}/100</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Provides <strong>{formatCurrency(data.ecosystem_services_usd_annual)}</strong> in annual ecosystem services
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

