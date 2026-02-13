"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

//components
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rating, RatingButton } from "@/components/ui/rating";
import Loading from "@/app/loading";
import PaymedChart from "@/components/dashboard-components/PaymedChart";
import DashboardCard from "@/components/dashboard-components/DashboardCard";
import ReportsBranchChart from "@/components/dashboard-components/ReportsBranchChart";
import TableSection from "@/components/TableSection";
import { CellRow } from "./menu/TableCell";
import SummaryCard from "./reports/SummaryCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

//icons
import { CircleDollarSign, CreditCard, House } from "lucide-react";

//toast
import { toast } from "sonner";

//api-service
import { BrancheManageService, branchManageService, customerManageServiceForReports } from "@/services/api_service";

//library
import { ColumnDef } from "@tanstack/react-table";

//helper-function + mock-data + types
import { cn } from "@/lib/utils";
import { paymentData } from "./Dashboard";
import { CustomerDetail, getColor, Status } from "./customers/data";
import {
  ButtonText,
  generateCustomerChartData,
  generateCustomerSalesChartData,
  generateReportSaleCard,
  generateReportsCard,
  Period,
} from "./reports/data";

const timeRangeOptions = [
  { name: "This Week", value: "thisWeek" },
  { name: "This Month", value: "thisMonth" },
  { name: "Last 6 Months", value: "last6Months" },
  { name: "This Year", value: "thisYear" },
];

function Reports() {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [customersData, setCustomersData] = useState<CustomerDetail[]>([]);
  const [branchData, setBranchData] = useState<BrancheManageService[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("thisMonth");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [role, setRole] = useState<"customer" | "sales">("customer");

  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void) => {
    try {
      setStatus(Status.FETCHING);
      await fn();
      setStatus(Status.FETCHED);
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
      setStatus(Status.ERROR);
    }
  }, []);

  const fetchCustomers = useCallback(() => {
    safeAsync(async () => {
      const data = await customerManageServiceForReports.getAll();
      const branchData = await branchManageService.getAll();
      setBranchData(branchData);
      setCustomersData(data);
    });
  }, [safeAsync]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredBranches = useMemo(() => {
    return [{ name: "All Branches", value: "all" }, ...branchData.filter((b) => b?.id).map((b) => ({ name: b.branchName, value: b.id as string }))];
  }, [branchData]);

  const filteredCustomers = useMemo(() => {
    const now = new Date();

    return customersData
      .filter((c) => {
        if (!c?.lastVisit) return;
        const createdAt = new Date(c.lastVisit);

        switch (selectedTimeRange) {
          case "thisWeek":
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const day = now.getDay();

            let startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            if (startOfWeek < startOfMonth) startOfWeek = startOfMonth;

            const createdAtDate = new Date(createdAt);
            createdAtDate.setHours(0, 0, 0, 0);

            return createdAtDate >= startOfWeek && createdAtDate <= today;

          case "thisMonth":
            return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();

          case "last6Months":
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
            return createdAt >= sixMonthsAgo;

          case "thisYear":
            return createdAt.getFullYear() === now.getFullYear();

          default:
            return true;
        }
      })
      .filter((c) => selectedBranch === "all" || c.associateBranch?.value === selectedBranch);
  }, [customersData, selectedTimeRange, selectedBranch]);

  const time =
    selectedTimeRange === "last6Months" ? "6month" : selectedTimeRange === "thisMonth" ? "month" : selectedTimeRange === "thisYear" ? "year" : "week";

  const reportsCard =
    role === "customer"
      ? generateReportsCard(
          filteredCustomers,
          selectedTimeRange === "last6Months"
            ? "Last 6 months"
            : selectedTimeRange === "thisMonth"
            ? "This Month"
            : selectedTimeRange === "thisYear"
            ? "This Year"
            : "This Week",
        )
      : generateReportSaleCard(
          filteredCustomers,
          selectedTimeRange === "last6Months"
            ? "Last 6 months"
            : selectedTimeRange === "thisMonth"
            ? "This Month"
            : selectedTimeRange === "thisYear"
            ? "This Year"
            : "This Week",
          time as Period,
        );

  const customerChartData = useMemo(() => generateCustomerChartData(filteredCustomers), [filteredCustomers]);
  const customerSalesData = useMemo(() => generateCustomerSalesChartData(filteredCustomers), [filteredCustomers]);

  const columns: ColumnDef<CustomerDetail>[] = [
    { accessorKey: "id", header: "#ID" },
    { accessorKey: "customerName", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "associateBranch",
      header: "Branch",
      cell: ({ row }) => (
        <CellRow className="text-left cursor-pointer">
          <span>{row?.original?.associateBranch?.name}</span>
        </CellRow>
      ),
    },
    { accessorKey: "ordersNumber", header: "Num of Orders" },
    { accessorKey: "totalSpend", header: "Total Spends" },
    {
      accessorKey: "loyalty",
      header: "Loyalty",
      cell: ({ row }) => {
        const color = getColor(row?.original?.loyalty);
        return (
          <Rating defaultValue={3} readOnly>
            <RatingButton key={1} color={color} />
          </Rating>
        );
      },
    },
    { accessorKey: "lastVisit", header: "Last Visit" },
  ];

  if (status === Status.FETCHING) {
    return <Loading className="!min-h-[80vh]" />;
  }

  return (
    <section id="reports-analysis" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {ButtonText?.map((single, idx) => (
              <Button
                key={idx}
                className={cn(
                  "rounded-2xl hover:bg-white bg-white hover:text-[#3238a1] text-[#3238a1] border border-[#3238a1]",
                  role === single?.role && "hover:bg-[#3238a1] bg-[#3238a1] hover:text-white text-white",
                )}
                onClick={() => setRole(single?.role as "customer" | "sales")}
              >
                {single?.btnText}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <DropDown data={timeRangeOptions} placeholder="Select Time" value={selectedTimeRange} onChange={(val) => setSelectedTimeRange(val)} />
            <DropDown data={filteredBranches} placeholder="Select Branch" value={selectedBranch} onChange={(val) => setSelectedBranch(val)} />
          </div>
        </div>

        <div className="grid grid-cols-3 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6 w-full mt-6">
          {reportsCard?.map((single, idx) => (
            <DashboardCard {...single} key={idx} total={customersData?.length} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
          <SummaryCard
            title={role === "customer" ? "Customer Summary" : "Sales Summary"}
            icon={<CircleDollarSign className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />}
            value={customersData?.length}
            currency={role === "customer" ? "Customers" : "Sales"}
            initialFilter={{
              timeRange: time,
              branch: selectedBranch,
            }}
            dataSets={role === "customer" ? customerChartData : customerSalesData}
            role={role}
          />

          <ReportsBranchCard data={filteredCustomers} selectedTimeRange={selectedTimeRange} />
        </div>

        {role === "customer" ? (
          <TableSection
            title="Customer List"
            columns={columns}
            data={filteredCustomers}
            pageSize={10}
            isLoading={status === (Status.FETCHING as Status)}
            placeholder="Search Customer..."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-10 w-full">
              <TableSection
                title="Order List"
                columns={columns}
                data={filteredCustomers}
                pageSize={10}
                isLoading={status === (Status.FETCHING as Status)}
                placeholder="Search Orders..."
              />
            </div>

            <div className="lg:col-span-2 w-full pt-4 mt-4 lg:pt-0">
              <PaymedChart paymentData={paymentData} />
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

export default React.memo(Reports);

type DropDownProps = {
  data: { name: string; value: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
};

const DropDown = ({ data, placeholder, value, onChange }: DropDownProps) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[130px] md:w-[150px] h-8 text-xs md:text-sm dark:text-gray-200 border-gray-200 text-gray-600">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data?.map((single) => (
          <SelectItem key={single.value} value={single?.value}>
            {single?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface ReportsBranchCardProps {
  data?: CustomerDetail[];
  selectedTimeRange?: string;
}

const ReportsBranchCard = ({ data = [], selectedTimeRange = "thisMonth" }: ReportsBranchCardProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    const now = new Date();
    return data.filter((b) => {
      if (!b.createdAt) return;
      const createdAt = new Date(b.createdAt);
      switch (selectedTimeRange) {
        case "thisWeek":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return createdAt >= startOfWeek;
        case "thisMonth":
          return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
        case "lastMonth":
          const lastMonth = now.getMonth() - 1;
          return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === now.getFullYear();
        case "last6Months":
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          return createdAt >= sixMonthsAgo;
        default:
          return true;
      }
    });
  }, [data, selectedTimeRange]);

  return (
    <Card className={cn("w-full shadow-md rounded-2xl p-4 pb-2 flex flex-col justify-between transition-all duration-300 h-[300px]")}>
      <CardHeader className="flex flex-col gap-2 bg-white dark:bg-card z-10 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <House className="bg-gray-200  rounded-full p-1.5 text-gray-800" size={30} />
            <h4 className="text-gray-800 dark:text-white text-lg md:text-xl font-medium">Top Branch</h4>
          </div>

          <div className="bg-[#F3F5F7] px-2 py-1 flex items-center gap-2 rounded-md">
            <CreditCard size={15} className="text-gray-500" />
            <p className="text-gray-600 text-sm">
              {selectedTimeRange === "last6Months"
                ? "Last 6 months"
                : selectedTimeRange === "thisMonth"
                ? "This Month"
                : selectedTimeRange === "thisYear"
                ? "This Year"
                : "This Week"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent ref={contentRef} className="flex-1 overflow-y-auto px-0 mt-2 w-full gap-2 scroll-smooth transition-all duration-200">
        <ReportsBranchChart data={filteredData} />
      </CardContent>
    </Card>
  );
};
