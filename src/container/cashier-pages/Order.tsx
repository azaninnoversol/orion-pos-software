"use client";
import React, { useEffect, useState } from "react";

// components
import { MenuCard } from "../dashboard-pages/menu/MenuCard";
import TableSection from "@/components/TableSection";
import { CellHeader, CellRow } from "../dashboard-pages/menu/TableCell";
import CustomTooltip from "@/components/CustomTooltip";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/DeleteModal";

// types + helper-function
import { Status } from "../dashboard-pages/customers/data";
import { generateOrderCards, generateOrderData, ProceedOrdersData } from "./order/data";
import { cn, formatNumber } from "@/lib/utils";

// services
import itemService, { cancelledOrder, proceedOrder } from "@/services/api_service";

// toast
import { toast } from "sonner";

// library
import { ColumnDef } from "@tanstack/react-table";

// icons
import { Ban, ShoppingBag, Trash2 } from "lucide-react";

function Order() {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [orderData, setOrderData] = useState<ProceedOrdersData[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [deleteOrderId, setIsOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setStatus(Status.FETCHING);
    try {
      const cancelled = await cancelledOrder.getAll();
      setCancelledOrders(cancelled);
      const data = await proceedOrder.getAll();
      console.log(data, "data");
      setOrderData(data);
      setStatus(Status.FETCHED);
    } catch (error) {
      toast.error(`Error : ${error instanceof Error}`);
      setStatus(Status.FETCHED);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const handleStatus = async (data: ProceedOrdersData, type: string) => {
    if (type === "update") {
      if (data.status !== "pending") {
        toast.warning("Order is already being prepared!");
        return;
      }

      setStatus(Status.SAVING);
      try {
        await proceedOrder.update(data?.id, {
          status: "preparing",
        });
        toast.success("Order status updated to Preparing!");
        await fetchOrders();
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : error}`);
      } finally {
        setStatus(Status.IDLE);
      }
    } else if (type === "cancel") {
      setIsOrderId(data.id);
    }
  };

  const deleteOrderHandler = async () => {
    if (!deleteOrderId) return;
    setStatus(Status.SAVING);

    try {
      const proceedOrderData = await proceedOrder.getById(deleteOrderId);
      for (const single of proceedOrderData.orders || []) {
        const { itemId, qty } = single;
        if (!itemId) continue;

        const currentItem = await itemService.getById(itemId);
        const updatedStock = (currentItem?.quantity ?? 0) + qty;
        await itemService.update(itemId, { quantity: updatedStock });
      }

      await cancelledOrder.add({
        ...proceedOrderData,
        cancelledOrderTime: Date.now(),
        customerName:
          proceedOrderData.orderType === "delivery"
            ? proceedOrderData?.customerDetail?.customerName
            : proceedOrderData.orderType === "takeaway"
            ? "Takeaway"
            : proceedOrderData?.tableName,
      });

      await proceedOrder.deleteById(deleteOrderId);
      toast.success("Order cancelled & stock restored successfully!");
      setStatus(Status.IDLE);
      await fetchOrders();
    } catch (error) {
      toast.error("Failed to cancel order or restore stock!");
    } finally {
      setIsOrderId(null);
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
    {
      accessorKey: "actions",
      id: "actions",
      header: () => <CellHeader className="text-center pr-0">Actions</CellHeader>,
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <CustomTooltip title="Order Preparing">
            <Button
              className={cn(row?.original?.status !== "pending" && "cursor-not-allowed", "bg-[#3238a1] rounded-lg p-2 dark:hover:bg-purple-800")}
              onClick={() => handleStatus(row?.original, "update")}
              disabled={row?.original?.status !== "pending"}
            >
              <ShoppingBag size={30} className="text-white" />
            </Button>
          </CustomTooltip>

          {row?.original?.status === "pending" && (
            <CustomTooltip title="Order Cancelled">
              <Button className="bg-red-500 rounded-lg p-2 dark:hover:bg-red-600" onClick={() => handleStatus(row?.original, "cancel")}>
                <Ban size={30} className="text-white" />
              </Button>
            </CustomTooltip>
          )}

          <DeleteModal
            open={deleteOrderId === row?.original?.id}
            setOpen={(val) => {
              if (val) {
                setIsOrderId(val as any);
              } else {
                setIsOrderId(null);
              }
            }}
            title={"Confirm Delete Order!"}
            description={"Are you sure you want to delete this Order?"}
            confirmText={"Delete Order"}
            cancelText={"No! Delete Order"}
            onConfirm={deleteOrderHandler}
            icon={Trash2}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const orderDatas = generateOrderData(orderData);
  const menuItems = generateOrderCards(orderDatas, cancelledOrders);

  return (
    <section id="orders" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between flex-wrap gap-8">
          {menuItems?.map((item, idx) => (
            <MenuCard {...item} key={idx} />
          ))}
        </div>

        <TableSection
          title="Order List"
          columns={columns}
          data={orderDatas}
          pageSize={10}
          isLoading={status === Status.FETCHING || status === Status.SAVING}
          placeholder="Search Customer..."
        />
      </main>
    </section>
  );
}

export default React.memo(Order);
