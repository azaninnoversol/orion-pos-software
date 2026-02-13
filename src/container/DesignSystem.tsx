"use client";
import React from "react";

//components
import Heading from "@/components/Heading";

//images
import { IMAGES } from "@/utils/resourses";

//next
import Image from "next/image";

//animations
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function DesignSystem() {
  return (
    <section id="design" className="p-6 bg-white pt-20 overflow-hidden px-0">
      <main className="w-[80%] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center flex-col gap-2">
          <Heading isLineShow={true} className="max-[500px]:text-[34px] max-[500px]:text-center">
            Design System
          </Heading>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center justify-center my-8">
          <Image src={IMAGES.dbPic} alt="pic" width={100} height={100} className="w-full h-full rounded-lg shadow-lg" />
        </motion.div>
      </main>
    </section>
  );
}

export default React.memo(DesignSystem);
