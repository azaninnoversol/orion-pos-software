"use client";
import React, { useCallback, useEffect, useState } from "react";

//components
import { Button } from "@/components/ui/button";
import { MenuCard } from "./menu/MenuCard";
import TableSection from "@/components/TableSection";
import CustomModal from "@/components/CustomModal";
import AddCustomerModal from "./customers/AddCustomerModal";
import { CellHeader, CellRow } from "./menu/TableCell";
import { Rating, RatingButton } from "@/components/ui/rating";
import { ActionButton } from "./menu/ActionButtons";

//icons
import { Plus } from "lucide-react";

//toast
import { toast } from "sonner";

//api-service
import { customerManageService, proceedOrder } from "@/services/api_service";

//library
import { ColumnDef } from "@tanstack/react-table";

//next
import { useRouter } from "next/navigation";

//types + helper-funcnality
import { ProceedOrdersData } from "../cashier-pages/order/data";
import {
  BranchItems,
  convertFirebaseDataToCustomer,
  CustomerDetail,
  DefaultCustomerFormData,
  generateCustomerCards,
  getColor,
  Status,
} from "./customers/data";

const defaultCustomerFormData: DefaultCustomerFormData = {
  customerName: "",
  phone: "",
  associateBranch: {
    value: "",
    name: "",
  },
  ordersNumber: "",
  totalSpend: "",
  loyalty: "",
  lastVisit: "",
  managerId: "",
};

function Customers() {
  const [isModalOpen, setIsOpenModal] = useState(false);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [formData, setFormData] = useState(defaultCustomerFormData);
  const [customersData, setCustomersData] = useState<DefaultCustomerFormData[]>([]);
  const [isEditId, setIsEditIdModal] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<ProceedOrdersData[]>([]);

  const router = useRouter();
  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void) => {
    try {
      setStatus(Status.FETCHING);
      await fn();
      setStatus(Status.FETCHED);
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
      setStatus(Status.ERROR);
    }
  }, []);

  const fetchCustomers = useCallback(() => {
    safeAsync(async () => {
      await customerManageService.getAll().then((data) => setCustomersData(data));
    });
  }, [safeAsync]);

  const fetchOrders = useCallback(() => {
    safeAsync(async () => {
      const data = await proceedOrder.getAll();
      setOrderData(data);
    });
  }, [safeAsync]);

  const fetchCustomerById = useCallback(
    (id: string) => {
      safeAsync(async () => {
        await customerManageService.getById(id).then((data) => {
          setFormData(data as CustomerDetail);
        });
      });
    },
    [safeAsync],
  );

  const deleteCustomerHandler = useCallback(
    (data: CustomerDetail) => {
      safeAsync(async () => {
        await customerManageService
          .deleteById(data.id as string)
          .then(async () => {
            await fetchCustomers();
            toast.success("Customer Delete Successfully!");
          })
          .catch((err) => toast.error(`Error: ${err instanceof Error ? err.message : err}`));
      });
    },
    [safeAsync],
  );

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (isEditId) {
      fetchCustomerById(isEditId);
    }
  }, [isEditId]);

  const navigationSingleBranch = (branch: BranchItems) => {
    const slug = branch?.name?.toLowerCase().replace(/\s+/g, "-");
    router.push(`/branches-manage/${slug}/${branch?.value}`);
  };

  const CustomerData = convertFirebaseDataToCustomer(customersData, orderData);
  const CustomerItems = generateCustomerCards(CustomerData);

  const columns: ColumnDef<CustomerDetail>[] = [
    { accessorKey: "id", header: "#ID" },
    { accessorKey: "customerName", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "associateBranch",
      header: "Branch",
      cell: ({ row }) => (
        <CellRow className="text-left cursor-pointer">
          <span onClick={() => navigationSingleBranch(row?.original?.associateBranch as BranchItems)}>{row?.original?.associateBranch?.name}</span>
        </CellRow>
      ),
    },
    { accessorKey: "ordersNumber", header: "Num of Orders" },
    { accessorKey: "totalSpend", header: "Total Spends" },
    {
      accessorKey: "loyalty",
      header: "Loyalty",
      cell: ({ row }) => {
        const color = getColor(row?.original?.loyalty);
        return (
          <Rating defaultValue={3} readOnly>
            <RatingButton key={1} color={color} />
          </Rating>
        );
      },
    },
    { accessorKey: "lastVisit", header: "Last Visit" },
    {
      accessorKey: "actions",
      id: "actions",
      header: () => <CellHeader className="text-right pr-4">Actions</CellHeader>,
      cell: ({ row }) => (
        <ActionButton
          row={row}
          title="Confirm Delete Customer"
          desc="Are You Sure! You Want To Delete This Customer?"
          onDelete={(data) => deleteCustomerHandler(data)}
          onEdit={(data) => setIsEditIdModal(data?.id)}
        />
      ),
    },
  ];

  return (
    <section id="customers" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between flex-wrap max-[530px]:justify-center max-[530px]:gap-2">
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl whitespace-nowrap text-black dark:text-gray-100">Manage Your Customers</h3>

          <div className="flex gap-4 items-center">
            <Button className="rounded-sm !bg-[#3238a1] !text-white" onClick={() => setIsOpenModal?.(true)}>
              <Plus />
              <span>Add New Customer</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-8">
          {CustomerItems.map((item, idx) => (
            <MenuCard {...item} key={idx} />
          ))}
        </div>

        <TableSection
          title="Customer List"
          columns={columns}
          data={CustomerData}
          pageSize={10}
          isLoading={status === Status.FETCHING}
          placeholder="Search Customer..."
        />
      </main>

      <CustomModal
        className="min-w-[50%]"
        open={isModalOpen || isEditId}
        setOpen={() => {
          setFormData(defaultCustomerFormData);
          setIsOpenModal?.(false);
          setIsEditIdModal?.(null);
        }}
        header={<span className="text-xl font-semibold">{isEditId ? "Edit Customer" : "Add New Customer"}</span>}
      >
        <AddCustomerModal
          status={status}
          formData={formData}
          setFormData={setFormData}
          setStatus={setStatus}
          setIsOpenModal={setIsOpenModal}
          safeAsync={safeAsync}
          defaultCustomerFormData={defaultCustomerFormData}
          fetchCustomers={fetchCustomers}
          isEditId={isEditId}
          setIsEditIdModal={setIsEditIdModal}
        />
      </CustomModal>
    </section>
  );
}

export default React.memo(Customers);
