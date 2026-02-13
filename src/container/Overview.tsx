"use client";
import React from "react";

//images
import { IMAGES } from "@/utils/resourses";

//next
import Image from "next/image";

//animation
import { motion } from "framer-motion";

function Overview() {
  return (
    <motion.section
      id="overview"
      className="px-4 sm:px-6 lg:px-10 bg-white pt-20 pb-10 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div
        className="flex flex-col items-center text-center gap-2 mb-10 px-2"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.15 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.h4
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="uppercase text-[#3238a1] font-bold text-lg sm:text-xl"
        >
          Get Started
        </motion.h4>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.1 }}
          className="text-black font-bold text-3xl sm:text-[40px] leading-tight"
        >
          Overview
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.2 }}
          className="text-black font-normal text-[16px] sm:text-[18px] lg:text-[20px] w-full sm:w-[80%] lg:w-[65%]"
        >
          Ordo POS is a smart point-of-sale solution designed to help businesses streamline sales, manage inventory, and track performance with ease.
          The system is built for efficiency, offering a modern interface and powerful tools to support daily operations.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div
          className="flex gap-6 sm:gap-10 animate-marquee"
          initial={{ x: 0 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "linear",
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              src={IMAGES.dashboard}
              alt={`dashboard-${i}`}
              className="w-[300px] sm:w-[500px] md:w-[700px] lg:w-[800px] h-auto rounded-lg object-contain"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default React.memo(Overview);
