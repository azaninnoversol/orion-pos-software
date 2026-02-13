import React from "react";

// components
import { Card, CardContent } from "@/components/ui/card";

// types + mockData
import { OrderOverviewAmount, orderOverviewAmountType } from "./data";

interface SimpleOrderCardPrp extends OrderOverviewAmount {
  onClick?: (type: orderOverviewAmountType) => void;
  className?: string;
}

function SimpleOrderCard({ className, icon, amount, currency, title, onClick, type }: SimpleOrderCardPrp) {
  return (
    <Card
      className={`
  min-h-[150px]
  ${className}
`}
    >
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 pb-4">
          <div
            className="bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-gray-700 cursor-pointer shrink-0"
            onClick={() => onClick?.(type)}
          >
            {icon}
          </div>
          <h4 className="text-gray-700 dark:text-gray-100 font-semibold text-sm sm:text-lg text-center sm:text-left">{title}</h4>
        </div>

        <div className="flex items-center justify-center sm:justify-start pl-0 sm:pl-2">
          <h3 className="text-gray-700 dark:text-gray-100 font-semibold text-lg sm:text-2xl">
            {amount}
            <span className="text-sm sm:text-base pl-1">{currency}</span>
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(SimpleOrderCard);
