"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { SuitabilityPolygon } from "@/types/facility";

interface PolygonCardProps {
  polygon: SuitabilityPolygon;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

export function PolygonCard({ polygon, selected, onToggleSelect }: PolygonCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatCredits = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };

  return (
    <Card className={`transition-all ${selected ? "border-primary shadow-md" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(polygon.id)}
            className="mt-1"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{polygon.id}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{polygon.area_ha.toFixed(1)} ha</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Score: {polygon.suitability_score.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Thumbnail Placeholder */}
              <div className="w-20 h-20 bg-muted rounded flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                Map
              </div>
            </div>

            {/* Credit Band */}
            <div className="bg-primary/10 rounded-md p-3 mb-2">
              <div className="text-xs text-muted-foreground mb-1">Estimated Credits/Year</div>
              <div className="font-bold text-lg">
                {formatCredits(polygon.est_credits_low)} – {formatCredits(polygon.est_credits_high)}{" "}
                <span className="text-sm font-normal">tCO₂e/yr</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Mid: {formatCredits(polygon.est_credits_mid)} tCO₂e/yr
              </div>
            </div>

            {/* Suitability Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Suitability</span>
                <span className="font-medium">{(polygon.suitability_score * 100).toFixed(0)}%</span>
              </div>
              <Progress value={polygon.suitability_score * 100} className="h-2" />
            </div>

            {/* Constraint Warnings */}
            {polygon.constraints_warnings.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {polygon.constraints_warnings.map((warning, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {warning}
                  </Badge>
                ))}
              </div>
            )}

            {/* SHAP Features (Collapsible) */}
            <div className="border-t pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full justify-between h-auto p-0 hover:bg-transparent"
              >
                <span className="text-xs font-medium">Feature Importance</span>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {expanded && (
                <div className="mt-2 space-y-2">
                  {polygon.shap_features.map((feature, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">{feature.name}</span>
                        <span className="font-medium">
                          {typeof feature.value === "number" ? feature.value.toFixed(2) : feature.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.abs(feature.impact) * 100}
                          className={`h-1 flex-1 ${
                            feature.impact > 0 ? "bg-green-200" : "bg-red-200"
                          }`}
                        />
                        <span className={`text-xs ${feature.impact > 0 ? "text-green-600" : "text-red-600"}`}>
                          {feature.impact > 0 ? "+" : ""}
                          {feature.impact.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

