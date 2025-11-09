import { TrendingUp, TrendingDown, Leaf, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  value: string | number;
  label: string;
  trend?: number;
  icon?: "leaf" | "calendar" | "dollar" | "trending";
  color?: "emerald" | "blue" | "purple" | "amber";
}

function MetricCard({ value, label, trend, icon, color = "emerald" }: MetricCardProps) {
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  const iconComponents = {
    leaf: Leaf,
    calendar: Calendar,
    dollar: DollarSign,
    trending: TrendingUp,
  };

  const IconComponent = icon ? iconComponents[icon] : null;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          {IconComponent && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
              <IconComponent className={`h-5 w-5 text-${color}-600`} />
            </div>
          )}
          {trend !== undefined && (
            <div className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`text-4xl font-bold bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent mb-1`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

interface ImpactMetricsProps {
  data: {
    co2_removal: number;
    total_area: number;
    timeline_years: number;
    investment?: number;
    offset_percentage?: number;
  };
}

export function ImpactMetrics({ data }: ImpactMetricsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        value={`${formatNumber(data.co2_removal)}t`}
        label="CO₂ Removal"
        icon="leaf"
        color="emerald"
        trend={data.offset_percentage}
      />
      <MetricCard
        value={`${formatNumber(data.total_area)}`}
        label="Total Area (ha)"
        icon="trending"
        color="blue"
      />
      <MetricCard
        value={`${data.timeline_years}y`}
        label="Project Timeline"
        icon="calendar"
        color="purple"
      />
      {data.investment && (
        <MetricCard
          value={`$${formatNumber(data.investment)}`}
          label="Est. Investment"
          icon="dollar"
          color="amber"
        />
      )}
    </div>
  );
}

