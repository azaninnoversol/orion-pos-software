"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LineChart from "@/components/dashboard-components/LineChart";
import { CreditCard } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface FilterType {
  timeRange: "week" | "month" | "6month" | "year";
  branch?: string;
}

interface SummaryCardProps {
  title: string;
  icon?: React.ReactNode;
  value: number | string;
  currency?: string;
  showFilter?: boolean;
  initialFilter?: FilterType;
  dataSets?: Record<string, { name: string; sales: number }[]>;
  role?: "customer" | "sales";
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title = "",
  icon,
  value,
  currency = "",
  showFilter = false,
  initialFilter = { timeRange: "month", branch: "all" },
  dataSets,
  role,
}) => {
  const [filter, setFilter] = useState(initialFilter.timeRange);

  useEffect(() => {
    if (initialFilter?.timeRange) setFilter(initialFilter.timeRange);
  }, [initialFilter]);

  const defaultData = useMemo(
    () => ({
      week: [
        { name: "Mon", sales: 1200 },
        { name: "Tue", sales: 1800 },
        { name: "Wed", sales: 1500 },
        { name: "Thu", sales: 2000 },
        { name: "Fri", sales: 2500 },
        { name: "Sat", sales: 1900 },
        { name: "Sun", sales: 2300 },
      ],
      month: [
        { name: "Week 1", sales: 4000 },
        { name: "Week 2", sales: 5200 },
        { name: "Week 3", sales: 6100 },
        { name: "Week 4", sales: 4800 },
      ],
      "6month": [
        { name: "May", sales: 4200 },
        { name: "Jun", sales: 5400 },
        { name: "Jul", sales: 6100 },
        { name: "Aug", sales: 6900 },
        { name: "Sep", sales: 7500 },
        { name: "Oct", sales: 7200 },
      ],
      year: [
        { name: "Jan", sales: 3100 },
        { name: "Feb", sales: 3800 },
        { name: "Mar", sales: 4700 },
        { name: "Apr", sales: 5100 },
        { name: "May", sales: 5800 },
        { name: "Jun", sales: 6400 },
        { name: "Jul", sales: 7200 },
        { name: "Aug", sales: 6900 },
        { name: "Sep", sales: 7600 },
        { name: "Oct", sales: 8000 },
        { name: "Nov", sales: 8500 },
        { name: "Dec", sales: 9000 },
      ],
    }),
    [],
  );

  const activeData = (dataSets || defaultData)[filter] || [];

  const labelMap: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    "6month": "Last 6 Months",
    year: "This Year",
  };

  const chartHeight = typeof window !== "undefined" && window.innerWidth < 768 ? 140 : 160;
  const totalActiveSales = activeData.reduce((sum, item) => sum + (item.sales ?? 0), 0);

  return (
    <Card className="w-full shadow-md rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between transition-all duration-300 min-h-[280px] h-auto gap-0 pb-0">
      <CardHeader className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-gray-800 dark:text-gray-200 text-lg md:text-xl font-medium">{title}</h4>
          </div>

          {showFilter ? (
            <Select value={filter} onValueChange={(val) => setFilter(val as "week" | "month" | "6month" | "year")}>
              <SelectTrigger className="w-[120px] h-8 text-xs md:text-sm border-gray-200">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="6month">Last 6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="bg-[#F3F5F7] px-2 py-1 flex items-center gap-2 rounded-md">
              <CreditCard size={15} className="text-gray-500" />
              <p className="text-gray-600 text-sm">{labelMap[filter]}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatNumber(totalActiveSales) ?? value}
            {currency && <span className="text-sm ml-1">{currency}</span>}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between mt-4 px-0 w-full">
        {activeData.length > 0 && <LineChart role={role} data={activeData} dataKey="sales" color="#2563eb" width="100%" height={chartHeight} />}
      </CardContent>
    </Card>
  );
};

export default React.memo(SummaryCard);
