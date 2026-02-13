"use client";
import React, { useState } from "react";

//mock-data
import { branchesManage } from "./data";

//helper-function
import { cn } from "@/lib/utils";

//components
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/CustomTooltip";
import DeleteModal from "@/components/DeleteModal";

//next
import { useRouter } from "next/navigation";

//icons
import { Trash2 } from "lucide-react";

interface DefaultFormState {
  id: string;
  manager: string;
  branchName: string;
  city: string;
  phone: string | number;
  shiftStartTime: string;
  shiftEndTime: string;
  allStaff: any[];
  deleteBranchHandler?: (id: string) => void;
}

export const RoundedName = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        className,
        "bg-[#F3F5F7] rounded-full w-[100px] h-[100px] flex items-center justify-center text-gray-700 font-bold text-2xl mb-5",
      )}
    >
      {children}
    </div>
  );
};

function BranchManageCard({ id, allStaff, branchName, city, shiftStartTime, shiftEndTime, deleteBranchHandler }: DefaultFormState) {
  const [deleteBranchId, setDeleteBranchId] = useState<string | null>(null);
  const router = useRouter();
  const navigationSingleBranch = () => {
    const slug = branchName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/branches-manage/${slug}/${id}`);
  };
  const data = branchesManage(id, shiftStartTime, shiftEndTime, allStaff);

  const confirmDelete = () => {
    deleteBranchHandler?.(deleteBranchId as string);
  };

  return (
    <main className="bg-card relative rounded-lg pt-4 pb-8 w-full max-w-sm sm:max-w-md md:max-w-full mx-auto flex flex-col items-center shadow-sm">
      <CustomTooltip title="Delete Branch">
        <Trash2 size={25} color="red" className="absolute right-5 top-3 cursor-pointer" onClick={() => setDeleteBranchId(id)} />
      </CustomTooltip>

      <div className="flex items-center justify-center flex-col text-center">
        <RoundedName>
          {branchName
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "?"}
        </RoundedName>

        <h4 className="text-black dark:text-gray-200 font-semibold text-lg sm:text-xl">{branchName}</h4>
        <p className="text-gray-400 text-sm">{city}</p>
      </div>

      <div className="flex items-center justify-center pt-8 gap-6 flex-wrap w-full sm:gap-10">
        {data?.map((single, idx) => (
          <div
            key={idx}
            className={cn("flex items-center justify-center gap-1 flex-col w-[33%] sm:w-auto", idx === 1 && "sm:border-l sm:border-r sm:px-6")}
          >
            <span className="text-xl sm:text-2xl">{single?.icon}</span>
            <p className="text-gray-400 text-xs sm:text-sm">{single?.text}</p>
            <p className="text-black dark:text-gray-200 text-lg sm:text-xl font-semibold">{single?.number}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="w-[90%] mx-auto mt-4">
        <Button
          type="button"
          className="w-full bg-transparent dark:bg-[#3238A1] dark:text-white text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white text-sm sm:text-base"
          onClick={navigationSingleBranch}
        >
          View Details
        </Button>
      </div>

      <DeleteModal
        open={!!deleteBranchId}
        setOpen={(isOpen) => {
          if (isOpen) {
            setDeleteBranchId((prev) => prev);
          } else {
            setDeleteBranchId(null);
          }
        }}
        title="Confirm Delete Branch"
        description="Are you sure you want to Delete This Shop? All unsaved progress will be lost."
        confirmText="Delete Now"
        cancelText="Stay! Not Deleted"
        onConfirm={confirmDelete}
      />
    </main>
  );
}

export default React.memo(BranchManageCard);
