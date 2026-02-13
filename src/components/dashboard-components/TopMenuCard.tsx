"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";

//components
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

//helper-functions
import { cn } from "@/lib/utils";

interface TopMenuCardProps {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
}

const TopMenuCard = ({ icon, title, className }: TopMenuCardProps) => {
  const menuData = [
    { product: "The Rostafari", quantity: 320, revenue: "2,450 EGP" },
    { product: "Pizza Dough", quantity: 280, revenue: "1,980 EGP" },
    { product: "French Fries", quantity: 210, revenue: "1,420 EGP" },
    { product: "Choco Lava", quantity: 190, revenue: "1,160 EGP" },
    { product: "Chicken Wings", quantity: 170, revenue: "950 EGP" },
    { product: "Garlic Bread", quantity: 150, revenue: "870 EGP" },
  ];

  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedRange, setSelectedRange] = useState("today");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, filteredData.length));
  };

  const handleSeeLess = () => {
    setVisibleCount(3);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (contentRef.current && visibleCount > 3) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount]);

  const filteredData = useMemo(() => {
    switch (selectedRange) {
      case "today":
        return menuData.slice(0, 1);
      case "week":
        return menuData.slice(0, 3);
      case "14days":
        return menuData.slice(0, 4);
      case "month":
        return menuData.slice(0, 6);
      default:
        return menuData;
    }
  }, [selectedRange, menuData]);

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <Card className={cn(className, "shadow-md rounded-2xl h-[280px] overflow-hidden flex flex-col py-0")}>
      <CardHeader className="flex flex-col gap-3 bg-white dark:bg-card sticky top-0 z-10 pt-3 pb-0">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            {icon}
            <h4 className="text-gray-800 dark:text-gray-300 text-lg sm:text-xl font-semibold">{title}</h4>
          </div>

          <Select onValueChange={(val) => setSelectedRange(val)} value={selectedRange}>
            <SelectTrigger className="w-[140px] h-9 text-sm border-gray-200">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="14days">Last 14 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent ref={contentRef} className="flex-1 overflow-y-auto px-4 sm:px-6 mt-2 w-full scroll-smooth transition-all duration-200">
        <div className="grid grid-cols-3 sm:grid-cols-3 font-semibold text-gray-700 border-b pb-2 text-xs sm:text-sm md:text-base">
          <p className="text-left text-gray-500 dark:text-gray-100 font-normal">Product</p>
          <p className="text-right text-gray-500 dark:text-gray-100 font-normal">Quantity</p>
          <p className="text-right text-gray-500 dark:text-gray-100 font-normal">Revenue</p>
        </div>

        <div className="divide-y">
          {visibleData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 sm:grid-cols-3 items-center py-2 sm:py-3 text-gray-700  hover:dark:bg-gray-800 hover:bg-gray-50 transition text-xs sm:text-sm md:text-base"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-base sm:text-lg">🍕</span>
                <span className="truncate dark:text-gray-100">{item.product}</span>
              </div>
              <p className="text-right dark:text-gray-100">{item.quantity}</p>
              <p className="text-right font-medium dark:text-gray-100">{item.revenue}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center pb-4">
        {filteredData.length > 3 && visibleCount < filteredData.length && (
          <Button onClick={handleSeeMore} className="text-lg self-center hover:bg-purple-600 hover:text-pink-100 bg-transparent text-purple-600">
            See More
          </Button>
        )}

        {filteredData.length > 3 && visibleCount >= filteredData.length && (
          <Button onClick={handleSeeLess} className="text-lg self-center hover:bg-purple-600 hover:text-pink-100 bg-transparent text-purple-600">
            See Less
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default React.memo(TopMenuCard);
