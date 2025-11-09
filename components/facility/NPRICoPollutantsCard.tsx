"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PollutantData } from "@/types/facility";

interface NPRICoPollutantsCardProps {
  data: PollutantData;
}

export function NPRICoPollutantsCard({ data }: NPRICoPollutantsCardProps) {
  const pollutants = [
    {
      name: "NOx",
      value: data.nox ?? 0,
      color: "#f59e0b",
      threshold: 1000,
      isReal: data.nox !== null,
    },
    {
      name: "SOx",
      value: data.sox ?? 0,
      color: "#ef4444",
      threshold: 800,
      isReal: data.sox !== null,
    },
    {
      name: "PM2.5",
      value: data.pm25 ?? 0,
      color: "#8b5cf6",
      threshold: 300,
      isReal: data.pm25 !== null,
    },
    {
      name: "VOCs",
      value: data.vocs ?? 0,
      color: "#10b981",
      threshold: 500,
      isReal: data.vocs !== null,
    },
  ].filter((p) => p.value > 0 || p.isReal); // Show if real data exists, even if 0

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NPRI Co-Pollutants</CardTitle>
        <CardDescription>
          Annual emissions of key pollutants (tonnes) -
          {data.nox !== null ||
          data.sox !== null ||
          data.pm25 !== null ||
          data.vocs !== null
            ? "2020 NPRI Data"
            : "Estimated from GHG emissions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollutants} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="font-semibold mb-1">{data.name}</div>
                      <div className="text-sm">
                        <div className="text-muted-foreground">Emissions</div>
                        <div className="font-medium">
                          {data.value.toFixed(0)} tonnes
                        </div>
                      </div>
                      {data.value > data.threshold && (
                        <div className="text-xs text-red-500 mt-1">
                          Above provincial limit ({data.threshold} t)
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {pollutants.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value > entry.threshold ? "#ef4444" : entry.color
                    }
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with thresholds */}
        <div className="mt-4 space-y-2">
          <div className="text-xs text-muted-foreground">
            Provincial Limits (reference)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pollutants.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: p.color }}
                ></div>
                <span>
                  {p.name}: {formatValue(p.threshold)}t
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Co-benefits note */}
        <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
          <p className="text-muted-foreground">
            <strong>Co-benefits:</strong> Reforestation projects can reduce
            local PM2.5 by 15-25% through air filtration (USFS study).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
