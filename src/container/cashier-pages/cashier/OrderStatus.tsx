import React, { memo } from "react";

// components
import { Card, CardContent } from "@/components/ui/card";

// helper-function
import { cn } from "@/lib/utils";

// mock-data
import { OrderOverviewPrp } from "./data";

interface OrderStatusProps {
  className?: string;
  title?: string;
  data?: OrderOverviewPrp[];
}

function OrderStatus({ className, title, data }: OrderStatusProps) {
  return (
    <Card className={cn(className, "w-[25%] min-h-[500px] px-4")}>
      <div className="flex items-center justify-between flex-wrap max-[1207px]:justify-center max-[1207px]:gap-2">
        <h2 className="text-3xl font-semibold">{title}</h2>

        <div className="bg-[#F3F5F7] px-2 py-1 flex items-center gap-2 rounded-md">
          <p className="text-gray-600 text-sm">Live Overview</p>
        </div>
      </div>

      <CardContent className="px-0">
        <main className="flex flex-col gap-12 overflow-y-auto h-full min-h-full">
          {data?.map((single: OrderOverviewPrp, idx: number) => (
            <div key={idx} className="flex items-center">
              <div
                className="rounded-full w-[50px] h-[50px] justify-center flex items-center text-white"
                style={{ backgroundColor: single?.bgColor }}
              >
                {single?.icon}
              </div>

              <div className="flex items-start flex-col pl-8">
                <h3 className="font-bold">{single?.title}</h3>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">{single?.totalOrder}</h4>
                  <span className="text-gray-500">orders</span>
                </div>
              </div>
            </div>
          ))}
        </main>
      </CardContent>
    </Card>
  );
}

export default memo(OrderStatus);
