import { CustomerDetail } from "@/container/dashboard-pages/customers/data";
import { DiscountState } from "@/container/dashboard-pages/Menu";
import { formatNumber } from "@/lib/utils";
import { ProceedOrdersData } from "../order/data";
import { BadgeCent, CircleDollarSign, SquarePlus } from "lucide-react";
import { orderOverviewAmountType } from "../cashier/data";

export interface ShiftManageData {
  customersData: CustomerDetail[];
  discount: DiscountState;
  orderData: ProceedOrdersData[];
  cancelledOrders: any[];
}

export const ShiftManageData = ({
  customersData,
  discount,
  orderData,
  cancelledOrders,
  profile,
}: {
  customersData: any[];
  discount: { value: number };
  orderData: any[];
  cancelledOrders: any[];
  profile: any;
}) => {
  const branches = [profile?.branch].filter(Boolean);

  const discountValue = discount?.value || 0;
  const branchSummaries = branches.map((branchName) => {
    const branchCustomers = customersData?.filter((c) => c?.associateBranch?.name === branchName);
    const branchOrders = orderData?.filter((order) => branchCustomers?.some((cust) => cust?.phone === order?.customerDetail?.phone));
    const branchCancelledOrders = cancelledOrders?.filter((order) => branchCustomers?.some((cust) => cust?.phone === order?.customerDetail?.phone));
    const totalAmount = branchCustomers?.reduce((acc, val) => acc + Number(val.totalSpend || 0), 0) || 0;
    const completedLength = branchOrders?.filter((o) => o?.status === "completed")?.length || 0;

    const refunds =
      branchCancelledOrders?.reduce((acc, order) => {
        const orderTotal = order.orders?.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0) || 0;
        return acc + orderTotal;
      }, 0) || 0;

    const payMethodTypeAmountCard =
      branchOrders?.filter((o) => o?.paymentMethod === "card")?.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0) || 0;

    const payMethodTypeAmountCash =
      branchOrders?.filter((o) => o?.paymentMethod === "cash")?.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0) || 0;

    const taxes = totalAmount * 1;
    const netFund = totalAmount - refunds * (1 - discountValue / 100);
    const actualBalance = netFund - refunds;
    const expectedBalance = netFund + taxes - (netFund * discountValue) / 100;
    const difference = expectedBalance - actualBalance;

    return {
      branch: branchName,
      summary: [
        { label: "Total Sales", price: `${formatNumber(netFund)} EGP` },
        { label: "Refunds", price: `${formatNumber(refunds)} EGP` },
        { label: "Discounts", price: `${discountValue}%` },
        { label: "Orders (Total)", price: branchOrders?.length || 0 },
        { label: "Completed Orders", price: completedLength },
        {
          label: "Cancelled Orders",
          price: branchCancelledOrders?.length || 0,
        },
        {
          label: "Payment-Card",
          price: `${formatNumber(payMethodTypeAmountCard)} EGP`,
        },
        {
          label: "Payment-Cash",
          price: `${formatNumber(payMethodTypeAmountCash)} EGP`,
        },
        {
          label: "Taxes & Service Fees",
          price: `${formatNumber(taxes)} EGP`,
        },
        {
          label: "Expected Balance",
          price: `${formatNumber(expectedBalance)} EGP`,
        },
        {
          label: "Actual Balance",
          price: `${formatNumber(actualBalance)} EGP`,
        },
        { label: "Difference", price: `${formatNumber(difference)} EGP` },
      ],
    };
  });

  return branchSummaries;
};

export const generateOrderOverviewAmount = (shiftData: any, orderData: any[]) => {
  const payMethodTypeAmountCash =
    orderData?.filter((single) => single?.paymentMethod === "cash").reduce((acc, val) => acc + Number(val.totalAmount || 0), 0) || 0;

  const totalCashIn = (shiftData?.cashIn ?? 0) + payMethodTypeAmountCash;
  const tillAmount = shiftData?.balance + shiftData?.cashIn - shiftData?.cashOut;

  return [
    {
      type: "balance",
      icon: <SquarePlus />,
      title: "Opening Balance",
      amount: formatNumber(shiftData?.balance) ?? 0,
      currency: "EGP",
    },
    {
      type: "cashIn",
      icon: <CircleDollarSign />,
      title: "Cash In",
      amount: formatNumber(totalCashIn) ?? 0,
      currency: "EGP",
    },
    {
      type: "cashOut",
      icon: <CircleDollarSign />,
      title: "Cash Out",
      amount: formatNumber(shiftData?.cashOut) ?? "00",
      currency: "EGP",
    },
    {
      type: "tillAmount",
      icon: <BadgeCent />,
      title: "Current Till Amount",
      amount: formatNumber(tillAmount || shiftData?.tillAmount) ?? "00",
      currency: "EGP",
    },
  ];
};
