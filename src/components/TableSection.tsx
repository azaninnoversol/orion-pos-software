"use client";
import React, { useState, useMemo } from "react";

//icons
import { Search, ArrowDownNarrowWide } from "lucide-react";

//components
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/DataTable";
import CustomTooltip from "@/components/CustomTooltip";
import Loading from "@/app/loading";

interface TableSectionProps<TData> {
  title: string;
  columns: any;
  data: TData[];
  pageSize?: number;
  placeholder?: string;
  isLoading?: boolean;
  classNameArea?: string;
}

function TableSection<TData extends object>({
  classNameArea,
  title,
  columns,
  data,
  pageSize = 10,
  placeholder = "Search",
  isLoading,
}: TableSectionProps<TData>) {
  const [filterValue, setFilterValue] = useState("");
  const [isSortedDesc, setIsSortedDesc] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSortToggle = () => {
    setIsSortedDesc((prev) => !prev);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (filterValue.trim()) {
      const lowerValue = filterValue.toLowerCase();
      filtered = data.filter((item: any) => Object.values(item).some((val) => String(val).toLowerCase().includes(lowerValue)));
    }

    if (isSortedDesc) {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [data, filterValue, isSortedDesc]);

  return (
    <Card className="mt-4 pb-1 w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap max-[628px]:justify-center max-[628px]:gap-2">
          <h2 className="text-3xl font-semibold">{title}</h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center relative">
              <Search className="absolute left-2" color="#828282" />
              <Input
                placeholder={placeholder}
                className="pl-9 font-medium text-black dark:text-gray-200 bg-gray-100 rounded-sm border-2 h-[40px]"
                onChange={handleFilterChange}
                value={filterValue}
              />
            </div>

            <div
              onClick={handleSortToggle}
              className={`bg-gray-100 rounded-full p-2.5 cursor-pointer transition-transform duration-200 ${isSortedDesc ? "rotate-180" : ""}`}
            >
              <CustomTooltip title="Sort Latest / Oldest">
                <ArrowDownNarrowWide className="dark:stroke-accent" />
              </CustomTooltip>
            </div>
          </div>
        </div>
      </CardHeader>

      {isLoading ? (
        <Loading className="!min-h-[50vh]" />
      ) : (
        <DataTable classNameArea={classNameArea} columns={columns} data={filteredAndSortedData} pageSize={pageSize} />
      )}
    </Card>
  );
}

export default React.memo(TableSection);
