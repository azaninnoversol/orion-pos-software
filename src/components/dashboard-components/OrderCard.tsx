import React, { useState } from "react";

//components
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { RoundedName } from "@/container/dashboard-pages/branches-manage/BranchManageCard";
import { Button } from "../ui/button";
import CustomModal from "../CustomModal";

//icons
import { Box, CircleCheck, Clock, ShoppingBag } from "lucide-react";

//helper
import { formatTime } from "@/lib/utils";

// api-service
import { proceedOrder } from "@/services/api_service";

//toast
import { toast } from "sonner";

type Props = {
  id?: string;
  updatedAt?: number;
  orders?: any[];
  notes?: string;
  customerDetail?: any;
  status?: Status;
  orderType?: string;
  tableName?: string;
  refetch?: () => void;
  orderDeleteHandler?: () => void;
};

export enum LoadingStatus {
  IDLE = "idle",
  SAVING = "saving",
  FETCHED = "fetched",
  FETCHING = "fetching",
  FETCH_ID = "fetchingID",
  ERROR = "error",
}

type Status = "pending" | "preparing" | "ready" | "completed" | "delivered";

const nextStatus: Record<Status, Status | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: "delivered",
  delivered: null,
};

const statusLabel: Record<Status, string> = {
  pending: "Start",
  preparing: "Ready",
  ready: "Completed",
  completed: "Delivered",
  delivered: "Delivered",
};

export const getExpectedTime = (index: number, perOrderMinutes = 8, bufferMinutes = 10) => {
  const now = new Date();
  const expected = new Date();
  expected.setMinutes(expected.getMinutes() + perOrderMinutes * (index + 1));

  if (expected < now) {
    expected.setMinutes(now.getMinutes() + bufferMinutes * (index + 1));
  }

  let hours = expected.getHours();
  const minutes = expected.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

function OrderCard({ orders, updatedAt, id, customerDetail, status = "pending", orderType, tableName, refetch, orderDeleteHandler }: Props) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [isCancelling, setIsCancelling] = useState(false);

  const allNotes = orders
    ?.filter((item) => item.notes?.trim()?.length > 0)
    ?.map((item) => item.notes)
    ?.join(" | ");

  const handleStatusUpdate = async () => {
    const newStatus = nextStatus[status];
    if (newStatus === "delivered") {
      await orderDeleteHandler?.();
      return;
    }
    if (!newStatus) {
      toast.info("Order already delivered!");
      return;
    }

    setLoadingStatus(LoadingStatus.SAVING);
    try {
      await proceedOrder.update(id as string, { status: newStatus });
      toast.success(`Order marked as ${newStatus}!`);
    } catch (err) {
      toast.error("Error updating order.");
    } finally {
      setLoadingStatus(LoadingStatus.IDLE);
      refetch?.();
    }
  };

  const orderCancelHandler = async () => {
    setIsCancelling(true);
    try {
      await orderDeleteHandler?.();
      setIsDetailModalOpen(false);
    } catch {
      toast.error("Error cancelling order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="w-full min-h-[400px] flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <CardHeaderCom orderType={orderType} customerDetail={customerDetail} updatedAt={updatedAt} status={status} id={id} />
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <CardContentTable orders={orders} />
      </CardContent>

      {allNotes && (
        <p className="px-4 sm:px-6 text-center mt-2 text-sm sm:text-base break-words">
          <strong className="pr-1">Note:</strong>
          {allNotes}
        </p>
      )}

      <CardFooter className="mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            className="flex-1 bg-transparent! dark:text-white dark:bg-card border border-[#3238a1] text-[#3238a1] text-sm sm:text-base"
            onClick={() => setIsDetailModalOpen(true)}
          >
            Details
          </Button>
          <Button
            disabled={status === "delivered"}
            className="flex-1 bg-[#3238a1] dark:hover:bg-[#3238a1] dark:text-white hover:dark:text-white text-sm sm:text-base"
            onClick={handleStatusUpdate}
          >
            {loadingStatus === LoadingStatus.SAVING ? "Submitting..." : statusLabel[status]}
          </Button>
        </div>
      </CardFooter>

      <CustomModal
        open={isDetailModalOpen}
        setOpen={(val) => (!val ? setIsDetailModalOpen(false) : null)}
        header={<span>Order Details</span>}
        className="w-[90%] sm:w-[70%] md:w-[60%] max-w-[760px]"
      >
        <div className="flex flex-col gap-4 overflow-x-hidden">
          <CardHeaderCom orderType={orderType} customerDetail={customerDetail} updatedAt={updatedAt} status={status} id={id} />

          <div className="flex flex-col sm:flex-row gap-4 justify-between text-sm sm:text-base">
            {tableName && (
              <p className="truncate">
                Table Number: <strong>{tableName}</strong>
              </p>
            )}

            {customerDetail?.customerName && (
              <p className="truncate">
                Customer Name: <strong>{customerDetail?.customerName}</strong>
              </p>
            )}

            {orderType === "takeaway" && (
              <p className="truncate">
                Is Takeaway ? <strong>YES</strong>
              </p>
            )}

            <p className="truncate">
              Expected Time: <strong>{getExpectedTime(orders?.length as number, 8)}</strong>
            </p>
          </div>

          <CardContentTable orders={orders} />

          {allNotes && (
            <p className="px-4 text-center mt-2 text-sm sm:text-base break-words">
              <strong className="pr-1">Note:</strong>
              {allNotes}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              disabled={isCancelling}
              className="flex-1 bg-transparent! dark:text-white dark:bg-card  border border-[#3238a1] text-[#3238a1]"
              onClick={orderCancelHandler}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </Button>

            <Button
              disabled={status === "delivered"}
              className="flex-1 bg-[#3238a1] dark:hover:bg-[#3238a1] dark:text-white hover:dark:text-white text-sm sm:text-base"
              onClick={handleStatusUpdate}
            >
              {loadingStatus === LoadingStatus.SAVING ? "Submitting..." : statusLabel[status]}
            </Button>
          </div>
        </div>
      </CustomModal>
    </Card>
  );
}

export default OrderCard;

const CardHeaderCom = ({ orderType, customerDetail, updatedAt, status, id }: Props) => {
  const initials =
    customerDetail?.customerName
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase() || (orderType === "takeaway" ? "TA" : "DINE");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
      <header className="flex items-center gap-2 flex-1 min-w-0">
        <RoundedName className="flex-shrink-0">{initials}</RoundedName>

        <div className="flex flex-col min-w-0">
          <p className="max-w-[120px] sm:max-w-[150px] truncate text-sm sm:text-base uppercase">#{id}</p>
          <strong className="text-xs sm:text-sm">{formatTime(updatedAt)}</strong>
        </div>
      </header>

      <div className="mt-2 sm:mt-0 flex-shrink-0">
        {status === "preparing" ? (
          <Button className="dark:text-white rounded-full !bg-[#3238a1] text-xs sm:text-sm flex items-center gap-1 py-1 px-2">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Preparing</span>
          </Button>
        ) : status === "ready" ? (
          <Button className="dark:text-white rounded-full !bg-green-500 text-xs sm:text-sm flex items-center gap-1 py-1 px-2">
            <CircleCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Ready</span>
          </Button>
        ) : status === "completed" ? (
          <Button className="dark:text-white rounded-full !bg-[#5a5fe4] text-xs sm:text-sm flex items-center gap-1 py-1 px-2">
            <span className="border-2 border-white rounded-full p-1">
              <Box className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
            <span>Completed</span>
          </Button>
        ) : status === "delivered" ? (
          <Button className="dark:text-white rounded-full !bg-[#3238a1] opacity-60 text-xs sm:text-sm flex items-center gap-1 py-1 px-2">
            <Box className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Delivered</span>
          </Button>
        ) : (
          <Button className="dark:text-white rounded-full !bg-orange-400 text-xs sm:text-sm flex items-center gap-1 py-1 px-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Pending</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const CardContentTable = ({ orders }: Props) => {
  return (
    <div className="overflow-y-auto min-h-[150px] max-h-[150px] h-[150px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F3F5F7] dark:bg-[#1D1D27] dark:border-y dark:border-y-amber-300 text-gray-400 font-medium">
            <th className="dark:text-white px-4 py-2 min-w-[110px] text-left">Item</th>
            <th className="dark:text-white px-4 py-2 text-left">S</th>
            <th className="dark:text-white px-4 py-2 text-left">Q</th>
          </tr>
        </thead>

        <tbody>
          {orders?.map((item, idx) => (
            <tr key={idx} className="border-b border-b-[#F3F5F7] text-gray-600 font-medium">
              <td className="dark:text-white px-4 py-2 min-w-[110px]">{item?.name}</td>
              <td className="dark:text-white px-4 py-2">{item?.selectedSize}</td>
              <td className="dark:text-white px-4 py-2">{item?.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
