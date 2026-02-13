"use client";
import React, { useEffect, useState } from "react";

//components
import CustomTooltip from "@/components/CustomTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";

//helper-functions
import { formatTime } from "@/lib/utils";

//redux
import { setTheme, ThemeState } from "@/redux/Theme/Theme";
import { useDispatch, useSelector } from "react-redux";

//api-service
import { BrancheManageService, branchManageService } from "@/services/api_service";

//icons
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

//toast
import { toast } from "sonner";

//types
import { Status } from "./dashboard-pages/customers/data";
import { isBranchOpen } from "./dashboard-pages/branches-manage/data";

//next
import { useRouter } from "next/navigation";
import Link from "next/link";

function Settings() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: any) => state.themeSlice);
  const [branchData, setBranchData] = useState<BrancheManageService[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);

  const fetchBranches = async () => {
    setStatus(Status.FETCHING);
    try {
      const data = await branchManageService.getAll();
      setBranchData(data);
      setStatus(Status.IDLE);
    } catch (error) {
      setStatus(Status.IDLE);
      toast.error(`Somthing Went Wrong! Error : ${error as string}`);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  if (status === Status.FETCHING) {
    return <Loading className="min-h-[80vh]!" />;
  }

  return (
    <section id="setting">
      <main className="mx-8">
        <ThemeSetting theme={theme} dispatch={dispatch} />
        <StoreSetting branchData={branchData} />

        <h1 className="text-2xl font-semibold mt-10 mb-4">User Roles & Permissions</h1>
        <div className="mt-10 flex items-center justify-between gap-2">
          {/* Cashier */}
          <div className="mb-4">
            <h2 className="text-xl font-medium">Cashier</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-200">
              <li>Generate billing / invoices</li>
              <li>Scan or search products</li>
              <li>Apply discounts (limited)</li>
              <li>Receive payments (Cash, Card, Wallet)</li>
              <li>Print receipts</li>
              <li>View daily sales reports (read-only)</li>
            </ul>
          </div>

          {/* Kitchen Worker */}
          <div className="mb-4">
            <h2 className="text-xl font-medium">Kitchen Worker</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-200">
              <li>Prepare orders</li>
              <li>Update order status</li>
              <li>View order queue</li>
              <li>Monitor ingredients / stock low alerts (read-only)</li>
            </ul>
          </div>

          {/* Manager */}
          <div className="mb-4">
            <h2 className="text-xl font-medium">Manager</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-200">
              <li>Manage branch settings</li>
              <li>Inventory management</li>
              <li>Manage employees</li>
              <li>View sales reports and analytics</li>
              <li>Set discounts, taxes, and promotions</li>
              <li>Approve refunds / returns</li>
            </ul>
          </div>
        </div>

        <PersonalInformation />
      </main>
    </section>
  );
}

export default React.memo(Settings);

const ThemeSetting = ({ theme, dispatch }: { theme: string; dispatch: any }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Theme Prefence Settings</h1>
      <Select value={theme} onValueChange={(val) => dispatch(setTheme(val as ThemeState))}>
        <SelectTrigger className="w-2/5 mt-4 h-8 text-xs md:text-sm border-gray-200">
          <SelectValue placeholder="Select Theme Preference" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light Theme</SelectItem>
          <SelectItem value="dark">Dark Theme</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const StoreSetting = ({ branchData }: { branchData: any[] }) => {
  const router = useRouter();

  const branchDetailHandler = (name: string, id: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/branches-manage/${slug}/${id}`);
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-semibold mb-4">Store Settings</h1>

      <div className="flex items-center gap-2">
        <strong>Total Branches:</strong>
        <p>{branchData?.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchData?.map((single, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer border rounded-lg p-4 shadow-sm dark:bg-[#1D1D27] bg-white transform transition-all duration-500 ease-out opacity-0 translate-y-5 hover:shadow-md hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
            onClick={() => branchDetailHandler(single.branchName, single?.id)}
          >
            <div className="flex items-center gap-2 absolute right-4">
              {isBranchOpen(single.shiftStartTime, single.shiftEndTime) ? (
                <CustomTooltip title="Shop Open">
                  <LockKeyholeOpen size={40} />
                </CustomTooltip>
              ) : (
                <CustomTooltip title="Shop Close">
                  <LockKeyhole size={40} />
                </CustomTooltip>
              )}
            </div>

            <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">{single.branchName}</h2>
            <div className="flex flex-col gap-1 text-gray-600 text-sm">
              {single.phone && (
                <span>
                  <strong className="dark:text-gray-200">Phone:</strong>{" "}
                  <a href={`tel:+${single.phone}`} className="text-blue-600 dark:text-blue-300 hover:underline">
                    {single.phone}
                  </a>
                </span>
              )}

              {single.country && (
                <span className="dark:text-gray-200">
                  <strong>Country:</strong> {single.country}
                </span>
              )}

              {single.city && (
                <span className="dark:text-gray-200">
                  <strong>City:</strong> {single.city}
                </span>
              )}

              {single?.shiftStartTime && (
                <span className="dark:text-gray-200">
                  <strong>Shift Start Time</strong> {formatTime(single.shiftStartTime)}
                </span>
              )}

              {single?.shiftEndTime && (
                <span className="dark:text-gray-200">
                  <strong>Shift End Time</strong> {formatTime(single.shiftEndTime)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PersonalInformation = () => {
  return (
    <div className="mt-10 flex items-center justify-between">
      <h1 className="text-2xl font-semibold mb-4">Personal Information</h1>
      <Link href={"/my-account"}>
        <CustomTooltip title="Go To Profile">
          <Button className="rounded-sm bg-card dark:text-white text-black hover:bg-purple-500">Edit Your Account</Button>
        </CustomTooltip>
      </Link>
    </div>
  );
};
