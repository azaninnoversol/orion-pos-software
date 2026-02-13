"use client";
import React, { useRef, useState, useMemo } from "react";

//components
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

//helper-function
import { cn } from "@/lib/utils";

//type
import { BranchesData } from "@/container/dashboard-pages/Dashboard";

interface BranchesCardProps {
  data?: BranchesData[];
  icon?: React.ReactNode;
  title?: string;
  className?: string;
}

function BranchesCard({ data = [], icon, title, className }: BranchesCardProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedRange, setSelectedRange] = useState("month");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, filteredData.length));
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSeeLess = () => {
    setVisibleCount(3);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredData = useMemo(() => {
    switch (selectedRange) {
      case "week":
        return data.slice(0, 3);
      case "month":
        return data.slice(0, 5);
      case "year":
        return data.slice(0, 8);
      case "6month":
        return data.slice(3, 7);
      default:
        return data;
    }
  }, [selectedRange, data]);

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <Card className={cn(className, "w-full shadow-md rounded-2xl p-4 pb-2 flex flex-col justify-between transition-all duration-300 h-[300px]")}>
      <CardHeader className="flex flex-col gap-2 bg-white dark:bg-card z-10 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-gray-800 dark:text-gray-100 text-lg md:text-xl font-medium">{title}</h4>
          </div>

          <Select
            onValueChange={(val) => {
              setSelectedRange(val);
              setVisibleCount(3);
              if (contentRef.current) contentRef.current.scrollTo({ top: 0 });
            }}
            value={selectedRange}
          >
            <SelectTrigger className="w-[110px] md:w-[140px] h-8 text-xs md:text-sm border-gray-200">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="6month">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent ref={contentRef} className="flex-1 overflow-y-auto px-0 mt-2 w-full gap-2 scroll-smooth transition-all duration-200">
        <div className="flex flex-col gap-2 px-3 sm:px-4">
          {visibleData.map((single, index) => (
            <main key={index} className="border-b border-b-gray-200 w-full flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4 pb-2">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <p className="text-xs sm:text-sm md:text-base bg-[#f3f5f7] dark:bg-purple-700 px-2 w-fit sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full min-w-[28px] text-center">
                  {single.rank}
                </p>

                <div className="flex flex-col">
                  <h4 className="text-sm sm:text-base md:text-[15px] font-medium text-gray-800 dark:text-gray-200 leading-snug">{single.name}</h4>
                  <span className="text-[11px] sm:text-xs md:text-sm text-gray-400 leading-none">{single.city}</span>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-row items-center gap-0.5 sm:gap-1 md:gap-1.5">
                <h4 className="text-sm sm:text-base md:text-[15px] font-semibold text-gray-800 dark:text-gray-200">{single.price}</h4>
                <span className="text-[11px] sm:text-xs md:text-sm text-gray-400">{single.currency}</span>
              </div>
            </main>
          ))}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-center pb-0 sm:pb-0">
        {filteredData.length > 3 && visibleCount < filteredData.length && (
          <Button
            onClick={handleSeeMore}
            className="text-sm sm:text-base font-medium bg-transparent text-purple-600 hover:bg-purple-600 hover:text-white dark:text-white dark:bg-accent transition-all"
          >
            See More
          </Button>
        )}

        {filteredData.length > 3 && visibleCount >= filteredData.length && (
          <Button
            onClick={handleSeeLess}
            className="text-sm sm:text-base font-medium bg-transparent text-purple-600 hover:bg-purple-600 dark:text-white dark:bg-accent hover:text-white transition-all"
          >
            See Less
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default React.memo(BranchesCard);
