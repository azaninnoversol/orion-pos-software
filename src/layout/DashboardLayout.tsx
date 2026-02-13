"use client";

import React, { useEffect, useState } from "react";

//components
import DashboardHeader from "@/components/dashboard-components/DashboardHeader";
import MobileDrawer from "@/components/MobileDrawer";
import Sidebar from "@/components/Sidebar";

//icons
import {
  BookOpen,
  Calculator,
  House,
  Info,
  LayoutDashboard,
  MessageSquareText,
  NotepadTextDashed,
  Settings,
  ShoppingBasket,
  Users,
  UsersRound,
} from "lucide-react";

//store
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

//next
import { getCookie } from "cookies-next";

export interface DashboardItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const adminItems: DashboardItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { name: "Menu", icon: <BookOpen />, path: "/menu" },
  { name: "Staff Manage", icon: <UsersRound />, path: "/staff-manage" },
  { name: "Branches Manage", icon: <House />, path: "/branches-manage" },
  { name: "Customers", icon: <Users />, path: "/customers" },
  { name: "Reports", icon: <NotepadTextDashed />, path: "/reports" },
  { name: "Inbox", icon: <MessageSquareText />, path: "/inbox" },
  { name: "Settings", icon: <Settings />, path: "/settings" },
  { name: "Help", icon: <Info />, path: "/help" },
];

const cashierItems: DashboardItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/cashier/dashboard" },
  { name: "POS", icon: <Calculator />, path: "/cashier/pos" },
  { name: "Orders", icon: <ShoppingBasket />, path: "/cashier/orders" },
  { name: "Customers", icon: <Users />, path: "/cashier/customers" },
  { name: "Shift Manage", icon: <Users />, path: "/cashier/shift-manage" },
  { name: "Inbox", icon: <MessageSquareText />, path: "/cashier/inbox" },
];

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [sidebarItems, setSidebarItems] = useState<DashboardItem[]>([]);
  const role = getCookie("USER_ROLE") || "customer";
  const { theme } = useSelector((state: RootState) => state.themeSlice);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (role === "admin" || role === "manager") {
      setSidebarItems(adminItems);
    } else if (role === "cashier") {
      setSidebarItems(cashierItems);
    } else {
      setSidebarItems([]);
    }
  }, [role]);

  const handleToggleSidebar = (val: React.SetStateAction<boolean>) => {
    if (window.innerWidth <= 425) {
      setIsDrawerOpen((prev) => (typeof val === "function" ? (val as (p: boolean) => boolean)(prev) : val));
    } else {
      setIsSideBarOpen((prev) => (typeof val === "function" ? (val as (p: boolean) => boolean)(prev) : val));
    }
  };

  return (
    <div className="flex">
      {role !== "kitchen" && (
        <>
          <MobileDrawer items={sidebarItems} isSideBarOpen={isDrawerOpen} setIsSideBarOpen={setIsDrawerOpen} />
          <Sidebar items={sidebarItems} isSideBarOpen={isSideBarOpen} className="max-[425px]:hidden" />
        </>
      )}

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <DashboardHeader setIsSideBarOpen={handleToggleSidebar} />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export default React.memo(DashboardLayout);
