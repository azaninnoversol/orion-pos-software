"use client";
import React, { useCallback, useEffect, useState } from "react";

//components
import { Button } from "@/components/ui/button";
import { MenuCard } from "./menu/MenuCard";
import TableSection from "@/components/TableSection";
import CustomModal from "@/components/CustomModal";
import { CellHeader, CellRow } from "./menu/TableCell";
import { ActionButton } from "./menu/ActionButtons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/app/loading";

//library
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

//next
import { useRouter } from "next/navigation";

//type + help-funtion
import { convertFirebaseDataToStaff, generateStaffIcon, Staff, staff_role } from "./staff/data";
import { generatePasswordFromEmail } from "../Login";

//api-services
import { branchManageService, staffManageService, userService } from "@/services/api_service";
import { RegisterAuth, sendLoginLink } from "@/services/AuthService";

//types
import { DefaultStaff } from "./branches-manage/SingleBranch";

//firebase
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/utils/config";

//icons
import { Phone, Plus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { UserProfile } from "../cashier-pages/inbox/data";

export interface BranchValue {
  id: string;
  name: string;
}
export interface DefaultFormState {
  name?: string;
  role?: string;
  branch?: BranchValue;
  email?: string;
  phone?: string | number;
  userCode?: string;
  status?: "active" | "inactive" | "";
  managerId?: string;
}

const defaultForm: DefaultFormState = {
  name: "",
  role: "",
  branch: { id: "", name: "" },
  email: "",
  phone: "",
  status: "",
  managerId: "",
};

function StaffManage() {
  const [openItemModal, setOpenItemModal] = useState(false);
  const [editStaffModal, setEditStaffModal] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [branches, setBranches] = useState<BranchValue[]>([]);
  const [data, setData] = useState<DefaultFormState[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "fetched" | "fetching" | "fetchingID" | "error">("idle");

  const router = useRouter();

  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void) => {
    try {
      setStatus("fetching");
      const result = await fn();
      setStatus("fetched");
      onSuccess?.();
      return result;
    } catch {
      setStatus("error");
    }
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await staffManageService.getAll();
      console.log(res, "res");
      if (res) {
        setData(res);
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const fetchBranches = useCallback(
    () =>
      safeAsync(async () => {
        const userId = localStorage.getItem("USER_ID");
        const res = await branchManageService.getAll();
        const filtered = res.filter((branch: DefaultFormState) => branch.managerId === userId);
        const uniqueBranches = Array.from(
          new Map(filtered?.map((single: any) => [single.branchName, { id: single.id, name: single.branchName }])).values(),
        );
        setBranches(uniqueBranches);
      }),
    [safeAsync],
  );

  const onDeleteHandler = useCallback(
    (row: any) =>
      safeAsync(async () => {
        const res = await staffManageService.deleteById(row.id);
        if (res) toast.success("Deleted successfully!");
        await fetchStaff();
      }),
    [fetchStaff, safeAsync],
  );

  const openEditModal = useCallback((staff: Staff) => {
    setEditStaffModal(staff.id);
  }, []);

  useEffect(() => {
    if (!editStaffModal) return;
    safeAsync(async () => {
      setStatus("fetchingID");
      const staff = await staffManageService.getById(editStaffModal);
      if (staff) {
        setFormData({
          name: staff.name ?? "",
          role: staff.role ?? "",
          branch: {
            id: staff.branch?.id || "",
            name: staff.branch?.name || "",
          },
          email: staff.email ?? "",
          phone: staff.phone ?? "",
          status: staff.status ?? "",
          managerId: staff.managerId ?? "",
        });
      }
      setStatus("fetched");
    });
  }, [editStaffModal, safeAsync]);

  useEffect(() => {
    safeAsync(async () => {
      setStatus("fetching");
      const branchId = localStorage.getItem("BRANCH_ID");
      const user = await (await userService.getAll()).find((u) => u?.branch?.id === branchId);
      setFormData((prev) => ({ ...prev, branch: user?.branch || { id: "", name: "" } }));

      setStatus("fetched");
    });
  }, [safeAsync]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const managerID = localStorage.getItem("USER_ID");

    const payload = {
      ...formData,
      managerId: managerID ?? "",
    };

    if (Object.values(payload).some((v) => !v)) {
      toast.error("Please fill all fields!");
      return;
    }

    setStatus("saving");

    if (payload.role === "manager" && payload.branch?.id) {
      const allStaff = await staffManageService.getAll();
      const exists = allStaff.some((s) => s.role?.toLowerCase() === "manager" && s.branch?.id === payload.branch?.id && s.id !== editStaffModal);
      if (exists) {
        toast.error("This branch already has a manager!");
        setStatus("idle");
        return;
      }
    }

    try {
      let staffRecord;
      if (editStaffModal) {
        staffRecord = await staffManageService.update(editStaffModal, {
          ...payload,
          userCode: generatePasswordFromEmail(payload?.email),
          managerId: managerID ?? "",
        });
      } else {
        staffRecord = await staffManageService.add({
          ...payload,
          userCode: generatePasswordFromEmail(payload?.email),
          managerId: managerID ?? "",
        });
      }

      if (!editStaffModal) {
        const user = await RegisterAuth({ email: payload?.email, password: generatePasswordFromEmail(payload?.email) });
        if (await user?.getIdToken()) {
          await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            name: payload?.name,
            email: payload?.email,
            address: "DEFAULT",
            country: "DEFAULT",
            city: "DEFAULT",
            zipCode: "0",
            card_number: "0",
            card_cvc: "0",
            card_date: "0",
            role: payload.role,
            createdAt: new Date(),
            branch: { id: payload.branch?.id || "", name: payload.branch?.name || "" },
            updatedAt: new Date(),
          }).then(async () => await sendLoginLink(payload?.email as string));
        }
      } else {
        const userRef = doc(db, "users", editStaffModal);
        await setDoc(
          userRef,
          {
            ...payload,
            address: "DEFAULT",
            country: "DEFAULT",
            city: "DEFAULT",
            zipCode: "0",
            card_number: "0",
            card_cvc: "0",
            card_date: "0",
            role: payload.role,
            createdAt: new Date(),
            updatedAt: new Date(),
            branch: { id: payload.branch?.id || "", name: payload.branch?.name || "" },
          },
          { merge: true },
        );
      }

      if (!staffRecord) throw new Error("Failed to save staff");

      await fetchStaff();
      toast.success(editStaffModal ? "Staff Updated Successfully!" : "Staff Created Successfully!");
      setEditStaffModal(null);
      setOpenItemModal(false);
      setFormData(defaultForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setStatus("fetched");
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchBranches();
  }, []);

  const staffData = convertFirebaseDataToStaff(data);
  const staffItems = generateStaffIcon(staffData);

  const navigationSingleBranch = (branch: BranchValue) => {
    const slug = branch?.name?.toLowerCase().replace(/\s+/g, "-");
    router.push(`/branches-manage/${slug}/${branch?.id}`);
  };

  const columns: ColumnDef<Staff>[] = [
    { accessorKey: "id", header: "#ID" },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <CellRow className="bg-gray-100 dark:bg-[#1D1D27] px-4 py-2 text-left w-fit">{row?.original?.role}</CellRow>,
    },
    {
      accessorKey: "branch",
      header: "Branch",
      cell: ({ row }) => {
        return (
          <CellRow className="text-left w-fit">
            <span className="cursor-pointer" onClick={() => navigationSingleBranch(row?.original?.branch as Staff)}>
              {row?.original?.branch?.name}
            </span>
          </CellRow>
        );
      },
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
          desc="Are You Sure! You Want To Delete This Staff User?"
          onDelete={(data) => onDeleteHandler(data)}
          onEdit={(data) => openEditModal(data)}
        />
      ),
    },
  ];

  return (
    <section id="staff" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between flex-wrap max-[583px]:justify-center max-[583px]:gap-4">
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl whitespace-nowrap text-black dark:text-gray-200">Manage Your Staff</h3>

          <div className="flex gap-4 items-center">
            <Button className="rounded-sm !bg-[#3238a1] !text-white" onClick={() => setOpenItemModal?.(true)}>
              <Plus />
              <span>Add New Staff</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-8">
          {staffItems.map((item, idx) => (
            <MenuCard {...item} key={idx} />
          ))}
        </div>

        <TableSection
          title="Staff List"
          columns={columns}
          data={staffData}
          pageSize={10}
          isLoading={status === "fetching"}
          placeholder="Search item..."
        />
      </main>

      <CustomModal
        className="min-w-[30%]"
        open={openItemModal || editStaffModal !== null}
        setOpen={() => {
          setFormData(defaultForm);
          setOpenItemModal(false);
          setEditStaffModal?.(null);
        }}
        header={<span className="text-xl font-semibold">{editStaffModal !== null ? "Edit New Staff" : "Add New Staff"}</span>}
      >
        <>
          {status === "fetchingID" ? (
            <Loading className="!min-h-[400px]" />
          ) : (
            <form className="flex items-center justify-start flex-col w-full gap-4 relative" onSubmit={handleSubmit}>
              <StaffModalItems formData={formData} setFormData={setFormData} branches={branches} />

              <Button type="submit" className="w-full bg-[#3238a1] hover:dark:bg-[#3238a1] dark:text-gray-200 flex items-center justify-center gap-2">
                {status === "saving" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editStaffModal !== null ? "Updating..." : "Submiting..."}
                  </>
                ) : (
                  <span>{editStaffModal !== null ? "Edit Staff" : "Add Staff"}</span>
                )}
              </Button>
            </form>
          )}
        </>
      </CustomModal>
    </section>
  );
}

export default React.memo(StaffManage);

export const StaffModalItems = ({
  formData,
  setFormData,
  branches,
}: {
  branches: BranchValue[];
  formData: DefaultFormState | DefaultStaff;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Full Name</label>
        <Input
          type="text"
          placeholder="Username"
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Role</label>
        <Select value={formData.role ?? ""} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="border border-gray-300 focus-visible:ring-[#3238a1] dark:text-gray-200 text-gray-700 w-full">
            <SelectValue placeholder="Choose Role" />
          </SelectTrigger>
          <SelectContent>
            {staff_role.map((role) => (
              <SelectItem key={role?.name} value={role.value}>
                {role?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Branch</label>
        <Select
          value={formData.branch ? JSON.stringify(formData.branch) : ""}
          onValueChange={(value) => {
            const parsed = value ? JSON.parse(value) : null;
            setFormData({ ...formData, branch: parsed });
          }}
        >
          <SelectTrigger className="border border-gray-300 focus-visible:ring-[#3238a1] dark:text-gray-200 text-gray-700 w-full">
            <SelectValue placeholder="Choose Branch" />
          </SelectTrigger>

          <SelectContent>
            {branches.map((single) => (
              <SelectItem key={single?.id} value={JSON.stringify({ id: single.id, name: single.name })}>
                {single?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Status</label>
        <Select value={formData.status ?? ""} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger className="border border-gray-300 focus-visible:ring-[#3238a1] dark:text-gray-200 text-gray-700 w-full">
            <SelectValue placeholder="Choose Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">In Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Email</label>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email ?? ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Phone Number</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-sm">+</span>
          </div>
          <Input
            type="number"
            placeholder="Phone Number"
            value={formData.phone ?? ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-12 border-gray-300 focus-visible:ring-[#3238a1]"
          />
        </div>
      </div>
    </>
  );
};
