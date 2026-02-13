"use client";

import React from "react";

//helper
import { formatNumber } from "@/lib/utils";

//chart-library
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface SimpleBarChartProps {
  data: {
    value?: number | string;
    avgPerCustomer?: number | string;
  }[];
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  barColor?: string;
  activeBarColor?: string;
  xDataKey?: string;
  barRadius?: [number, number, number, number];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, total, orders, value, count, customers } = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-800">Branch: {name}</p>

        {total !== undefined ? (
          <>
            <p className="text-blue-600">
              Avg per Customer: <span className="font-bold">{value !== undefined ? formatNumber(value) : "-"}</span>
            </p>
            <p className="text-gray-600">
              Total Sales: <span className="font-semibold">{total !== undefined ? formatNumber(total) : "-"}</span>
            </p>
            <p className="text-gray-600">
              Total Orders: <span className="font-semibold">{orders !== undefined ? formatNumber(orders) : "-"}</span>
            </p>
            <p className="text-gray-600">
              Customers: <span className="font-semibold">{count || customers !== undefined ? formatNumber(count || customers) : "-"}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-600">
            Customers: <span className="font-semibold">{value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  width = "100%",
  height = 100,
  xDataKey = "value",
  barColor = "#E0E0E0",
  activeBarColor = "#1E3A8A",
  barRadius = [4, 4, 0, 0],
}) => {
  const maxValue = Math.max(...data.map((d) => Number(d.value)));

  return (
    <div className="w-full h-[80px] sm:h-[100px] md:h-[120px] lg:h-[140px]" style={{ width }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, bottom: 5 }}>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey={xDataKey} radius={barRadius}>
            {data.map((d, index) => (
              <Cell key={`cell-${index}`} fill={Number(d.value) === maxValue ? activeBarColor : barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
