import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatAgeGroupLabel } from "@/utils/audience";
import { ChartDataPoint } from "../../types/audience-metrics.types";

interface AgeDistributionChartProps {
  ageTotals: Record<string, number>;
}

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  ageTotals,
}) => {
  const chartData: ChartDataPoint[] = Object.entries(ageTotals)
    .sort(([a], [b]) => {
      const getStartingAge = (ageRange: string) => {
        const match = ageRange.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getStartingAge(a) - getStartingAge(b);
    })
    .map(([key, value]) => ({
      name: formatAgeGroupLabel(key),
      value,
      percentage: (
        (value / Object.values(ageTotals).reduce((a, b) => a + b, 0)) *
        100
      ).toFixed(1),
    }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fontSize: 12, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              "Affinity Score",
            ]}
            labelStyle={{ color: "#374151", fontWeight: "600" }}
          />
          <Bar
            dataKey="value"
            fill="url(#blueGradient)"
            radius={[0, 6, 6, 0]}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
