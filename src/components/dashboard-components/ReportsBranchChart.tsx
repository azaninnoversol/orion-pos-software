//types
import { CustomerDetail } from "@/container/dashboard-pages/customers/data";

//helper-functions
import { formatNumber } from "@/lib/utils";

//library-recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = [
  { name: "Heliopolis", value: 2100 },
  { name: "Sidi Beshr", value: 1400 },
  { name: "Nasr City", value: 900 },
  { name: "Ismailia", value: 600 },
  { name: "Maddi", value: 500 },
];

interface ReportsBranchChartData {
  data?: CustomerDetail[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">
          Total Spend <span className="font-bold">{formatNumber(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ReportsBranchChart = ({ data }: ReportsBranchChartData) => {
  const filterData = data
    ? Object.values(
        data.reduce((acc: Record<string, { name: string; value: number }>, item) => {
          const branchName = item?.associateBranch?.name ?? "Unknown";
          const totalSpend = Number(item?.totalSpend) || 0;

          if (!acc[branchName]) {
            acc[branchName] = { name: branchName, value: totalSpend };
          } else {
            acc[branchName].value += totalSpend;
          }

          return acc;
        }, {}),
      ).sort((a, b) => b.value - a.value)
    : dummyData;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={filterData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value: number) => `${value}`} content={CustomTooltip} />
        <Bar dataKey="value" fill="#2f4cd1" barSize={60} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReportsBranchChart;
