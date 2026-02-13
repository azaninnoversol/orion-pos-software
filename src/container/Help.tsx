"use client";
import React, { useState } from "react";

//components
import CustomAccordion from "@/components/CustomAccordion";

//icons
import { CircleQuestionMark } from "lucide-react";

interface QuestionsItem {
  id: string;
  title: string;
  content: string;
}

const questions: QuestionsItem[] = [
  {
    id: "01",
    title: "Does the POS system support multiple stores?",
    content: "Yes, our POS allows you to manage multiple stores from a single account, keeping inventory and sales data synchronized.",
  },
  {
    id: "02",
    title: "Can I process both cash and card payments?",
    content: "Absolutely! Our POS supports cash, card, and digital wallet payments, making checkout fast and seamless for your customers.",
  },
  {
    id: "03",
    title: "Is there a free trial available?",
    content: "Yes, you can try the POS system free for 14 days with full features. No credit card required.",
  },
  {
    id: "04",
    title: "Can I track my inventory in real-time?",
    content: "Yes, the POS system automatically updates your stock as sales are made, allowing you to monitor inventory in real-time.",
  },
  {
    id: "05",
    title: "Does it support barcode scanning?",
    content: "Yes, our POS integrates with most barcode scanners, speeding up checkout and reducing manual errors.",
  },
  {
    id: "06",
    title: "Can I generate sales reports?",
    content: "Yes, you can generate detailed sales, revenue, and tax reports to help with accounting and business analysis.",
  },
  {
    id: "07",
    title: "Is the POS system cloud-based?",
    content: "Yes, all your data is stored securely in the cloud, so you can access it anytime, anywhere.",
  },
  {
    id: "08",
    title: "Can I manage employees with the POS?",
    content: "Yes, the system allows you to create employee accounts, assign roles, and track sales by employee.",
  },
  {
    id: "09",
    title: "Does it support discounts and promotions?",
    content: "Yes, you can create discounts, special offers, and promotional pricing directly in the POS system.",
  },
  {
    id: "10",
    title: "Is it compatible with mobile devices?",
    content: "Yes, our POS works on tablets and smartphones, allowing you to sell anywhere in your store or remotely.",
  },
  {
    id: "11",
    title: "Can I connect it to an accounting system?",
    content: "Yes, the POS supports integrations with popular accounting software like QuickBooks and Xero.",
  },
  {
    id: "12",
    title: "Does it allow customer management?",
    content: "Yes, you can store customer information, track purchase history, and send personalized promotions.",
  },
  {
    id: "13",
    title: "Can I manage returns and refunds?",
    content: "Yes, the POS system supports easy returns and refunds while updating inventory automatically.",
  },
  {
    id: "14",
    title: "Is my data secure?",
    content: "Absolutely. All transactions and customer data are encrypted and stored securely in our cloud servers.",
  },
  {
    id: "15",
    title: "Can I print receipts?",
    content: "Yes, the POS can print receipts via compatible printers or send digital receipts via email or SMS.",
  },
  {
    id: "16",
    title: "What support options are available?",
    content: "Our team provides 24/7 support via chat, email, and phone to help you with any POS issues or questions.",
  },
];

function Help() {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, questions.length));
  };

  const visibleQuestions = questions.slice(0, visibleCount);

  const handleSeeLess = () => {
    setVisibleCount(4);
  };

  return (
    <section id="help">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-center py-8 pt-10">
          <CircleQuestionMark size={80} />

          <h1 className="text-5xl pb-4">Help Center</h1>
          <p>
            Welcome to our Help Center! Here you'll find answers to common questions, guidance on using our platform, and tips to enhance your social
            media experience. Browse through the sections below to quickly find the information you need.
          </p>
        </div>

        <CustomAccordion type="single" defaultValue={"1"} collapsible={true} items={visibleQuestions} />

        <div className="flex justify-center mt-6 gap-4">
          {visibleCount < questions.length && (
            <button onClick={handleLoadMore} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Load More
            </button>
          )}

          {visibleCount > 4 && (
            <button onClick={handleSeeLess} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
              See Less
            </button>
          )}
        </div>
      </main>
    </section>
  );
}

export default React.memo(Help);
