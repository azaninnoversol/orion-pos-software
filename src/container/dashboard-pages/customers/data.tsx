import { ProceedOrdersData } from "@/container/cashier-pages/order/data";
import { UserMinus, UserRoundCheck, Users } from "lucide-react";

export const generateCustomerCards = (data: CustomerDetail[]) => {
  const totalCustomer = data?.length ?? 0;

  const today = new Date();

  const activeCustomers = data?.filter((c) => {
    if (!c.lastVisit) return false;
    const lastVisitDate = new Date(c.lastVisit);
    const diffDays = (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  const inactiveCustomers = data?.filter((c) => {
    if (!c.lastVisit) return false;
    const lastVisitDate = new Date(c.lastVisit);
    const diffDays = (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 60;
  }).length;

  const returningCustomers = data?.filter((c) => Number(c.ordersNumber ?? 0) > 1).length;

  return [
    {
      title: "Total Customers",
      numbers: totalCustomer,
      subCat: "Customer",
      icon: <Users size={40} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Customers",
      numbers: activeCustomers,
      subCat: "Customer",
      icon: <UserRoundCheck size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Returning Customers",
      numbers: returningCustomers,
      subCat: "Customer",
      icon: <Users size={40} />,
      color: "bg-orange-500",
    },
    {
      title: "Inactive Customers",
      numbers: inactiveCustomers,
      subCat: "Customer",
      icon: <UserMinus size={40} />,
      color: "bg-red-500",
    },
  ];
};

export enum Status {
  IDLE = "idle",
  SAVING = "saving",
  FETCHED = "fetched",
  FETCHING = "fetching",
  FETCH_ID = "fetchingID",
  ERROR = "error",
}

export interface BranchItems {
  value: string;
  name: string;
}

export interface DefaultCustomerFormData {
  customerName?: string;
  phone?: string | number;
  associateBranch: BranchItems;
  ordersNumber?: number | string;
  totalSpend?: number | string;
  loyalty?: string | number | boolean | any;
  lastVisit?: string | Date;
  managerId?: string;
}

export interface CustomerDetail extends DefaultCustomerFormData {
  id?: string;
  createdAt?: string | Date;
}

export function convertFirebaseDataToCustomer(data: CustomerDetail[], orderData: ProceedOrdersData[]): CustomerDetail[] {
  return data?.map((single: CustomerDetail) => {
    return {
      id: single?.id,
      customerName: single?.customerName,
      phone: single?.phone,
      associateBranch: single?.associateBranch,
      ordersNumber: single?.ordersNumber,
      totalSpend: single?.totalSpend,
      loyalty: single?.loyalty,
      lastVisit: single?.lastVisit,
      createdAt: single?.createdAt,
    };
  });
}

export const getColor = (loyalty: string) => {
  switch (loyalty) {
    case "Gold":
      return "#FFD700";
    case "Silver":
      return "#C0C0C0";
    case "Bronze":
      return "#CD7F32";
    default:
      return "#D3D3D3";
  }
};
