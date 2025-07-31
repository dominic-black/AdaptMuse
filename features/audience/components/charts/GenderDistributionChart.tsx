import React from "react";
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
import { ChartDataPoint } from "../../types/audience-metrics.types";

interface GenderDistributionChartProps {
  genderTotals: Record<string, number>;
}

interface TooltipPayload {
  value: number;
  name: string;
}

interface TooltipProps {
  payload: TooltipPayload;
}

export const GenderDistributionChart: React.FC<
  GenderDistributionChartProps
> = ({ genderTotals }) => {
  const rawScores = genderTotals || { male: 0, female: 0 };

  const chartData: ChartDataPoint[] = Object.entries(rawScores).map(
    ([key, value]: [string, number]) => {
      const safeValue = value ?? 0;
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: safeValue,
        fill: key === "male" ? "url(#maleGradient)" : "url(#femaleGradient)",
        isPositive: safeValue > 0,
      };
    }
  );

  const maxAbsValue = Math.max(...chartData.map((d) => Math.abs(d.value)), 1);

  const formatTooltip = (
    value: string | number,
    _name: string,
    props: TooltipProps
  ) => {
    const affinity = props.payload.value;
    const gender = props.payload.name;
    const interpretation =
      affinity > 1
        ? "Strong Appeal"
        : affinity > 0
        ? "Moderate Appeal"
        : affinity > -1
        ? "Low Appeal"
        : "Very Low Appeal";

    return [
      `${typeof value === "number" ? value.toFixed(3) : value}`,
      `${gender} ${interpretation}`,
    ];
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 80,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            domain={[-maxAbsValue * 1.1, maxAbsValue * 1.1]}
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            tick={{ fontSize: 12, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />

          <defs>
            <linearGradient id="maleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="femaleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
            formatter={formatTooltip}
            labelStyle={{
              color: "#374151",
              fontWeight: "600",
            }}
          />

          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
