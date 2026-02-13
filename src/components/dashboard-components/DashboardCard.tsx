"use client";
import React from "react";

//type
import { DashboardCardField } from "@/container/dashboard-pages/Dashboard";

//components
import { Card, CardContent, CardHeader } from "../ui/card";
import SimpleBarChart from "./SimpleBarChart";

interface DashboardCardProps extends DashboardCardField {
  total?: number;
  xDataKey?: string;
}

const DashboardCard = ({ icon, title, tagIcon, tagTitle, price, curr, tag, data, xDataKey }: DashboardCardProps) => {
  return (
    <Card className="w-full shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg pb-0 pt-0">
      <CardHeader className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-gray-800 dark:text-white text-lg sm:text-xl font-medium">{title}</h4>
          </div>

          <div className="bg-[#F3F5F7] px-2 py-1 flex items-center gap-2 rounded-md">
            {tagIcon && <span>{tagIcon}</span>}
            <p className="text-gray-600 text-sm">{tagTitle}</p>
          </div>
        </div>

        <CardContent className="flex flex-col sm:flex-row sm:items-end justify-between mt-2 px-0 w-full gap-4">
          <div className="flex items-center gap-2">
            <p className="text-[1.5vw] max-[1200px]:text-[2vw] max-[768px]:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {price} {curr && <span className="text-sm font-normal">{curr}</span>}
            </p>

            <span className="text-green-500 font-medium bg-green-100 dark:bg-green-200 px-2 py-0.5 border border-green-400 text-xs sm:text-sm rounded-sm">
              {tag}
            </span>
          </div>

          {data && (
            <div className="w-full sm:w-[45%]">
              <SimpleBarChart data={data} xDataKey={xDataKey} width="100%" height={110} />
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default React.memo(DashboardCard);
