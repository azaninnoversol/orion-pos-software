"use client";
import React, { useEffect, useState } from "react";

// components
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import DeleteModal from "./DeleteModal";
import Logo from "./Logo";
import CustomTooltip from "./CustomTooltip";

// icons
import { Search, LogOut } from "lucide-react";

// helper
import { cn } from "@/lib/utils";

// next
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

// toast
import { toast } from "sonner";

// types
import { DashboardItem } from "@/layout/DashboardLayout";

interface SideBarProps {
  isSideBarOpen: boolean;
  className?: string;
  items?: any;
}

const Sidebar: React.FC<SideBarProps> = ({ isSideBarOpen, className, items }) => {
  const [active, setActive] = useState<string>("/dashboard");
  const [showText, setShowText] = useState<boolean>(isSideBarOpen);
  const [isVerySmallMobile, setIsVerySmallMobile] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  const logoutHandler = () => setOpenModal(true);

  const confirmLogout = () => {
    deleteCookie("TOKEN");
    deleteCookie("USER_ROLE");
    toast.success("You logged out successfully!");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsVerySmallMobile(width <= 425);
      setShowText(width > 1024 ? isSideBarOpen : false);
    };

    setTimeout(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
    }, 250);

    return () => window.removeEventListener("resize", handleResize);
  }, [isSideBarOpen]);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const selectRouteHandler = (single: DashboardItem) => {
    setActive(single.path);
    router.push(single.path);
  };

  const sidebarCollapsed = !showText;

  return (
    <div
      className={cn(
        "bg-[#F7F7F9] dark:bg-[#1D1D27] px-5 py-8 sticky top-0 left-0 flex flex-col transition-all duration-300 ease-in-out shadow-md h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#40404E] scrollbar-track-transparent z-50 hide-scrollbar",
        isVerySmallMobile ? "hidden" : sidebarCollapsed ? "w-[80px] min-w-[80px]" : "w-[210px] min-w-[210px]",
        className,
      )}
    >
      <Logo isSideBarOpen={!sidebarCollapsed} />
      <hr className="mt-5 h-[2px] w-full dark:bg-white" />

      {!sidebarCollapsed && (
        <div className="mt-8 w-full">
          <div className="flex items-center relative">
            <Search className="absolute left-2" color="#828282" />
            <Input
              placeholder="Search"
              className="pl-9 font-medium text-[#828282] rounded-3xl border-2 h-[40px] dark:text-white"
              onChange={() => {}}
              value={""}
            />
          </div>
        </div>
      )}

      <SideBarButtons
        active={active}
        sidebarCollapsed={sidebarCollapsed}
        selectRouteHandler={selectRouteHandler}
        logoutHandler={logoutHandler}
        openModal={openModal}
        setOpenModal={setOpenModal}
        confirmLogout={confirmLogout}
        items={items}
      >
        <div className="mt-6 flex items-center justify-center">
          <CustomTooltip title="Logout">
            <Button
              className={cn(
                "text-white bg-[#3238a1] dark:bg-card rounded-full min-h-[45px] cursor-pointer transition-all duration-200",
                sidebarCollapsed ? "w-[60px] justify-center rounded-xl" : "w-[170px] justify-start",
              )}
              onClick={logoutHandler}
            >
              <LogOut className={cn("mr-2", sidebarCollapsed && "mr-0")} />
              {!sidebarCollapsed && "Logout"}
            </Button>
          </CustomTooltip>
        </div>
      </SideBarButtons>
    </div>
  );
};

export default React.memo(Sidebar);

export interface SideBarButtonsProps {
  className?: string;
  active: string;
  sidebarCollapsed: boolean;
  selectRouteHandler: (single: DashboardItem) => void;
  logoutHandler: () => void;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmLogout: () => void;
  children?: React.ReactNode;
  items: any;
}

export const SideBarButtons: React.FC<SideBarButtonsProps> = ({
  active,
  sidebarCollapsed,
  selectRouteHandler,
  openModal,
  setOpenModal,
  confirmLogout,
  children,
  className = "",
  items,
}) => {
  return (
    <div className={cn("flex flex-col justify-between flex-1 mt-10 w-full", className)}>
      <div className={cn("flex flex-col gap-4", sidebarCollapsed && "items-center")}>
        {items.map((single: any, idx: number) => {
          const isActive = active === single.path || (single.path === "/branches-manage" && active.startsWith("/branches-manage"));

          return (
            <CustomTooltip key={idx} title={single.name}>
              <Button
                className={cn(
                  "rounded-full justify-start min-h-[45px] cursor-pointer transition-all duration-200 hover:text-white dark:text-white hover:dark:text-white",
                  sidebarCollapsed ? "w-[60px] justify-center rounded-xl" : "w-[170px]",
                  isActive ? "bg-[#3238a1] text-white hover:bg-[#3238a1]" : "bg-transparent text-black hover:bg-[#3238a1]",
                )}
                onClick={() => selectRouteHandler(single)}
              >
                <span className={cn("flex justify-center items-center", !sidebarCollapsed ? "mr-2" : "mr-0")}>{single.icon}</span>
                {!sidebarCollapsed && single.name}
              </Button>
            </CustomTooltip>
          );
        })}
      </div>

      {children}

      <DeleteModal
        open={openModal}
        setOpen={setOpenModal}
        title="Confirm Logout!"
        description="Are you sure you want to logout? All unsaved progress will be lost."
        confirmText="Logout Now"
        cancelText="Stay Logged In"
        onConfirm={confirmLogout}
      />
    </div>
  );
};
