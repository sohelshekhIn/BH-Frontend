"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EmissionDetailRow {
  year: number;
  facility_emissions: number;
  offset_credits: number;
  net_emissions: number;
  cumulative_offset: number;
  progress_to_net_zero: number;
}

interface EmissionsDetailGridProps {
  data: EmissionDetailRow[];
}

export function EmissionsDetailGrid({ data }: EmissionsDetailGridProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  // Show every 5 years for better readability
  const filteredData = data.filter((_, idx) => idx % 5 === 0 || idx === data.length - 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-emerald-600" />
          20-Year Emissions Trajectory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Year</TableHead>
                <TableHead className="font-semibold text-right">Facility Emissions</TableHead>
                <TableHead className="font-semibold text-right">Offset Credits</TableHead>
                <TableHead className="font-semibold text-right">Net Emissions</TableHead>
                <TableHead className="font-semibold text-right">Cumulative Offset</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.year}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatNumber(row.facility_emissions)} tCO₂e
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium">
                    {formatNumber(row.offset_credits)} tCO₂e
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(row.net_emissions)} tCO₂e
                  </TableCell>
                  <TableCell className="text-right text-blue-600 font-medium">
                    {formatNumber(row.cumulative_offset)} tCO₂e
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={row.progress_to_net_zero} 
                        className="h-2 flex-1"
                        indicatorColor="#10b981"
                      />
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {row.progress_to_net_zero.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-muted-foreground mb-1">Total Offsets (20yr)</div>
            <div className="text-2xl font-bold text-emerald-600">
              {formatNumber(data[data.length - 1].cumulative_offset)}
            </div>
            <div className="text-xs text-muted-foreground">tCO₂e removed</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-muted-foreground mb-1">Annual Reduction</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(data[0].offset_credits)}
            </div>
            <div className="text-xs text-muted-foreground">tCO₂e per year</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="text-xs text-muted-foreground mb-1">Net Zero Progress</div>
            <div className="text-2xl font-bold text-purple-600">
              {data[data.length - 1].progress_to_net_zero.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">by 2043</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Emissions Reduction Path</h4>
          <p className="text-xs text-muted-foreground">
            This project will offset <strong>{formatNumber(data[0].offset_credits)} tCO₂e</strong> annually,
            accumulating to <strong>{formatNumber(data[data.length - 1].cumulative_offset)} tCO₂e</strong> over
            20 years. This represents <strong>{data[data.length - 1].progress_to_net_zero.toFixed(1)}%</strong> progress
            toward facility net-zero emissions by 2043.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

