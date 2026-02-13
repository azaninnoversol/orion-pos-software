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

function WireFrame() {
  return (
    <section id="frame" className="p-6 bg-white pt-20 overflow-hidden px-0">
      <main>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center flex-col gap-2">
          <Heading isLineShow={true} className="max-[500px]:text-[34px] max-[500px]:text-center">
            Wireframes
          </Heading>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="relative w-full overflow-hidden mt-8">
          <div className="flex gap-10 animate-marquee">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Image
                key={idx}
                src={IMAGES.dashboardPic}
                alt="dashboard"
                className="w-[300px] sm:w-[500px] md:w-[700px] lg:w-[800px] h-auto rounded-lg object-contain"
                width={200}
                height={200}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="relative w-full overflow-hidden mt-10">
          <div className="flex gap-10 animate-marquee-reverse">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Image
                key={idx}
                src={IMAGES.dashboardPic}
                alt="dashboard"
                className="w-[300px] sm:w-[500px] md:w-[700px] lg:w-[800px] h-auto rounded-lg object-contain"
                width={200}
                height={200}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </section>
  );
}

export default React.memo(WireFrame);
