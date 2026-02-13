import React from "react";

// icons
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// icons
import { BadgeDollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

interface CardItem {
  icon: React.ReactNode;
  title: string;
  tagName: string;
  tagIcon: React.ReactNode | string;
  numbers: string;
  currency?: string;
  profit: string;
}

const cardItems: CardItem[] = [
  {
    icon: <BadgeDollarSign size={20} />,
    title: "Total Sales",
    tagName: "Last Month",
    tagIcon: <TrendingUp className="text-green-500 w-4 h-4" />,
    numbers: "5,504,020",
    currency: "EGP",
    profit: "+8.41%",
  },
  {
    icon: <ShoppingCart size={20} />,
    title: "Total Orders",
    tagName: "Last Month",
    tagIcon: <TrendingUp className="text-green-500 w-4 h-4" />,
    numbers: "31,200",
    currency: "",
    profit: "+8.43%",
  },
  {
    icon: <Users size={20} />,
    title: "Orders / Customer",
    tagName: "Last Month",
    tagIcon: <TrendingUp className="text-green-500 w-4 h-4" />,
    numbers: "2.2",
    profit: "+1.45%",
  },
];
function Bar() {
  return (
    <section className="p-6">
      <div className="flex flex-wrap gap-6">
        {cardItems.map((single, idx) => (
          <Card key={idx} className="flex-1 basis-[calc(33.333%-1rem)] min-w-[280px] bg-white shadow-md rounded-2xl transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <main className="flex gap-2 items-center">
                <div className="p-1.5 rounded-full bg-gray-100">{single.icon}</div>
                <h2 className="text-black text-sm font-medium mb-1">{single.title}</h2>
              </main>
              <span className="text-sm text-zinc-800 flex items-center gap-1 bg-gray-100 p-1 px-2 rounded-sm">
                {single.tagIcon} {single.tagName}
              </span>
            </CardHeader>

            <CardContent className="mt-4">
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">
                  {single.numbers}

                  {single.currency && <span className="text-base text-gray-600 ml-1 uppercase">{single.currency}</span>}
                </p>
                <div className="bg-green-100 px-2 rounded-xl border border-green-600">
                  <span className="text-green-600 text-sm font-semibold">{single.profit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default React.memo(Bar);
