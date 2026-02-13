"use client";
import React, { useMemo, useState } from "react";

//types
import { DashboardCardSales } from "@/container/dashboard-pages/Dashboard";

//components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "../ui/card";
import LineChart from "./LineChart";

const SalesDashboardCard = ({ icon, title, price, curr, data: parentData }: DashboardCardSales) => {
  const [filter, setFilter] = useState("6month");

  const dataSets = useMemo(
    () => ({
      week: [
        { name: "Mon", sales: 1200000 },
        { name: "Tue", sales: 1800000 },
        { name: "Wed", sales: 1500000 },
        { name: "Thu", sales: 2000000 },
        { name: "Fri", sales: 2500000 },
        { name: "Sat", sales: 1900000 },
        { name: "Sun", sales: 2300000 },
      ],
      month: [
        { name: "Week 1", sales: 4000000 },
        { name: "Week 2", sales: 5200000 },
        { name: "Week 3", sales: 6100000 },
        { name: "Week 4", sales: 4800000 },
      ],
      "6month": [
        { name: "May", sales: 4200000 },
        { name: "Jun", sales: 5400000 },
        { name: "Jul", sales: 6100000 },
        { name: "Aug", sales: 6900000 },
        { name: "Sep", sales: 7500000 },
        { name: "Oct", sales: 7200000 },
      ],
      year: [
        { name: "Jan", sales: 3100000 },
        { name: "Feb", sales: 3800000 },
        { name: "Mar", sales: 4700000 },
        { name: "Apr", sales: 5100000 },
        { name: "May", sales: 5800000 },
        { name: "Jun", sales: 6400000 },
        { name: "Jul", sales: 7200000 },
        { name: "Aug", sales: 6900000 },
        { name: "Sep", sales: 7600000 },
        { name: "Oct", sales: 8000000 },
        { name: "Nov", sales: 8500000 },
        { name: "Dec", sales: 9000000 },
      ],
    }),
    [],
  );

  const activeData = dataSets[filter as keyof typeof dataSets] || parentData || [];

  return (
    <Card className="w-full shadow-md rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between transition-all duration-300 min-h-[280px] h-auto gap-0 pb-0">
      <CardHeader className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-gray-800 dark:text-gray-100 text-lg md:text-xl font-medium">{title}</h4>
          </div>

          <Select onValueChange={(value) => setFilter(value)} value={filter}>
            <SelectTrigger className="w-[110px] md:w-[130px] h-8 text-xs md:text-sm border-gray-200">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="6month">Last 6 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {price}
            <span className="text-sm ml-1">{curr}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between mt-4 px-0 w-full">
        {activeData && <LineChart data={activeData} dataKey="sales" color="#2563eb" width="100%" height={window.innerWidth < 768 ? 140 : 160} />}
      </CardContent>
    </Card>
  );
};

export default React.memo(SalesDashboardCard);
