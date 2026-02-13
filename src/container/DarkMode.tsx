"use client";
import React from "react";

//images
import { IMAGES } from "@/utils/resourses";

//next
import Image from "next/image";

//animations
import { motion, Variants } from "framer-motion";

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function DarkMode() {
  return (
    <section id="frame" className="p-6 bg-[#1F1F1F] pt-20 overflow-hidden px-0">
      <motion.main variants={fadeScale} initial="hidden" whileInView="show" className="w-[80%] mx-auto flex items-center justify-center">
        <Image src={IMAGES.darkOne} alt="dark-img" className="rounded-lg shadow-lg" />
      </motion.main>
    </section>
  );
}

export default React.memo(DarkMode);
