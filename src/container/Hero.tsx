"use client";
import React from "react";

//components
import { Button } from "@/components/ui/button";

//images
import { IMAGES } from "@/utils/resourses";

//icons
import { Check } from "lucide-react";

//next
import Image from "next/image";

//animation
import { motion } from "framer-motion";

interface Items {
  name?: string;
  icon?: React.ReactNode | string;
}

const items: Items[] = [
  { name: "Responsive Design", icon: <Check size={17} /> },
  { name: "Dual Mode: Light & Dark", icon: <Check size={17} /> },
  { name: "Modern & Minimal POS Design", icon: <Check size={17} /> },
  { name: "Design System", icon: <Check size={17} /> },
];

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="px-6 md:px-12 lg:pl-16 py-10 min-h-screen flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#3238a1]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex flex-col justify-between gap-6 text-center lg:text-left"
      >
        <div>
          <Button className="bg-[#636ACE] hover:bg-[#636ACE] text-[#353BA1] px-6 text-[18px] md:text-[20px] py-3 md:py-4 font-extrabold">
            UI UX
          </Button>
        </div>

        <div>
          <div className="flex flex-col items-center lg:items-start justify-center gap-2 mt-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-[40px] md:text-[55px] lg:text-[70px] font-bold leading-tight"
            >
              Orion POS
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white font-thin text-[18px] md:text-[22px] lg:text-[25px] mt-2"
          >
            Point Of Sale System For Restaurants
          </motion.p>
        </div>

        {/* Features */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="mt-6 space-y-3 flex flex-col items-center lg:items-start"
        >
          {items.map((single, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="text-white flex items-center gap-3 text-[16px] md:text-xl"
            >
              <span className="text-black bg-white p-[5px] rounded-full flex items-center justify-center">{single.icon}</span>
              <span>{single.name}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[60%] mt-10 lg:mt-0 flex justify-center"
      >
        <Image src={IMAGES.dashboard} alt="dashboard" className="w-full h-auto max-w-[900px] rounded-xl" width={100} height={100} />
      </motion.div>
    </motion.section>
  );
}
