import { BadgeCent, Ban, CircleCheck, CircleDollarSign, Clock, ShoppingBag, SquarePlus } from "lucide-react";
import { ProceedOrdersData } from "../order/data";

export const orderData = [
  {
    id: "#001",
    customerName: "Ahmed Mustafa",
    amount: "1200 EGP",
    status: "pending",
    paymentMethod: "card",
  },
  {
    id: "#002",
    customerName: "Saleem Rabbani",
    amount: "5200 EGP",
    status: "preparing",
    paymentMethod: "cash",
  },
  {
    id: "#003",
    customerName: "Jason Holder",
    amount: "1900 EGP",
    status: "preparing",
    paymentMethod: "cash",
  },
  {
    id: "#004",
    customerName: "Marlon Samuels",
    amount: "3000 EGP",
    status: "pending",
    paymentMethod: "card",
  },
];

export interface OrderOverviewPrp {
  title: string;
  totalOrder: number | string;
  icon: React.ReactNode;
  bgColor: string;
}

export const generateOrderOverview = (ordersData: ProceedOrdersData[], cancelledOrders: any[]) => {
  const completedCount = ordersData.filter((order) => order.status === "completed").length;
  const preparingCount = ordersData.filter((order) => order.status === "preparing").length;
  const pendingCount = ordersData.filter((order) => order.status === "pending").length;
  const cancelledCount = cancelledOrders?.length;

  return [
    {
      title: "Orders Completed",
      totalOrder: completedCount,
      icon: <CircleCheck size={30} />,
      bgColor: "green",
    },
    {
      title: "Orders Preparing",
      totalOrder: preparingCount,
      icon: <ShoppingBag size={30} />,
      bgColor: "#3238a1",
    },
    {
      title: "Orders Pending",
      totalOrder: pendingCount,
      icon: <Clock size={30} />,
      bgColor: "orange",
    },
    {
      title: "Orders Cancelled",
      totalOrder: cancelledCount,
      icon: <Ban size={30} />,
      bgColor: "red",
    },
  ] as OrderOverviewPrp[];
};

export type orderOverviewAmountType = "balance" | "cashIn" | "cashOut" | "tillAmount";
export interface OrderOverviewAmount {
  icon?: React.ReactNode;
  title?: string;
  amount?: string | number;
  currency?: string;
  type: any;
}

export const orderOverviewAmount: OrderOverviewAmount[] = [
  {
    icon: <SquarePlus />,
    title: "Opening Balance",
    amount: "1,000",
    currency: "EGP",
    type: "balance",
  },
  {
    icon: <CircleDollarSign />,
    title: "Cash In",
    amount: "4500",
    currency: "EGP",
    type: "cashIn",
  },
  {
    icon: <CircleDollarSign />,
    title: "Cash Out",
    amount: "500",
    currency: "EGP",
    type: "cashOut",
  },
  {
    icon: <BadgeCent />,
    title: "Current Till Amount",
    amount: "4500",
    currency: "EGP",
    type: "tillAmount",
  },
] as const;
