import { UserRoundCheck, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";
import { BranchValue } from "../StaffManage";

export interface Staff {
  id: string;
  name: string;
  role: string;
  branch?: BranchValue;
  status?: "active" | "inactive";
  email?: string;
  phone?: string | number;
  createdAt?: Date | number;
}

export const generateStaffIcon = (items: Staff[]) => {
  const totalStaff = items?.length;
  const activeStaff = items.filter((i) => i.status).length;
  const inactiveStaff = items.filter((i) => !i.status).length;

  const newStaff = items.filter((i) => {
    if (!i.createdAt) return false;
    const joined = new Date(i.createdAt);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return joined > oneDayAgo;
  }).length;

  return [
    {
      title: "Total Staff",
      numbers: totalStaff,
      subCat: "Staff",
      icon: <Users size={40} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Staff",
      numbers: activeStaff,
      subCat: "Staff",
      icon: <UserRoundCheck size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Inactive Staff",
      numbers: inactiveStaff,
      subCat: "Staff",
      icon: <UserRoundMinus size={40} />,
      color: "bg-orange-500",
    },
    {
      title: "New Staff",
      numbers: newStaff,
      subCat: "Items",
      icon: <UserRoundPlus size={40} />,
      color: "bg-red-500",
    },
  ];
};

export function convertFirebaseDataToStaff(data: any[]): Staff[] {
  const managerId = localStorage.getItem("USER_ID");
  const staffData = data?.filter((single: any) => {
    if (managerId) {
      return single?.managerId === managerId;
    }
    return true;
  });

  return staffData?.map((single: any) => ({
    id: single?.id,
    name: single?.name,
    role: single?.role,
    branch: single?.branch,
    status: single?.status,
    email: single?.email,
    phone: single?.phone,
    createdAt: single?.createdAt,
  }));
}

export const staff_role = [
  { name: "Admin", value: "admin" },
  { name: "Manager", value: "manager" },
  { name: "Worker", value: "worker" },
  { name: "Cashier", value: "cashier" },
  { name: "Kitchen Worker", value: "kitchen" },
  { name: "Waiter", value: "waiter" },
  { name: "Delivery", value: "delivery" },
  { name: "Cleaner", value: "cleaner" },
] as const;

export type StaffManageRole = (typeof staff_role)[number]["value"];
