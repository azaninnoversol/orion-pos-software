"use client";
import React, { useEffect, useState, useCallback } from "react";

//components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TableSection from "@/components/TableSection";
import { ActionButton } from "../menu/ActionButtons";
import CustomModal from "@/components/CustomModal";
import { StaffModalItems } from "../StaffManage";
import { CellHeader, CellRow } from "../menu/TableCell";
import Loading from "@/app/loading";
import { BranchProfile, SingleBranchModal, staffAndBranchData } from "./data";

//next
import { useParams, useRouter } from "next/navigation";

//icons
import { ArrowLeft } from "lucide-react";

//helper-function
import { cn, formatTime } from "@/lib/utils";

// types
import { Staff } from "../staff/data";

//api-service
import { branchManageService, staffManageService, userService } from "@/services/api_service";

//library
import { ColumnDef } from "@tanstack/react-table";

//toast
import { toast } from "sonner";

export interface DefaultFormState {
  country: string;
  branchName: string;
  city: string;
  phone: string | number;
  shiftStartTime: string;
  shiftEndTime: string;
  branch?: BranchValue;
  updatedAt?: string;
  managerId?: string;
}

const defaultForm: DefaultFormState = {
  country: "",
  branchName: "",
  city: "",
  phone: "",
  shiftStartTime: "",
  shiftEndTime: "",
  managerId: "",
};

export interface BranchValue {
  id: string;
  name: string;
}

export interface Manager {
  id?: string;
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
  branch?: BranchValue;
  city?: string;
  country?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  branchName?: string;
}

enum StatusTypeEnum {
  IDLE = "idle",
  FETCHING = "fetching",
  FETCHING_ID = "fetchingID",
  FETCHED = "fetched",
  ERROR = "error",
  SAVING = "saving",
}

interface Branch {
  id: string;
  name: string;
}

export interface DefaultStaff {
  name?: string;
  role?: string;
  branch?: BranchValue;
  email?: string;
  phone?: string | number;
  status?: "active" | "inactive" | "";
  managerId?: string;
}

const defaultFormStaff: DefaultStaff = {
  name: "",
  role: "",
  email: "",
  phone: "",
  status: "",
  managerId: "",
  branch: {
    id: "",
    name: "",
  },
};

function SingleBranch() {
  const { slug } = useParams();
  const router = useRouter();
  const branchId = slug?.[1];
  const [manager, setManager] = useState<Manager>({});
  const [staff, setStaff] = useState<Staff[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formData, setFormData] = useState(defaultForm);
  const [staffData, setStaffData] = useState(defaultFormStaff);
  const [status, setStatus] = useState<StatusTypeEnum>(StatusTypeEnum.IDLE);
  const [isBranchId, setIsBranchId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);

  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void, onError?: (error: any) => void) => {
    try {
      setStatus(StatusTypeEnum.FETCHING);
      await fn();
      setStatus(StatusTypeEnum.FETCHED);
      onSuccess?.();
    } catch (err) {
      onError?.(err);
      console.error("❌ Async Operation Error:", err);
      setStatus(StatusTypeEnum.ERROR);
    }
  }, []);

  const fetchBranchById = useCallback(
    (id: string) =>
      safeAsync(async () => {
        const branch = await branchManageService.getById(id);
        if (!branch?.managerId) throw new Error("Manager not assigned");

        const manager = await userService.getById(branch.managerId);

        setFormData({
          country: branch.country || "",
          branchName: branch.branchName || "",
          city: branch.city || "",
          phone: manager?.phone || "",
          shiftStartTime: branch?.shiftStartTime || (manager?.shiftStartTime as string) || "",
          shiftEndTime: branch?.shiftEndTime || (manager?.shiftEndTime as string) || "",
        });

        setManager({
          branch: { id: branch?.id as string, name: branch?.branchName as string },
          branchName: branch.branchName,
          city: manager?.city,
          country: manager?.country,
          email: manager?.email,
          id: manager?.id,
          name: manager?.name,
          phone: (manager?.phone as string) || "",
          role: manager?.role,
          shiftStartTime: manager?.shiftStartTime as string,
          shiftEndTime: manager?.shiftEndTime as string,
        });
      }),
    [safeAsync],
  );

  const fetchStaffByBranch = useCallback(
    (id: string) =>
      safeAsync(async () => {
        const staffRes = await staffManageService.getAll();

        const branchStaff = staffRes.filter((s) => s.branch?.id === id && s.role !== "manager");

        setStaff(branchStaff as any);
      }),
    [safeAsync],
  );

  const fetchStaffById = useCallback(
    (id: string) =>
      safeAsync(async () => {
        const res = await staffManageService.getById(id);
        setStaffData({ ...res });
      }),
    [safeAsync],
  );

  const fetchBranchesData = useCallback(
    () =>
      safeAsync(async () => {
        const res = await branchManageService.getAll();
        const unique = Array.from(new Map(res.map((b) => [b.branchName, { id: b.id, name: b.branchName }])).values());
        setBranches(unique);
      }),
    [safeAsync],
  );

  const deleteStaffHandler = useCallback(
    (data: Staff) => {
      safeAsync(async () => {
        const deleteStaff = await staffManageService.deleteById(data?.id);
        if (!deleteStaff) toast.error("Failed To Delete Try Again Laster!");
        toast.success(`Staff Deleted Successfully!`);
        branchId && (await fetchStaffByBranch(branchId));
      });
    },
    [safeAsync, fetchStaffByBranch, branchId],
  );

  const handleBranchUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const { updatedAt, ...responseData } = formData;

      const empty = Object.values(responseData).some((v) => !v);
      if (empty) return toast.error("Please fill all fields!");

      const payload = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      safeAsync(
        async () => {
          await userService.updateWhere("branch.id", branchId || "", {
            ...payload,
          });

          const updateBranchData = {
            country: payload.country,
            branchName: payload.branchName,
            city: payload.city,
            phone: payload.phone,
            shiftStartTime: payload.shiftStartTime,
            shiftEndTime: payload.shiftEndTime,
            createdAt: new Date().getTime(),
          };

          await branchManageService.update(branchId!, {
            ...updateBranchData,
          });

          const updatedBranchName = payload.branchName || manager.branchName;

          await staffManageService.updateWhere("branch.id", branchId, {
            branch: { id: branchId, name: updatedBranchName },
          });
        },

        async () => {
          console.log("SUCCESS callback running...");
          toast.success("Branch updated successfully!");
          if (branchId) await fetchStaffByBranch(branchId);
          setIsBranchId(null);
          setFormData(defaultForm);
          await fetchBranchById(branchId as string);
          await fetchBranchesData();
        },

        async (error) => {
          console.error("❌ Branch Update Error:", error);
          toast.error("Something went wrong!");
        },
      );
    },
    [branchId, formData, isBranchId, manager, safeAsync, fetchStaffByBranch],
  );

  const handleStaffUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const staffPayload = {
        ...staffData,
        managerId: manager.id,
        branch: {
          id: branchId!,
          name: formData.branchName,
        },
      };

      const empty = Object.values(staffPayload).some((v) => !v);
      if (empty) return toast.error("Please fill all fields!");

      safeAsync(
        async () => {
          if (staffPayload.role === "manager" && staffPayload.branch) {
            const allStaff = await staffManageService.getAll();
            const exists = allStaff.some(
              (s) => s.role?.toLowerCase() === "manager" && s.branch?.id === staffPayload.branch?.id && s.id !== isModalOpen,
            );
            if (exists) throw new Error("This branch already has a manager!");
          }

          const res = await staffManageService.update(isModalOpen!, staffPayload);
          if (!res) throw new Error("Staff update failed");
        },
        async () => {
          toast.success("Staff updated successfully!");
          if (branchId) await fetchStaffByBranch(branchId);
          setIsModalOpen(null);
          setStaffData(defaultFormStaff);
        },
      );
    },
    [branchId, fetchStaffByBranch, isModalOpen, safeAsync, staffData],
  );

  useEffect(() => {
    if (branchId) {
      fetchBranchById(branchId);
      fetchStaffByBranch(branchId);
    }
  }, [branchId, fetchBranchById, fetchStaffByBranch]);

  useEffect(() => {
    if (manager) setFormData((prev) => ({ ...prev, ...manager }));
  }, [manager]);

  useEffect(() => {
    if (isModalOpen) {
      fetchBranchesData();
      fetchStaffById(isModalOpen);
    }
  }, [isModalOpen, fetchBranchesData, fetchStaffById]);

  if (status === StatusTypeEnum.FETCHING) return <Loading className="!min-h-[80vh]" />;

  const columns: ColumnDef<Staff>[] = [
    { accessorKey: "id", header: "#ID" },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <CellRow className="bg-gray-100 dark:bg-[#1D1D27] px-0 py-2">{row.original.role}</CellRow>,
    },
    {
      accessorKey: "branch",
      cell: ({ row }) => <CellRow>{row?.original?.branch?.name}</CellRow>,
      header: () => <CellHeader className="text-center pr-8">Branch</CellHeader>,
    },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "actions",
      id: "actions",
      header: () => <CellHeader className="text-right pr-4">Actions</CellHeader>,
      cell: ({ row }) => (
        <ActionButton
          row={row}
          title="Confirm Delete Staff"
          desc="Are you sure you want to delete this staff?"
          onEdit={(data) => setIsModalOpen(data?.id)}
          onDelete={(data) => deleteStaffHandler(data)}
        />
      ),
    },
  ];

  return (
    <section id="staff" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <Button className="!text-gray-400 !bg-transparent mb-4" onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>

        <BranchProfile branchName={formData.branchName} manager={manager} formatTime={formatTime} setIsBranchId={setIsBranchId} />

        <Card className="mt-10 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 place-items-center min-h-[200px]">
            {staffAndBranchData(staff.length, manager.shiftStartTime, manager.shiftEndTime).map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 w-full py-4",
                  idx === 1 ? "sm:border-r sm:border-l sm:border-gray-300 sm:px-6" : "",
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-gray-400 dark:text-gray-300 text-lg sm:text-xl">{item.text}</p>
                <p className="text-black dark:text-gray-100 text-lg font-semibold">{item.number}</p>
              </div>
            ))}
          </div>
        </Card>

        <TableSection
          title="Staff List"
          columns={columns}
          data={staff}
          pageSize={10}
          isLoading={status === (StatusTypeEnum.FETCHING as StatusTypeEnum)}
          placeholder="Search staff..."
        />
      </main>

      <CustomModal
        className="min-w-[50%]"
        open={!!isBranchId}
        setOpen={() => setIsBranchId(null)}
        header={<span className="text-xl font-semibold">Edit Branch</span>}
      >
        <form className="flex flex-col w-full gap-4" onSubmit={handleBranchUpdate}>
          {status === (StatusTypeEnum.FETCHING as StatusTypeEnum) ? (
            <Loading className="!min-h-[500px]" />
          ) : (
            <>
              <SingleBranchModal formData={formData} setFormData={setFormData} />
              <Button
                type="submit"
                disabled={status === StatusTypeEnum.SAVING}
                className="w-full bg-[#3238a1] dark:bg-[#3238a1] dark:text-gray-200 flex items-center justify-center gap-2"
              >
                {status === StatusTypeEnum.SAVING ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Branch"
                )}
              </Button>
            </>
          )}
        </form>
      </CustomModal>

      <CustomModal
        className="min-w-[400px]"
        open={!!isModalOpen}
        setOpen={() => setIsModalOpen(null)}
        header={<span className="text-xl font-semibold">Edit Staff</span>}
      >
        <form className="flex flex-col w-full gap-4" onSubmit={handleStaffUpdate}>
          {status === StatusTypeEnum.FETCHING_ID ? (
            <Loading className="!min-h-[400px]" />
          ) : (
            <>
              <StaffModalItems formData={staffData} setFormData={setStaffData} branches={branches} />
              <Button
                type="submit"
                disabled={status === StatusTypeEnum.SAVING}
                className="w-full bg-[#3238a1] dark:bg-[#3238a1] dark:text-gray-200 flex items-center justify-center gap-2"
              >
                {status === StatusTypeEnum.SAVING ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Staff"
                )}
              </Button>
            </>
          )}
        </form>
      </CustomModal>
    </section>
  );
}

export default React.memo(SingleBranch);
