"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Heading from "@/components/Heading";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

function About() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="about"
      className="px-6 md:px-12 lg:pl-16 py-10 min-h-[40vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div className="w-[90%] md:w-[80%] mx-auto flex flex-col">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="flex items-center flex-col gap-2"
        >
          <Heading
            isLineShow={true}
            className="max-[500px]:text-[34px] max-[500px]:text-center"
          >
            About
          </Heading>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="flex items-center flex-col gap-2"
        >
          <motion.p className="max-[500px]:text-[34px] max-[500px]:text-center">
            Get in Touch with Us
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default React.memo(About);
