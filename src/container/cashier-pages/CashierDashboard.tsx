"use client";
import React, { useEffect, useState } from "react";

//components
import DashboardCard from "@/components/dashboard-components/DashboardCard";
import { CellRow } from "../dashboard-pages/menu/TableCell";
import TableSection from "@/components/TableSection";
import OrderStatus from "./cashier/OrderStatus";
import SimpleOrderCard from "./cashier/SimpleOrderCard";

//moack-data + types
import { dashboardCardField } from "../dashboard-pages/Dashboard";
import { generateOrderOverview, OrderOverviewAmount, orderOverviewAmount } from "./cashier/data";
import { Status } from "../dashboard-pages/customers/data";

//api-service
import { cancelledOrder, proceedOrder } from "@/services/api_service";

//toast
import { toast } from "sonner";

//library
import { ColumnDef } from "@tanstack/react-table";

//helper-functions
import { generateOrderData, ProceedOrdersData } from "./order/data";
import { formatNumber } from "@/lib/utils";

function CashierDashboard() {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [orderData, setOrderData] = useState<ProceedOrdersData[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    setStatus(Status.FETCHING);
    try {
      const cancelled = await cancelledOrder.getAll();
      setCancelledOrders(cancelled);
      const data = await proceedOrder.getAll();
      setOrderData(data);
      setStatus(Status.FETCHED);
    } catch (error) {
      toast.error(`Error : ${error instanceof Error}`);
      setStatus(Status.FETCHED);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const columns: ColumnDef<ProceedOrdersData>[] = [
    { accessorKey: "id", header: "#ORDER_ID" },
    { accessorKey: "customerName", header: "Name" },
    { accessorKey: "totalAmount", header: "Total Amount", cell: ({ row }) => <div>{formatNumber(row.original.totalAmount as number)} EGP</div> },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <CellRow className="bg-gray-100 dark:bg-gray-50 dark:text-gray-800 px-4 py-2 text-left w-fit">{row?.original?.status}</CellRow>
      ),
    },
    { accessorKey: "paymentMethod", header: "Pay Method" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const recentOrderData = generateOrderData(orderData?.slice(0, 5)?.filter(Boolean));
  const orderOverview = generateOrderOverview(orderData, cancelledOrders);

  return (
    <section id="cashier-dashboard">
      <main className="w-[96%] mx-auto pt-1">
        <div className="grid grid-cols-3 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6 w-full">
          {dashboardCardField.map((single, idx) => (
            <DashboardCard {...single} key={idx} />
          ))}
        </div>

        <div className="flex flex-col items-center lg:flex-row gap-4">
          <div className="w-full lg:w-[74%]">
            <TableSection
              title="Recent Order List"
              columns={columns}
              data={recentOrderData}
              pageSize={10}
              isLoading={status === Status.FETCHING}
              placeholder="Search Order..."
              classNameArea="!h-[340px] !min-h-[342px]"
            />
          </div>

          {/* Order Status Card */}
          <OrderStatus className="w-full! lg:w-[25%]! h-auto mt-4" title="Order List" data={orderOverview} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {orderOverviewAmount?.map((single: OrderOverviewAmount, index: number) => (
            <SimpleOrderCard key={index} {...single} />
          ))}
        </div>
      </main>
    </section>
  );
}

export default React.memo(CashierDashboard);
