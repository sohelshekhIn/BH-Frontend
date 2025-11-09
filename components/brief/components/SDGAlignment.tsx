import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SDG_GOALS, calculateSDGAlignment } from "@/lib/sdg-config";

interface SDGAlignmentProps {
  projectType: string;
  metrics: {
    area_ha?: number;
    co2_removal?: number;
    biodiversity_score?: number;
    water_proximity?: boolean;
    urban_proximity?: boolean;
  };
}

export function SDGAlignment({ projectType, metrics }: SDGAlignmentProps) {
  const alignments = calculateSDGAlignment(projectType, metrics);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          UN Sustainable Development Goals Alignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alignments.map(({ goal, score, impact }) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${goal.color}15` }}
                >
                  {goal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1">
                    SDG {goal.id}: {goal.shortName}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress 
                      value={score} 
                      className="h-2"
                      style={{
                        // @ts-ignore
                        '--progress-background': goal.color
                      }}
                    />
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                      {score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">UN SDG Alignment:</strong> This project contributes to {alignments.length} Sustainable Development Goals, 
            with primary impact on climate action (SDG 13) and ecosystem restoration (SDG 15).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

