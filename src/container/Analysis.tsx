"use client";
import React from "react";

//components
import Heading from "@/components/Heading";

//helper-function
import { oppurtunities, strengths, threats, weakness } from "@/lib/utils";

//animations
import { motion } from "framer-motion";

function Analysis() {
  return (
    <motion.section id="analysis" className="p-6 bg-white pt-20 px-4 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center flex-col gap-2 mb-10 text-center list-none md:list-disc md:text-left"
      >
        <Heading isLineShow={true}>
          <span className="text-[#3238a1]">Swot</span> Analysis
        </Heading>
      </motion.div>

      <main className="relative flex flex-wrap gap-10 md:gap-20 w-full lg:w-[80%] mx-auto justify-center md:justify-between">
        <AnalysisSwot blueWord="S" text="trengths" items={strengths} delay={0.1} />
        <hr className="hidden lg:block absolute left-1/2 h-full border border-gray-200" />

        <AnalysisSwot blueWord="W" text="eakness" items={weakness} delay={0.2} />
        <hr className="hidden lg:block absolute top-1/2 w-full border border-gray-200" />

        <AnalysisSwot blueWord="O" text="pportunities" items={oppurtunities} delay={0.3} />
        <AnalysisSwot blueWord="T" text="hreats" items={threats} delay={0.4} />
      </main>
    </motion.section>
  );
}

export default React.memo(Analysis);

interface AnalysisSwotProps {
  className?: string;
  blueWord?: string;
  text?: string;
  items?: string[];
  delay?: number;
}

const AnalysisSwot = ({ className = "", blueWord, text, items = [], delay = 0 }: AnalysisSwotProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`${className} w-full sm:w-full lg:w-[40%] text-center list-none md:list-disc md:text-left`}
    >
      <Heading isLineShow={true} className="text-3xl md:text-4xl lg:text-5xl tracking-wide flex justify-center md:justify-start !items-baseline">
        <motion.span
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          className="text-[#3238a1] text-[60px] md:text-[80px] leading-none inline-block"
        >
          {blueWord}
        </motion.span>
        {text}
      </Heading>

      <div className="px-4 md:px-8 pr-0 pt-6 md:pt-8">
        {items?.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 * idx }}
            className="font-medium text-base sm:text-lg md:text-xl pb-2 text-gray-800"
          >
            {item}
          </motion.li>
        ))}
      </div>
    </motion.div>
  );
};
