import React from "react";

//components
import CustomTooltip from "../CustomTooltip";
import { Card, CardContent, CardHeader } from "../ui/card";

//helper-function
import { cn } from "@/lib/utils";

//types
import { PaymentDataField } from "@/container/dashboard-pages/Dashboard";

//icons
import { DollarSign } from "lucide-react";
interface PaymedChartData {
  paymentData: PaymentDataField[];
  className?: string;
}

function PaymedChart({ paymentData = [], className }: PaymedChartData) {
  return (
    <Card className={cn(className, "w-full shadow-md rounded-2xl pt-3 pb-0 h-[300px] flex flex-col justify-between gap-1")}>
      <CardHeader className="flex flex-col gap-2 bg-white dark:bg-card z-10 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <DollarSign className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />
            <h4 className="text-gray-800 dark:text-gray-200 text-xl font-normal">Payment Methods</h4>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex justify-start items-center h-full gap-16">
        {paymentData.map((item, idx) => (
          <CustomTooltip key={idx} title={`${item.label}: ${item.percentage}%`}>
            <div className="flex flex-col items-center">
              <span className="text-gray-700 dark:text-gray-100 font-medium text-sm mb-2">{item.percentage}%</span>

              <div className="w-18 bg-gray-100  overflow-hidden h-[150px] flex items-end">
                <div
                  className="w-full transition-all duration-500"
                  style={{
                    height: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <span className="text-gray-600 dark:text-gray-100 text-sm mt-2 font-medium">{item.label}</span>
            </div>
          </CustomTooltip>
        ))}
      </CardContent>
    </Card>
  );
}

export default React.memo(PaymedChart);
