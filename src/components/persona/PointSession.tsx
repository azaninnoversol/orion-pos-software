"use client";
import React from "react";

// components
import Heading from "@/components/Heading";

// animations
import { motion } from "framer-motion";

interface PointSessionProps {
  title: string;
  items: string[];
}

const PointSession: React.FC<PointSessionProps> = ({ title, items }) => {
  return (
    <div className="px-6 pt-8 w-[45%] max-[1124px]:w-full">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Heading className="text-2xl text-[#353AA3] font-bold" isLineShow={true}>
          {title}
        </Heading>
      </motion.div>

      <div className="px-10 pr-0 pt-4 max-[500px]:px-0 max-[500px]:list-none">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="font-medium text-xl pb-2 max-[500px]:text-center max-[500px]:text-[16px]"
          >
            {item}
          </motion.li>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PointSession);
