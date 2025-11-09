"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, TrendingUp, Home, DollarSign } from "lucide-react";

interface HumanImpactData {
  jobs_construction: number;
  jobs_maintenance_annual: number;
  total_employment_20yr: number;
  health_benefit_usd_annual: number;
  air_quality_improvement_percent: number;
  community_investment_usd: number;
}

interface HumanImpactGridProps {
  data: HumanImpactData;
}

export function HumanImpactGrid({ data }: HumanImpactGridProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const metrics = [
    {
      icon: Users,
      label: "Construction Jobs",
      value: data.jobs_construction,
      unit: "positions",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Users,
      label: "Annual Maintenance Jobs",
      value: data.jobs_maintenance_annual,
      unit: "positions/year",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: TrendingUp,
      label: "Total Employment (20yr)",
      value: data.total_employment_20yr,
      unit: "job-years",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: Heart,
      label: "Health Benefits",
      value: formatCurrency(data.health_benefit_usd_annual),
      unit: "per year",
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      icon: TrendingUp,
      label: "Air Quality Improvement",
      value: data.air_quality_improvement_percent.toFixed(1),
      unit: "% PM2.5 reduction",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: DollarSign,
      label: "Community Investment",
      value: formatCurrency(data.community_investment_usd),
      unit: "total",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Home className="h-5 w-5" />
          Human & Community Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`${metric.bgColor} rounded-lg p-4 border border-border/50`}
            >
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.unit}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Key Highlights</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Creates <strong>{data.jobs_construction}</strong> construction jobs during project setup
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Generates <strong>{data.jobs_maintenance_annual}</strong> ongoing maintenance positions annually
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Provides <strong>{formatCurrency(data.health_benefit_usd_annual)}</strong> in annual health benefits through improved air quality
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>
                Reduces PM2.5 air pollution by up to <strong>{data.air_quality_improvement_percent.toFixed(1)}%</strong> in local area
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

