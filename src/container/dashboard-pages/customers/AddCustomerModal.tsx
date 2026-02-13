import React, { useCallback, useEffect, useState } from "react";

// components
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// data + types
import { BranchItems, DefaultCustomerFormData, Status } from "./data";

// services
import { branchManageService, customerManageService } from "@/services/api_service";

// toast
import { toast } from "sonner";

type Props = {
  setIsEditIdModal: React.Dispatch<React.SetStateAction<string | null>>;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCustomerFormData>>;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  formData: DefaultCustomerFormData;
  defaultCustomerFormData: DefaultCustomerFormData;
  status?: Status;
  safeAsync: (fn: () => Promise<any>, onSuccess?: () => void) => Promise<void>;
  fetchCustomers: () => void;
  isEditId?: string | null;
};

function AddCustomerModal({
  setFormData,
  setStatus,
  setIsOpenModal,
  safeAsync,
  fetchCustomers,
  status,
  formData,
  defaultCustomerFormData,
  isEditId,
}: Props) {
  const [branches, setBranches] = useState<BranchItems[]>([]);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      managerId: localStorage.getItem("managerId") || "",
    };

    if (Object.values(payload).some((v) => !v)) {
      toast.error("Please fill all fields!");
      return;
    }

    setStatus(Status.SAVING);

    try {
      let res;
      if (!isEditId) {
        res = await customerManageService.add(payload);
      } else {
        res = await customerManageService.update(isEditId, payload);
      }
      if (res) {
        toast.success(isEditId ? "Customer Updated Successfully!" : "Customer Added Successfully!");
        setIsOpenModal?.(false);
        setFormData(defaultCustomerFormData);
        setStatus(Status.FETCHING);
        await fetchCustomers();
        setStatus(Status.FETCHED);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error(`Error: ${err instanceof Error ? err.message : err}`);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const fetchBranches = useCallback(
    () =>
      safeAsync(async () => {
        const res = await branchManageService.getAll();
        const uniqueBranches = Array.from(
          new Map(
            res?.map((single: any) => [
              single?.branchName,
              {
                value: single?.id,
                name: single?.branchName,
              },
            ]),
          ).values(),
        );
        setBranches(uniqueBranches);
      }),
    [safeAsync],
  );

  useEffect(() => {
    const orders = Number(formData?.ordersNumber ?? 0);
    const spend = Number(formData?.totalSpend ?? 0);

    let loyaltyLevel = "Bronze";

    if (orders > 15 || spend > 15000) {
      loyaltyLevel = "Gold";
    } else if (orders > 5 || spend > 5000) {
      loyaltyLevel = "Silver";
    }

    setFormData((prev) => ({ ...prev, loyalty: loyaltyLevel }));
  }, [formData?.ordersNumber, formData?.totalSpend]);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <form className="flex items-center justify-start flex-col w-full gap-4 relative" onSubmit={formSubmitHandler}>
      {status === "fetching" ? (
        <Loading className="!min-h-[400px]" />
      ) : (
        <>
          <ModalInput
            formData={formData}
            setFormData={setFormData}
            label="Customer Name"
            type="text"
            placeholder="Enter Customer Name"
            name={"customerName"}
          />

          <ModalInput
            formData={formData}
            setFormData={setFormData}
            label="Customer Phone Number"
            type="number"
            placeholder="Enter Customer Phone Number"
            name={"phone"}
          />

          <ModalInput
            formData={formData}
            setFormData={setFormData}
            label="Associate Branch"
            type="select"
            placeholder="Branch Name"
            name={"associateBranch"}
            data={branches}
          />

          <ModalInput formData={formData} setFormData={setFormData} label="Orders" type="number" placeholder="Orders" name={"ordersNumber"} />

          <ModalInput
            formData={formData}
            setFormData={setFormData}
            label="Total Spends"
            type="number"
            placeholder="Enter Total Spends"
            name={"totalSpend"}
          />

          <ModalInput
            formData={formData}
            setFormData={setFormData}
            label="Enter Last Visit"
            type="date"
            placeholder="Last Visit"
            name={"lastVisit"}
          />
        </>
      )}

      <ButtonText status={status} update={isEditId} />
    </form>
  );
}

export default React.memo(AddCustomerModal);

type ModalInputProps = {
  name: keyof DefaultCustomerFormData | any;
  formData: DefaultCustomerFormData | any;
  setFormData: React.Dispatch<React.SetStateAction<DefaultCustomerFormData | any>>;
  label?: string;
  type?: string;
  placeholder?: string;
  data?: BranchItems[] | any;
};

export const ModalInput = ({
  name,
  formData,
  setFormData,
  label = "Customer",
  type = "text",
  placeholder = "Enter Customer Name",
  data = [],
}: ModalInputProps) => {
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: keyof DefaultCustomerFormData) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const selectHandler = (value: any, isCovertJson: boolean) => {
    if (isCovertJson) {
      const parsed = value ? JSON.parse(value) : null;
      setFormData({ ...formData, [name]: parsed });
    }
  };

  return (
    <>
      {type === "select" ? (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-gray-600 dark:text-gray-200 font-medium">{label}</label>
          <Select
            value={
              formData[name]
                ? JSON.stringify({
                    name: formData[name]?.name,
                    value: formData[name]?.value,
                  })
                : ""
            }
            onValueChange={(value) => selectHandler(value, true)}
          >
            <SelectTrigger className="border border-gray-300 focus-visible:ring-[#3238a1] dark:text-gray-200 text-gray-700 w-full">
              <SelectValue placeholder={placeholder || "Choose Option"} />
            </SelectTrigger>
            <SelectContent>
              {data?.map((item: BranchItems) => (
                <SelectItem key={item?.value} value={JSON.stringify({ name: item.name, value: item.value })}>
                  {item?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-gray-600 dark:text-gray-200 font-medium">{label}</label>
          <Input
            type={type}
            placeholder={placeholder}
            value={formData?.[name] ?? ""}
            onChange={(e) => inputChangeHandler(e, name)}
            className="border-gray-300 focus-visible:ring-[#3238a1]"
            // max={new Date().toISOString().split("T")[0]}
          />
        </div>
      )}
    </>
  );
};

type ButtonProps = {
  status?: Status;
  addName?: string;
  update?: string | null;
  updateName?: string;
};

const ButtonText = ({ status, addName = "Add Customer", updateName = "Update Customer", update }: ButtonProps) => {
  return (
    <Button type="submit" className="w-full dark:text-gray-200 dark:bg-purple-600 bg-[#3238a1] flex items-center justify-center gap-2">
      {status === "saving" ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {update ? "Updating..." : "Submitting..."}
        </>
      ) : (
        <span>{update ? updateName : addName}</span>
      )}
    </Button>
  );
};
