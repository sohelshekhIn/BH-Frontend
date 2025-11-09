"use client";

import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { EmissionsData } from "@/types/facility";

interface EmissionsTrendCardProps {
  data: EmissionsData[];
}

export function EmissionsTrendCard({ data }: EmissionsTrendCardProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate overall trend
  const firstYear = data[0];
  const lastYear = data[data.length - 1];
  const overallChange = ((lastYear.co2e - firstYear.co2e) / firstYear.co2e) * 100;

  // Format data for chart
  const chartData = data.map((d) => ({
    year: d.year,
    co2e: d.co2e / 1000000, // Convert to millions
    yoyChange: d.yoy_change,
  }));

  const formatEmissions = (value: number) => `${value.toFixed(2)}M tCO₂e`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Emissions Trend</CardTitle>
            <CardDescription>Historical CO₂e emissions by year</CardDescription>
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              overallChange > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {overallChange > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(overallChange).toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCo2e" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}M`}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="font-semibold mb-1">Year {data.year}</div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Emissions</div>
                        <div className="font-medium">{formatEmissions(data.co2e)}</div>
                      </div>
                      {data.yoyChange !== undefined && data.yoyChange !== null && (
                        <div className="text-sm mt-2">
                          <div className="text-muted-foreground">YoY Change</div>
                          <div
                            className={`font-medium ${
                              data.yoyChange > 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {data.yoyChange > 0 ? "+" : ""}
                            {data.yoyChange.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="co2e"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCo2e)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Show anomalies if any */}
        <div className="mt-4 flex flex-wrap gap-2">
          {data
            .filter((d) => d.is_anomaly)
            .map((d) => (
              <Tooltip key={d.year}>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {d.year} Anomaly
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Emissions significantly different from peer facilities</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

