import { cancelledOrder } from "@/services/api_service";
import { Ban, CheckCircle, Clock, ShoppingBag, WalletMinimal } from "lucide-react";

export interface Orders {
  availableQty: number;
  icon: string;
  id: string;
  itemId: string;
  name: string;
  notes: string;
  price: number;
  qty: number;
  selectedAddons: string[];
  selectedCombos: string[];
  selectedSize: string;
  total: number;
}

type OrderType = "drive" | "takeaway" | "delivery";
export interface ProceedOrdersData {
  id: string;
  orderType?: OrderType;
  paymentMethod?: string;
  tableName?: string;
  totalAmount?: number;
  orders?: Orders[];
  status?: "pending" | "preparing" | "completed" | "cancelled";
  customerDetail?: {
    customerId?: string;
    apartmentNo?: string;
    buildingNo?: string;
    city?: string;
    country?: string;
    customerName?: string;
    floor?: string;
    phone?: string | number;
    street?: string;
  };
}

export function generateOrderData(data: ProceedOrdersData[]) {
  return data?.map((single: ProceedOrdersData) => {
    const totalPrice = single?.orders?.reduce((acc, val) => acc + Number(val.total), 0);

    let displayName = "";
    switch (single?.orderType) {
      case "delivery":
        displayName = single?.customerDetail?.customerName || "Delivery Customer";
        break;
      case "takeaway":
        displayName = "Takeaway";
        break;
      default:
        displayName = single?.tableName || "Dine In";
    }

    return {
      id: single?.id,
      orderType: single?.orderType,
      paymentMethod: single?.paymentMethod,
      tableName: single?.tableName,
      totalAmount: totalPrice,
      customerName: displayName,
      status: single?.status,
      orders: single?.orders,
      ...data,
    };
  });
}

export function generateOrderCards(data: ProceedOrdersData[], cancelledOrders: any[]) {
  const completedLength = data?.filter((single) => single?.status === "completed").length;
  const preparingLength = data?.filter((single) => single?.status === "preparing").length;
  const pendingLength = data?.filter((single) => single?.status === "pending").length;

  return [
    {
      title: "Orders Completed",
      numbers: completedLength,
      subCat: "Orders",
      icon: <CheckCircle size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Orders Preparing",
      numbers: preparingLength,
      subCat: "Orders",
      icon: <ShoppingBag size={40} />,
      color: "bg-orange-500",
    },
    {
      title: "Orders Pending",
      numbers: pendingLength,
      subCat: "Orders",
      icon: <Clock size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Orders Cancelled",
      numbers: cancelledOrders.length,
      subCat: "Orders",
      icon: <Ban size={40} />,
      color: "bg-red-500",
    },
  ];
}
