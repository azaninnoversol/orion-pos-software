"use client";
import React from "react";

//library
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

//helper-function
import { formatNumber } from "@/lib/utils";

interface CustomLineChartProps {
  data: { [key: string]: any }[];
  dataKey?: string;
  color?: string;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  role?: "customer" | "sales";
}

const CustomTooltip = ({ active, payload, label, role }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">
          {role === "sales" ? "Sales" : "Customers"} :{" "}
          <span className="font-bold">{role === "sales" ? formatNumber(payload[0].value) : payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  dataKey = "value",
  color = "#3b82f6",
  height = 180,
  width = "100%",
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  role,
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {showXAxis && <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 15 }} padding={{ left: 30, right: 0 }} />}

        {showYAxis && <YAxis width={20} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />}

        {showTooltip && <Tooltip content={<CustomTooltip role={role} />} />}

        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill="url(#chartGradient)" dot={{ r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default React.memo(CustomLineChart);
