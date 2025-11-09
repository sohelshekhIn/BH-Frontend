import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EmissionsChartProps {
  type: "line" | "area" | "bar";
  title: string;
  description?: string;
  data: Array<{
    year?: number;
    baseline?: number;
    with_offset?: number;
    cumulative?: number;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  xAxisKey?: string;
}

export function EmissionsChart({ type, title, description, data, dataKeys, xAxisKey = "year" }: EmissionsChartProps) {
  const ChartComponent = type === "area" ? AreaChart : type === "bar" ? BarChart : LineChart;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${(value / 1000).toFixed(1)}k tCO₂e`,
                "",
              ]}
              labelFormatter={(label) => xAxisKey === "year" ? `Year ${label}` : label}
            />
            <Legend />
            {dataKeys.map((dataKey) => (
              type === "area" ? (
                <Area
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  stroke={dataKey.color}
                  fill={dataKey.color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name={dataKey.label}
                />
              ) : type === "bar" ? (
                <Bar
                  key={dataKey.key}
                  dataKey={dataKey.key}
                  fill={dataKey.color}
                  name={dataKey.label}
                  radius={[4, 4, 0, 0]}
                />
              ) : (
                <Line
                  key={dataKey.key}
                  type="monotone"
                  dataKey={dataKey.key}
                  stroke={dataKey.color}
                  strokeWidth={3}
                  name={dataKey.label}
                  dot={{ fill: dataKey.color, r: 4 }}
                />
              )
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

