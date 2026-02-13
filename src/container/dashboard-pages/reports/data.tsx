import { CreditCard, DollarSignIcon, Users } from "lucide-react";
import { CustomerDetail, DefaultCustomerFormData } from "../customers/data";
import { formatNumber } from "@/lib/utils";

export type DropDownItemsProps = {
  value: string;
  name: string;
};

export const dropDownItems: DropDownItemsProps[] = [
  {
    name: "This Week",
    value: "week",
  },
  {
    name: "This Month",
    value: "month",
  },
  {
    name: "This Year",
    value: "year",
  },
  {
    name: "Last 6 Month",
    value: "6month",
  },
];

export interface ChartData {
  value: string | number;
}

export interface ReportsCardField {
  icon: React.ReactNode;
  title: string;
  tagIcon?: React.ReactNode;
  tagTitle: string;
  price: string;
  curr?: string;
  tag: string;
  data: ChartData[];
}

// Sales Report
export type Period = "week" | "month" | "6month" | "year";

export const generateReportSaleCard = (data: CustomerDetail[], selectedBranch: string, period: Period = "month") => {
  const today = new Date();

  const safeMonth = (year: number, month: number) => {
    const y = year + Math.floor(month / 12);
    const m = ((month % 12) + 12) % 12;
    return { year: y, month: m };
  };

  const getPeriodRange = (period: Period, ref: Date) => {
    let start: Date, end: Date;
    switch (period) {
      case "week":
        // Monday of this week
        const day = ref.getDay(); // 0 = Sunday
        start = new Date(ref);
        start.setDate(ref.getDate() - (day === 0 ? 6 : day - 1));

        // Clamp to first of current month
        const startOfMonth = new Date(ref.getFullYear(), ref.getMonth(), 1);
        if (start < startOfMonth) start = startOfMonth;

        end = new Date(ref); // today
        end.setHours(23, 59, 59, 999); // include whole day
        break;

      case "month":
        start = new Date(ref.getFullYear(), ref.getMonth(), 1);
        end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case "6month":
        start = new Date(ref.getFullYear(), ref.getMonth() - 5, 1);
        end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
        break;

      case "year":
        start = new Date(ref.getFullYear(), 0, 1);
        end = new Date(ref.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }
    return { start, end };
  };

  // Previous period range
  const getPrevPeriodRange = (period: Period, ref: Date) => {
    let start: Date, end: Date;
    switch (period) {
      case "week": {
        const thisWeekStart = new Date(ref);
        thisWeekStart.setDate(ref.getDate() - ref.getDay());
        start = new Date(thisWeekStart);
        start.setDate(start.getDate() - 7);
        end = new Date(thisWeekStart);
        end.setDate(end.getDate() - 1);
        break;
      }
      case "month": {
        const prevMonth = safeMonth(ref.getFullYear(), ref.getMonth() - 1);
        start = new Date(prevMonth.year, prevMonth.month, 1);
        const nextMonth = safeMonth(prevMonth.year, prevMonth.month + 1);
        end = new Date(nextMonth.year, nextMonth.month, 0);
        break;
      }
      case "6month": {
        const startMonth = safeMonth(ref.getFullYear(), ref.getMonth());
        const endMonth = safeMonth(ref.getFullYear(), ref.getMonth());
        start = new Date(startMonth.year, startMonth.month, 1);
        end = new Date(endMonth.year, endMonth.month + 1, 0);
        break;
      }
      case "year": {
        start = new Date(ref.getFullYear() - 1, 0, 1);
        end = new Date(ref.getFullYear() - 1, 11, 31);
        break;
      }
    }
    return { start, end };
  };

  const filterDataByRange = (data: CustomerDetail[], start: Date, end: Date) =>
    data.filter((c) => {
      if (!c.lastVisit) return false;
      const visitDate = c.lastVisit instanceof Date ? c.lastVisit : new Date(c.lastVisit);
      return visitDate >= start && visitDate <= end;
    });

  const { start: thisStart, end: thisEnd } = getPeriodRange(period, today);
  const { start: prevStart, end: prevEnd } = getPrevPeriodRange(period, today);

  const thisPeriodData = filterDataByRange(data, thisStart, thisEnd);
  const prevPeriodData = filterDataByRange(data, prevStart, prevEnd);

  // Totals
  const totalSalesThis = thisPeriodData.reduce((acc, c) => acc + Number(c.totalSpend ?? 0), 0);
  const totalSalesPrev = prevPeriodData.reduce((acc, c) => acc + Number(c.totalSpend ?? 0), 0);

  const totalOrdersThis = thisPeriodData.reduce((acc, c) => acc + Number(c.ordersNumber ?? 1), 0);
  const totalOrdersPrev = prevPeriodData.reduce((acc, c) => acc + Number(c.ordersNumber ?? 1), 0);

  // Avg per customer
  const avgPerCustomerThis = thisPeriodData.length > 0 ? totalSalesThis / thisPeriodData.length : 0;
  const avgPerCustomerPrev = prevPeriodData.length > 0 ? totalSalesPrev / prevPeriodData.length : 0;

  const salesGrowth =
    totalSalesPrev > 0 ? (((totalSalesThis - totalSalesPrev) / totalSalesPrev) * 100).toFixed(2) : totalSalesThis > 0 ? "New!" : "0";

  const ordersGrowth =
    totalOrdersPrev > 0 ? (((totalOrdersThis - totalOrdersPrev) / totalOrdersPrev) * 100).toFixed(2) : totalOrdersThis > 0 ? "New!" : "0";

  const avgGrowth =
    avgPerCustomerPrev > 0
      ? (((avgPerCustomerThis - avgPerCustomerPrev) / avgPerCustomerPrev) * 100).toFixed(2)
      : avgPerCustomerThis > 0
      ? "New!"
      : "0";

  const branchWiseData = Object.values(
    thisPeriodData.reduce((acc: Record<string, { name: string; totalSales: number; totalOrders: number; customers: number }>, c) => {
      const branchName = c.associateBranch?.name ?? "Unknown";
      if (!acc[branchName])
        acc[branchName] = {
          name: branchName,
          totalSales: Number(c.totalSpend ?? 0),
          totalOrders: Number(c.ordersNumber ?? 1),
          customers: 1,
        };
      else {
        acc[branchName].totalSales += Number(c.totalSpend ?? 0);
        acc[branchName].totalOrders += Number(c.ordersNumber ?? 1);
        acc[branchName].customers += 1;
      }
      return acc;
    }, {}),
  ).map((b) => ({
    name: b.name,
    total: b.totalSales,
    orders: b.totalOrders,
    value: b.customers > 0 ? b.totalSales / b.customers : 0,
    customers: b.customers,
  }));

  return [
    {
      icon: <DollarSignIcon className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Total Sales",
      tagTitle: selectedBranch || `This ${period}`,
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(totalSalesThis),
      curr: "EGP",
      tag: `+${salesGrowth}%`,
      data: branchWiseData,
    },
    {
      icon: <Users className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Total Orders",
      tagTitle: selectedBranch || `This ${period}`,
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(totalOrdersThis),
      curr: "Orders",
      tag: `+${ordersGrowth}%`,
      data: branchWiseData,
    },
    {
      icon: <DollarSignIcon className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Order / Customer",
      tagTitle: selectedBranch || `This ${period}`,
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(avgPerCustomerThis),
      curr: "EGP",
      tag: `+${avgGrowth}%`,
      data: branchWiseData,
    },
  ];
};

export const generateCustomerSalesChartData = (customers: CustomerDetail[]) => {
  const now = new Date();

  const monthOrder: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const parseDate = (dateValue: string | Date): Date => (dateValue instanceof Date ? dateValue : new Date(dateValue));

  const aggregateByName = (data: { name: string; sales: number }[], sortByMonth = false) => {
    const aggregated = Object.values(
      data.reduce((acc, cur) => {
        acc[cur.name] = acc[cur.name] ? { name: cur.name, sales: acc[cur.name].sales + cur.sales } : cur;
        return acc;
      }, {} as Record<string, { name: string; sales: number }>),
    );

    if (sortByMonth) {
      return aggregated.sort((a, b) => (monthOrder[a.name] || 0) - (monthOrder[b.name] || 0));
    }

    return aggregated;
  };

  const startOfWeek = new Date(now);
  const day = now.getDay();
  startOfWeek.setDate(now.getDate() - day);
  const weekData = aggregateByName(
    customers
      .filter((c) => c.lastVisit)
      .filter((c) => parseDate(c.lastVisit!) >= startOfWeek)
      .map((c) => ({
        name: parseDate(c.lastVisit!).toLocaleString("default", { weekday: "short" }),
        sales: Number(c.totalSpend) || 0,
      })),
  );

  const monthData = aggregateByName(
    customers
      .filter((c) => c.lastVisit)
      .filter((c) => {
        const visit = parseDate(c.lastVisit!);
        return visit.getMonth() === now.getMonth() && visit.getFullYear() === now.getFullYear();
      })
      .map((c) => {
        const visit = parseDate(c.lastVisit!);
        const weekNum = Math.ceil((visit.getDate() + startOfWeek.getDay()) / 7);
        return { name: `Week ${weekNum}`, sales: Number(c.totalSpend) || 0 };
      }),
  );

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const sixMonthData = aggregateByName(
    customers
      .filter((c) => c.lastVisit)
      .filter((c) => parseDate(c.lastVisit!) >= sixMonthsAgo)
      .map((c) => ({
        name: parseDate(c.lastVisit!).toLocaleString("default", { month: "short" }),
        sales: Number(c.totalSpend) || 0,
      })),
    true,
  );

  const yearData = aggregateByName(
    customers
      .filter((c) => c.lastVisit)
      .filter((c) => parseDate(c.lastVisit!).getFullYear() === now.getFullYear())
      .map((c) => ({
        name: parseDate(c.lastVisit!).toLocaleString("default", { month: "short" }),
        sales: Number(c.totalSpend) || 0,
      })),
    true,
  );

  return {
    week: weekData,
    month: monthData,
    "6month": sixMonthData,
    year: yearData,
  };
};

// Customer Report
export const generateReportsCard = (data: CustomerDetail[], selectedBranch: string) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthData = data.filter(
    (c) => c.lastVisit && new Date(c.lastVisit).getMonth() === currentMonth && new Date(c.lastVisit).getFullYear() === currentYear,
  );

  const lastMonthData = data.filter(
    (c) => c.lastVisit && new Date(c.lastVisit).getMonth() === lastMonth && new Date(c.lastVisit).getFullYear() === lastMonthYear,
  );

  const totalCustomer = data.length;
  const activeThisMonth = thisMonthData.length;
  const activeLastMonth = lastMonthData.length;

  const totalSpendThisMonth = thisMonthData.reduce((acc, c) => acc + Number(c.totalSpend ?? 0), 0);
  const totalSpendLastMonth = lastMonthData.reduce((acc, c) => acc + Number(c.totalSpend ?? 0), 0);

  const avgSpendingThisMonth = activeThisMonth > 0 ? totalSpendThisMonth / activeThisMonth : 0;
  const avgSpendingLastMonth = activeLastMonth > 0 ? totalSpendLastMonth / activeLastMonth : 0;

  const growth = (current: number, previous: number) => (previous > 0 ? (((current - previous) / previous) * 100).toFixed(2) : "0");

  const totalGrowth = growth(totalCustomer, data.length - thisMonthData.length);
  const activeGrowth = growth(activeThisMonth, activeLastMonth);
  const spendingGrowth = growth(avgSpendingThisMonth, avgSpendingLastMonth);

  const branchWiseData = Object.values(
    data.reduce((acc: Record<string, { name: string; value: number }>, item) => {
      const branchName = item.associateBranch?.name ?? "Unknown";
      acc[branchName] = acc[branchName] || { name: branchName, value: 0 };
      acc[branchName].value += 1;
      return acc;
    }, {}),
  ).sort((a, b) => b.value - a.value);

  const activeBranchWiseData = Object.values(
    thisMonthData.reduce((acc: Record<string, { name: string; value: number }>, item) => {
      const branchName = item.associateBranch?.name ?? "Unknown";
      acc[branchName] = acc[branchName] || { name: branchName, value: 0 };
      acc[branchName].value += 1;
      return acc;
    }, {}),
  ).sort((a, b) => b.value - a.value);

  const spendingBranchWiseData = Object.values(
    data.reduce((acc: Record<string, { name: string; total: number; count: number; orders: number }>, item) => {
      const branchName = item.associateBranch?.name ?? "Unknown";

      if (!acc[branchName]) {
        acc[branchName] = { name: branchName, total: 0, count: 0, orders: 0 };
      }
      acc[branchName].total += Number(item.totalSpend ?? 0);
      acc[branchName].count += 1;
      acc[branchName].orders += Number(item.ordersNumber ?? 0);
      return acc;
    }, {}),
  )
    .map((b) => ({
      name: b.name,
      total: b.total,
      orders: b.orders,
      value: b.count > 0 ? b.total / b.count : 0,
      count: b.count,
    }))
    .sort((a, b) => b.value - a.value);

  return [
    {
      icon: <Users className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Total Customers",
      tagTitle: selectedBranch || "All Time",
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(totalCustomer),
      curr: "Customers",
      tag: `+${totalGrowth}%`,
      data: branchWiseData,
    },
    {
      icon: <Users className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Active Customers",
      tagTitle: selectedBranch || "This Month",
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(activeThisMonth),
      curr: "Customers",
      tag: `+${activeGrowth}%`,
      data: activeBranchWiseData,
    },
    {
      icon: <DollarSignIcon className="bg-gray-200 rounded-full p-1.5 text-gray-800" size={30} />,
      title: "Avg Spending",
      tagTitle: selectedBranch || "This Month",
      tagIcon: <CreditCard size={15} className="text-gray-500" />,
      price: formatNumber(avgSpendingThisMonth),
      curr: "EGP",
      tag: `+${spendingGrowth}%`,
      data: spendingBranchWiseData,
    },
  ];
};

export const generateCustomerChartData = (customers: CustomerDetail[]) => {
  const now = new Date();

  const parseLocalDate = (dateValue: string | Date): Date => {
    if (dateValue instanceof Date) return dateValue;
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const getLabelsForRange = (range: "week" | "month" | "6month" | "year") => {
    switch (range) {
      case "week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "month":
        return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      case "6month": {
        const labels: string[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(d.toLocaleString("default", { month: "short" }));
        }
        return labels;
      }
      case "year":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  };

  const aggregateAndFill = (labels: string[], data: { name: string; sales: number }[]) => {
    const map = data.reduce((acc, d) => {
      acc[d.name] = (acc[d.name] || 0) + d.sales;
      return acc;
    }, {} as Record<string, number>);
    return labels.map((l) => ({ name: l, sales: map[l] || 0 }));
  };

  const getStartOfCurrentWeekThisMonth = (date: Date) => {
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const start = new Date(date);
    start.setDate(date.getDate() - diff);

    if (start.getMonth() !== date.getMonth()) {
      start.setDate(1);
    }
    return start;
  };

  const startOfWeek = getStartOfCurrentWeekThisMonth(now);

  const rawWeekData = customers
    .filter((c) => c.lastVisit && parseLocalDate(c.lastVisit) >= startOfWeek && parseLocalDate(c.lastVisit) <= now)
    .map((c) => ({
      name: parseLocalDate(c.lastVisit!).toLocaleString("default", { weekday: "short" }),
      sales: 1,
    }));
  const week = aggregateAndFill(getLabelsForRange("week"), rawWeekData);

  const rawMonthData = customers
    .filter((c) => {
      if (!c.lastVisit) return false;
      const visit = parseLocalDate(c.lastVisit);
      return visit.getMonth() === now.getMonth() && visit.getFullYear() === now.getFullYear();
    })
    .map((c) => {
      const visit = parseLocalDate(c.lastVisit!);
      const weekNum = Math.ceil(visit.getDate() / 7);
      return { name: `Week ${weekNum}`, sales: 1 };
    });
  const month = aggregateAndFill(getLabelsForRange("month"), rawMonthData);

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const rawSixMonthData = customers
    .filter((c) => c.lastVisit && parseLocalDate(c.lastVisit) >= sixMonthsAgo)
    .map((c) => ({
      name: parseLocalDate(c.lastVisit!).toLocaleString("default", { month: "short" }),
      sales: 1,
    }));
  const sixMonth = aggregateAndFill(getLabelsForRange("6month"), rawSixMonthData);

  const rawYearData = customers
    .filter((c) => c.lastVisit && parseLocalDate(c.lastVisit).getFullYear() === now.getFullYear())
    .map((c) => ({
      name: parseLocalDate(c.lastVisit!).toLocaleString("default", { month: "short" }),
      sales: 1,
    }));
  const year = aggregateAndFill(getLabelsForRange("year"), rawYearData);

  return { week, month, "6month": sixMonth, year };
};

export const ButtonText = [
  {
    role: "sales",
    btnText: "Sales",
  },
  {
    role: "customer",
    btnText: "Customers",
  },
];
