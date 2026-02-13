"use client";
import React from "react";

//components
import Heading from "@/components/Heading";

//next
import { Caveat } from "next/font/google";
import Image from "next/image";

//helper-functions
import { cn } from "@/lib/utils";

//images
import { IMAGES } from "@/utils/resourses";

//animations
import { motion, Variants } from "framer-motion";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const images: any[] = [IMAGES.adminOne, IMAGES.adminTwo, IMAGES.adminThree, IMAGES.adminFour];
function DesignUI() {
  return (
    <section id="ui" className="p-6 bg-white pt-20 overflow-hidden px-0">
      <main className="w-[80%] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center flex-col gap-2">
          <Heading isLineShow={true} className="max-[500px]:text-[34px] max-[500px]:text-center">
            Design UI
          </Heading>
        </motion.div>

        <motion.main variants={staggerContainer} initial="hidden" whileInView="show" className="flex flex-col items-center justify-center">
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Heading
              isLineShow={true}
              className={cn("text-[70px]  max-[500px]:text-[40px] max-[500px]:text-center max-[500px]:pb-7 !font-extralight", caveat.className)}
            >
              Admin Screens
            </Heading>
          </motion.div>

          <motion.div variants={staggerContainer} className="flex items-center justify-center flex-col gap-6">
            {images.map((img, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Image src={img} alt={`admin-${idx}`} />
              </motion.div>
            ))}
          </motion.div>
        </motion.main>

        <motion.main variants={staggerContainer} initial="hidden" whileInView="show" className="flex flex-col items-center justify-center">
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Heading
              isLineShow={true}
              className={cn("text-[70px]  max-[500px]:text-[40px] max-[500px]:text-center max-[500px]:pb-7 !font-extralight", caveat.className)}
            >
              Cashier Screens
            </Heading>
          </motion.div>

          <motion.div variants={staggerContainer} className="flex items-center justify-center flex-col gap-6">
            {[IMAGES.cashOne, IMAGES.cashTwo].map((img, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Image src={img} alt={`cash-${idx}`} />
              </motion.div>
            ))}
          </motion.div>
        </motion.main>

        <motion.main variants={staggerContainer} initial="hidden" whileInView="show" className="flex flex-col items-center justify-center">
          <motion.div variants={fadeUp} className="text-center mt-10">
            <Heading
              isLineShow={true}
              className={cn("text-[70px]  max-[500px]:text-[40px] max-[500px]:text-center max-[500px]:pb-7 !font-extralight", caveat.className)}
            >
              Kitchen Screens
            </Heading>
          </motion.div>

          <motion.div variants={staggerContainer} className="flex items-center justify-center flex-col gap-6">
            <motion.div variants={fadeUp}>
              <Image src={IMAGES.kitOne} alt="kit-one" />
            </motion.div>
          </motion.div>
        </motion.main>
      </main>
    </section>
  );
}

export default React.memo(DesignUI);
