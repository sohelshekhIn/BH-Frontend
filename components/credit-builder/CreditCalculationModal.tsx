"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProjectType } from "@/types/facility";
import { CREDIT_DEFAULTS } from "@/lib/constants";

interface CreditCalculationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaHa: number;
  projectType: ProjectType;
}

export function CreditCalculationModal({
  open,
  onOpenChange,
  areaHa,
  projectType,
}: CreditCalculationModalProps) {
  const defaults = CREDIT_DEFAULTS[projectType];

  const [seqFactor, setSeqFactor] = useState<number>(defaults.seq_factor);
  const [permanence, setPermanence] = useState<number>(defaults.permanence);
  const [survival, setSurvival] = useState<number>(defaults.survival);

  const calculateCredits = (
    area: number,
    seq: number,
    perm: number,
    surv: number
  ) => {
    return area * seq * perm * surv * 100; // 100 tCO2e/ha baseline
  };

  const totalCredits = calculateCredits(
    areaHa,
    seqFactor,
    permanence,
    survival
  );

  // Generate sensitivity data (varying survival rate)
  const sensitivityData = [];
  for (let s = 0.5; s <= 1.0; s += 0.05) {
    sensitivityData.push({
      survival: s,
      credits: calculateCredits(areaHa, seqFactor, permanence, s),
    });
  }

  const protocolCitations = {
    reforestation: "Canada Afforestation Protocol v2.1, Section 5.2",
    wetland: "Canada Wetland Restoration Protocol v1.3, Section 4.1",
    grassland: "Canada Grassland Conservation Protocol v1.0, Section 3.5",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Credit Calculation Details</DialogTitle>
          <DialogDescription>
            Adjust parameters to see how they affect credit estimates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formula */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Formula</div>
              <div className="font-mono text-sm bg-muted p-3 rounded">
                Credits = Area × SeqFactor × Permanence × Survival × 100
              </div>
              <div className="mt-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{areaHa.toFixed(1)} ha</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">
                    Sequestration Factor:
                  </span>
                  <span className="font-medium">{seqFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Permanence:</span>
                  <span className="font-medium">{permanence.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Survival Rate:</span>
                  <span className="font-medium">{survival.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-1 text-base font-bold">
                  <span>Total Credits/Year:</span>
                  <span className="text-primary">
                    {totalCredits.toFixed(0)} tCO₂e
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustable Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Sequestration Factor
                </label>
                <span className="text-sm text-muted-foreground">
                  {seqFactor.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[seqFactor]}
                onValueChange={(v) => setSeqFactor(v[0])}
                min={0.5}
                max={1.0}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Carbon sequestration efficiency (species-dependent)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Permanence</label>
                <span className="text-sm text-muted-foreground">
                  {permanence.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[permanence]}
                onValueChange={(v) => setPermanence(v[0])}
                min={0.8}
                max={1.0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Risk of reversal (fire, disease, disturbance)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Survival Rate</label>
                <span className="text-sm text-muted-foreground">
                  {survival.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[survival]}
                onValueChange={(v) => setSurvival(v[0])}
                min={0.5}
                max={1.0}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tree/vegetation survival over project lifetime
              </p>
            </div>
          </div>

          {/* Sensitivity Chart */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium mb-3">
                Sensitivity Analysis: Survival Rate
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="survival"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(0)} tCO₂e`,
                        "Credits",
                      ]}
                      labelFormatter={(label) =>
                        `Survival: ${(label * 100).toFixed(0)}%`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="credits"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Shows how credit estimates change with different survival
                assumptions
              </p>
            </CardContent>
          </Card>

          {/* Protocol Citation */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-sm font-medium mb-2">Protocol Reference</div>
              <p className="text-sm text-muted-foreground">
                {protocolCitations[projectType]}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
