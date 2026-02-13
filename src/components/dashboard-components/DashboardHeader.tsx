"use client";
import React, { useEffect, useMemo, useState } from "react";

// images
import { IMAGES } from "@/utils/resourses";

// icons
import { LogOut, MessageSquareMore, Moon, PanelTopClose, RefreshCw, ShoppingCart, StepBack, SunMedium } from "lucide-react";

// next
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// components
import CustomTooltip from "../CustomTooltip";
import KitchenNotification from "@/container/kitchen-pages/KitchenNotification";
import CashierNotification from "@/container/cashier-pages/CashierNotification";
import DeleteModal from "../DeleteModal";

// api-service
import { staffManageService, userService } from "@/services/api_service";

// toast
import { toast } from "sonner";

// firebase
import { onAuthStateChangedListener } from "@/services/AuthService";

// next
import { deleteCookie } from "cookies-next";

// redux
import { AppDispatch, RootState } from "@/redux/store";
import { toggleTheme } from "@/redux/Theme/Theme";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "@/redux/OrderDrawerSlice/OrderDrawerSlice";

interface Brightness {
  name: "light" | "dark";
  icon: React.ReactNode;
}

const BrightnessIcon: Brightness[] = [
  { name: "light", icon: <SunMedium /> },
  { name: "dark", icon: <Moon size={25} /> },
];

interface HeaderProps {
  setIsSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardHeader({ setIsSideBarOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [staffDocId, setStaffDocId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.themeSlice);

  const switchBrightnessHandler = (single: Brightness) => {
    if (theme === single.name) return;
    dispatch(toggleTheme());
  };

  const openSliderHandler = () => setIsSideBarOpen?.((prev) => !prev);
  const openOrderDrawerHandler = () => dispatch(openDrawer());
  const logoutHandler = () => setOpenModal(true);
  const confirmLogout = () => {
    deleteCookie("TOKEN");
    deleteCookie("USER_ROLE");
    toast.success("You logged out successfully!");
    window.location.href = "/login";
  };

  async function fetchUserDetails() {
    setIsLoading(true);
    try {
      const items = await userService.getAll();
      setProfileData(items);
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (currentUser && profileData.length > 0) {
      const foundUser = profileData.find((u) => u.id === currentUser.uid);
      setUserProfile(foundUser || null);
    }
  }, [currentUser, profileData]);

  useEffect(() => {
    if (!currentUser) return;

    const getStaffDoc = async () => {
      try {
        const staffList = await staffManageService.getAll();
        const staff = staffList.find((s: any) => s.email === currentUser.email);
        if (staff) setStaffDocId(staff.id);
      } catch (error) {
        console.error("Failed to fetch staff doc:", error);
      }
    };

    getStaffDoc();
  }, [currentUser]);

  const title = useMemo(() => {
    if (pathname === "/dashboard") return "Dashboard";
    else if (pathname === "/menu") return "Menu";
    else if (pathname === "/staff-manage") return "Staff Manage";
    else if (pathname.startsWith("/branches-manage")) return "Branches Manage";
    else if (pathname === "/customers") return "Customers";
    else if (pathname === "/reports") return "Reports";
    else if (pathname === "/my-account") return "My Account";
    else if (pathname === "/settings") return "Settings";
    else if (pathname === "/inbox") return "Inbox";
    else if (pathname === "/help") return "Help Center";
    else if (pathname === "/cashier/dashboard") return "Dashboard";
    else if (pathname === "/cashier/pos") return "POS";
    else if (pathname === "/cashier/orders") return "Order";
    else if (pathname === "/cashier/customers") return "Customer";
    else if (pathname === "/cashier/shift-manage") return "Shift Manage";
    else if (pathname === "/cashier/inbox") return "Cashier Inbox";
    else if (pathname === "/kitchen/notifications") return "Notification List";
    else if (pathname === "/kitchen/dashboard") return "Orders List";
    else if (pathname === "/kitchen/inbox") return "Kitchen Inbox";
    else return "Orion POS";
  }, [pathname]);

  return (
    <header className="w-full flex justify-center mt-6 bg-[#f3f5f7] dark:bg-[#07080800]">
      <div className="bg-white dark:bg-[#1D1D27] max-[520px]:items-center max-[520px]:justify-center max-[520px]:py-2 max-[520px]:gap-3 min-h-[60px] w-[95%] rounded-sm px-3 flex justify-between items-center flex-wrap">
        <div className="flex items-center gap-1 flex-shrink-0">
          {userProfile?.role !== "kitchen" ? (
            <PanelTopClose className="rotate-[270deg] cursor-pointer dark:stroke-gray-400" size={18} color="grey" onClick={openSliderHandler} />
          ) : (
            pathname === "/kitchen/inbox" && (
              <CustomTooltip title="Go Back">
                <StepBack size={18} className="cursor-pointer" onClick={() => router.back()} />
              </CustomTooltip>
            )
          )}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap">{title}</h3>
        </div>

        <div className="flex gap-2 sm:gap-4 items-center flex-shrink-0">
          <SwitchButton activeBrightness={theme} switchBrightnessHandler={switchBrightnessHandler} />

          {userProfile?.role === "kitchen" && pathname !== "/kitchen/inbox" && (
            <CustomTooltip title="Chats">
              <MessageSquareMore
                size={18}
                color="black"
                className="cursor-pointer dark:text-white dark:stroke-white"
                onClick={() => router.push("/kitchen/inbox")}
              />
            </CustomTooltip>
          )}

          {userProfile?.role === "kitchen" && (
            <CustomTooltip title="Logout">
              <LogOut size={18} color="black" className="cursor-pointer dark:text-white dark:stroke-white" onClick={logoutHandler} />
            </CustomTooltip>
          )}

          <CustomTooltip title="Reload Page">
            <RefreshCw
              size={18}
              color="black"
              className="cursor-pointer dark:text-white dark:stroke-white"
              onClick={() => window?.location?.reload()}
            />
          </CustomTooltip>

          {userProfile?.role === "kitchen" ? <KitchenNotification staffDocId={staffDocId} /> : <CashierNotification staffDocId={staffDocId} />}

          {pathname === "/cashier/pos" && (
            <CustomTooltip title="Order Details">
              <ShoppingCart size={18} color="black" className="cursor-pointer dark:text-white dark:stroke-white" onClick={openOrderDrawerHandler} />
            </CustomTooltip>
          )}

          <ProfileView isLoading={isLoading} profile={userProfile} />

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
      </div>
    </header>
  );
}

export default React.memo(DashboardHeader);

const ProfileView = ({ isLoading, profile }: { isLoading: boolean; profile: any }) => {
  const router = useRouter();
  const profileHandler = () => router.push("/my-account");
  return (
    <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={profileHandler}>
      <div className="rounded-[5px] w-[35px] h-[35px] sm:w-[40px] sm:h-[40px]">
        <Image className="rounded-[5px] h-full w-full object-cover" src={IMAGES.user} alt="profile-icon" width={50} height={60} />
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-[12px] sm:text-[14px] capitalize">{isLoading ? "loading...." : profile?.name}</h4>
        <p className="text-[12px] sm:text-[14px] text-gray-500">{isLoading ? "loading...." : profile?.role}</p>
      </div>
    </div>
  );
};

const SwitchButton: React.FC<{ activeBrightness: string; switchBrightnessHandler: (single: Brightness) => void }> = ({
  activeBrightness,
  switchBrightnessHandler,
}) => (
  <div className="bg-gray-200 dark:bg-gray-400 w-fit h-[40px] sm:h-[40px] rounded-full flex items-center justify-between gap-2 px-2">
    {BrightnessIcon.map((single) => (
      <CustomTooltip title={single?.name} key={single.name}>
        <span
          onClick={() => switchBrightnessHandler(single)}
          className={`rounded-full p-1 transition-all duration-300 cursor-pointer ${
            activeBrightness === single.name ? "bg-[#3238a1] text-white scale-110" : "bg-white text-gray-600 dark:bg-gray-700 dark:text-white"
          }`}
        >
          {single.icon}
        </span>
      </CustomTooltip>
    ))}
  </div>
);
