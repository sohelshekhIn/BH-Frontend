"use client";

import { AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Constraints } from "@/types/facility";

interface ConstraintPanelProps {
  constraints: Constraints;
  onChange: (constraints: Constraints) => void;
}

export function ConstraintPanel({ constraints, onChange }: ConstraintPanelProps) {
  const handleToggle = (key: keyof Constraints) => {
    onChange({
      ...constraints,
      [key]: !constraints[key],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Site Constraints</CardTitle>
        <CardDescription>Define exclusion and warning criteria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPCAD - Locked On */}
        <div className="flex items-center justify-between opacity-60">
          <div className="flex items-center gap-2">
            <Label htmlFor="cpcad" className="cursor-not-allowed">
              Exclude CPCAD Protected Areas
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Required by law - cannot be disabled</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch id="cpcad" checked={true} disabled />
        </div>

        {/* Water Buffer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="water" className="cursor-pointer">
              Water Buffer (100m)
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Exclude areas within 100m of water bodies</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="water"
            checked={constraints.water_buffer}
            onCheckedChange={() => handleToggle("water_buffer")}
          />
        </div>

        {/* Slope Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="slope" className="cursor-pointer">
              Slope &gt;30% (exclude)
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Steep slopes reduce project feasibility</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="slope"
            checked={constraints.slope_limit}
            onCheckedChange={() => handleToggle("slope_limit")}
          />
        </div>

        {/* Infrastructure */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="infra" className="cursor-pointer">
              Existing Infrastructure
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Exclude roads, buildings, and facilities</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="infra"
            checked={constraints.exclude_infrastructure}
            onCheckedChange={() => handleToggle("exclude_infrastructure")}
          />
        </div>

        {/* Indigenous Territories */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="indigenous" className="cursor-pointer flex items-center gap-1">
              Indigenous Territories
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Warn when consultation required (does not exclude)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch
            id="indigenous"
            checked={constraints.warn_indigenous}
            onCheckedChange={() => handleToggle("warn_indigenous")}
          />
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Hard constraints prevent site selection. Warnings flag areas requiring additional review.
        </div>
      </CardContent>
    </Card>
  );
}

