// firebase
import FirestoreService from "./firestoreService";

// types
import { BranchValue } from "@/container/dashboard-pages/StaffManage";
import { CustomerDetail, DefaultCustomerFormData } from "@/container/dashboard-pages/customers/data";

export interface Item {
  itemPreview: string;
  itemName: string;
  category: string;
  subCategory: string;
  price: number;
  quantity: number;
  description: string;
  available: boolean;
  sizes?: { label: string; price: number; quantity: number }[];
  ons?: { label: string; price: number; quantity: number }[];
  createdAt?: number;
  managerId?: string;
  branch?: { id?: string; name?: string };
}

const itemService = new FirestoreService<Item>("items");

export default itemService;

export interface RegisterUserService {
  name: string;
  email: string;
  password: string;
  address?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  card_number?: number | string;
  card_cvc?: number | string;
  card_date?: Date | number | string;
  branch?: BranchValue;
  phone?: string | number;
  role?: string;
  shiftStartTime?: string | Date;
  shiftEndTime?: string | Date;
  // createdAt?: number | Date;
}

export const userService = new FirestoreService<RegisterUserService>("users");

export interface DiscountService {
  discountPercentage: number | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
}

export const discountService = new FirestoreService<DiscountService>("discount");

export interface StaffManageService {
  id?: string;
  name?: string;
  role?: string;
  branch?: BranchValue;
  email?: string;
  phone?: string | number;
  status?: "active" | "inactive" | "";
  createdAt?: number;
  updatedAt?: number;
  authUid?: string;
  passwordResetLink?: string;
  userCode?: string;
  managerId?: string;
}

export const staffManageService = new FirestoreService<StaffManageService>("staff_manage");
export interface BranchesManageService {
  country: string;
  branchName: string;
  city: string;
  phone: string | number;
  shiftStartTime: string;
  shiftEndTime: string;
  createdAt?: number;
  id?: string;
  managerId?: string;
}

export interface BrancheManageService extends BranchesManageService {
  id?: string;
}

export const branchManageService = new FirestoreService<BranchesManageService>("branch_manage");
export const customerManageService = new FirestoreService<DefaultCustomerFormData>("customer_manage");
export const customerManageServiceForReports = new FirestoreService<CustomerDetail>("customer_manage");
export const orderAddToDrawer = new FirestoreService<any>("add_order_not_check_out");
export const proceedOrder = new FirestoreService<any>("orders");
export const cancelledOrder = new FirestoreService<any>("cancel_orders");
export const shiftManage = new FirestoreService<any>("summary");
