import React from "react";

//components
import BranchesCard from "@/components/dashboard-components/BranchesCard";
import DashboardCard from "@/components/dashboard-components/DashboardCard";
import PaymedChart from "@/components/dashboard-components/PaymedChart";
import SalesDashboardCard from "@/components/dashboard-components/SalesDashboardCard";
import TopMenuCard from "@/components/dashboard-components/TopMenuCard";

//icons
import { Box, CircleDollarSign, CreditCard, House, MessageSquareText, Users } from "lucide-react";

export interface ChartData {
  value: string | number;
}

export interface LineChartData {
  sales: string | number;
  name: string;
}
export interface DashboardCardField {
  icon: React.ReactNode;
  title: string;
  tagIcon: React.ReactNode;
  tagTitle: string;
  price: string;
  curr?: string;
  tag: string;
  data: ChartData[];
}
export interface DashboardCardSales {
  icon: React.ReactNode;
  title: string;
  price: string;
  curr?: string;
  data?: LineChartData[];
}

export interface BranchesData {
  rank: string | number;
  name: string;
  city?: string;
  price?: string;
  currency?: string;
}

export interface PaymentDataField {
  label?: string;
  percentage?: number;
  color?: string;
}

export const dashboardCardField: DashboardCardField[] = [
  {
    icon: <CircleDollarSign className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
    title: "Total Sales",
    tagIcon: <CreditCard size={15} className="text-gray-500" />,
    tagTitle: "Last Month",
    price: "5,504,020",
    curr: "EGP",
    tag: "+8.41%",
    data: [{ value: 89 }, { value: 80 }, { value: 76 }, { value: 85 }, { value: 80 }, { value: 90 }],
  },
  {
    icon: <MessageSquareText className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
    title: "Total Orders",
    tagIcon: <CreditCard size={15} className="text-gray-500" />,
    tagTitle: "This Month",
    price: "31,200",
    tag: "+8.47%",
    data: [{ value: 89 }, { value: 80 }, { value: 76 }, { value: 85 }, { value: 80 }, { value: 90 }],
  },
  {
    icon: <Users className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
    title: "Orders / Customer",
    tagIcon: <CreditCard size={15} className="text-gray-500" />,
    tagTitle: "Last Month",
    price: "2.2",
    tag: "+1.45%",
    data: [{ value: 89 }, { value: 80 }, { value: 76 }, { value: 85 }, { value: 80 }, { value: 90 }],
  },
];

export const dashboardCardSales: DashboardCardSales[] = [
  {
    icon: <CircleDollarSign className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
    title: "Sales Summary",
    price: "5,504,020",
    curr: "EGP",
    data: [
      { name: "Jul", sales: 2200000 },
      { name: "Aug", sales: 3800000 },
      { name: "Sep", sales: 3100000 },
      { name: "Oct", sales: 4500000 },
      { name: "Nov", sales: 5600000 },
      { name: "Dec", sales: 6700000 },
    ],
  },
];

export const branchesData: BranchesData[] = [
  {
    rank: "1",
    name: "Heliopolis",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "2",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "3",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "4",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "5",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "6",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "7",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "8",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
  {
    rank: "9",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
    currency: "EGP",
  },
];

export const paymentData: PaymentDataField[] = [
  { label: "Cash", percentage: 80, color: "#16a34a" },
  { label: "Card", percentage: 20, color: "#2563eb" },
];

const OrdersData: BranchesData[] = [
  {
    rank: "1",
    name: "Heliopolis",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "2",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "3",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "4",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "5",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "6",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "7",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "8",
    name: "Sidi Beshr",
    city: "Cairo",
    price: "1,101,020",
  },
  {
    rank: "9",
    name: "Nasr City",
    city: "Cairo",
    price: "1,101,020",
  },
];

function Dashboard() {
  return (
    <section id="dashboard" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="grid  grid-cols-3 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1 gap-6 w-full">
          {dashboardCardField.map((single, idx) => (
            <DashboardCard {...single} key={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mt-6">
          {dashboardCardSales.map((single, idx) => (
            <SalesDashboardCard {...single} key={idx} />
          ))}

          <BranchesCard
            data={branchesData}
            icon={<House className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />}
            title="Top Branches"
          />

          <PaymedChart paymentData={paymentData} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full mt-6">
          <BranchesCard
            className="lg:w-[60%] w-full !h-[280px]"
            title="Orders"
            data={OrdersData}
            icon={<MessageSquareText className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />}
          />

          <TopMenuCard
            className="lg:w-[40%] w-full h-[280px]"
            icon={<Box className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />}
            title="Top Menu"
          />
        </div>
      </main>
    </section>
  );
}

export default React.memo(Dashboard);
