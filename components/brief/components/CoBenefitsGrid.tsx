"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Droplet, Mountain, Thermometer, Sparkles } from "lucide-react";

interface CoBenefitsData {
  pm25_reduction_percent: number;
  no2_reduction_percent: number;
  watershed_protection_ha: number;
  runoff_reduction_percent: number;
  soil_carbon_tonnes_annual: number;
  erosion_prevention_tonnes_annual: number;
  local_cooling_celsius: number;
  species_richness_increase_percent: number;
}

interface CoBenefitsGridProps {
  data: CoBenefitsData;
}

export function CoBenefitsGrid({ data }: CoBenefitsGridProps) {
  const categories = [
    {
      title: "Air Quality",
      icon: Wind,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      metrics: [
        {
          label: "PM2.5 Reduction",
          value: `${data.pm25_reduction_percent.toFixed(1)}%`,
        },
        {
          label: "NO₂ Reduction",
          value: `${data.no2_reduction_percent.toFixed(1)}%`,
        },
      ],
    },
    {
      title: "Water Quality",
      icon: Droplet,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
      metrics: [
        {
          label: "Watershed Protection",
          value: `${data.watershed_protection_ha.toFixed(0)} ha`,
        },
        {
          label: "Runoff Reduction",
          value: `${data.runoff_reduction_percent.toFixed(1)}%`,
        },
      ],
    },
    {
      title: "Soil Health",
      icon: Mountain,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      metrics: [
        {
          label: "Soil Carbon",
          value: `${(data.soil_carbon_tonnes_annual / 1000).toFixed(1)}k tCO₂e/yr`,
        },
        {
          label: "Erosion Prevention",
          value: `${(data.erosion_prevention_tonnes_annual / 1000).toFixed(1)}k t/yr`,
        },
      ],
    },
    {
      title: "Climate",
      icon: Thermometer,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      metrics: [
        {
          label: "Local Cooling",
          value: `${data.local_cooling_celsius.toFixed(1)}°C`,
        },
        {
          label: "Species Richness",
          value: `+${data.species_richness_increase_percent.toFixed(0)}%`,
        },
      ],
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Environmental Co-Benefits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className={`${category.bgColor} rounded-lg p-3 border border-border/50`}
            >
              <div className="flex items-center gap-2 mb-2">
                <category.icon className={`h-4 w-4 ${category.color}`} />
                <span className="font-semibold text-sm">{category.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-6">
                {category.metrics.map((metric, mIdx) => (
                  <div key={mIdx}>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="text-lg font-bold">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Key Co-Benefits</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>
                Reduces air pollution by <strong>{data.pm25_reduction_percent.toFixed(1)}% PM2.5</strong> and{" "}
                <strong>{data.no2_reduction_percent.toFixed(1)}% NO₂</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-0.5">✓</span>
              <span>
                Protects <strong>{data.watershed_protection_ha.toFixed(0)} ha</strong> of watershed area and reduces runoff by{" "}
                <strong>{data.runoff_reduction_percent.toFixed(1)}%</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              <span>
                Sequesters <strong>{(data.soil_carbon_tonnes_annual / 1000).toFixed(1)}k tCO₂e</strong> in soil carbon annually
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              <span>
                Prevents <strong>{(data.erosion_prevention_tonnes_annual / 1000).toFixed(1)}k tonnes</strong> of soil erosion per year
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-0.5">✓</span>
              <span>
                Creates local cooling effect of <strong>{data.local_cooling_celsius.toFixed(1)}°C</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Increases species richness by <strong>{data.species_richness_increase_percent.toFixed(0)}%</strong>
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

