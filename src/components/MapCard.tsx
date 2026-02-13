"use client";
import React from "react";

// components
import Heading from "@/components/Heading";

// next
import Image, { StaticImageData } from "next/image";

// animations
import { motion, Variants } from "framer-motion";

interface MapSection {
  title: string;
  items: string[];
}

interface MapCardProps {
  personTitle: string;
  userImage?: string | StaticImageData;
  mapSections: MapSection[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const MapCard: React.FC<MapCardProps> = ({ personTitle, userImage = "", mapSections }) => {
  return (
    <motion.div variants={fadeUp} className="w-full mt-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mt-6 sm:mt-10 pl-0 sm:pl-4 md:pl-16"
      >
        <Heading isLineShow={false} classNameLine="bg-[#353AA3]" className="text-2xl sm:text-3xl md:text-4xl text-[#353AA3] font-bold text-left">
          {personTitle}
        </Heading>
      </motion.div>

      {/* Map Layout */}
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-32 w-full max-w-[95%]  justify-between mt-8"
      >
        <Boxes title={mapSections[0]?.title} items={mapSections[0]?.items} />
        <Boxes title={mapSections[1]?.title} items={mapSections[1]?.items} />

        {/* Center image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-[640px]:relative max-[640px]:flex max-[640px]:justify-center max-[640px]:items-center"
        >
          <Image
            src={userImage}
            alt={personTitle}
            width={140}
            height={140}
            className="rounded-full object-cover border-4 border-[#353AA3] shadow-lg
              w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] max-[640px]:w-[150px] max-[640px]:h-[150px]"
          />
        </motion.div>

        {/* Cross lines (hidden on mobile) */}
        <hr className="absolute left-1/2 top-0 h-full border border-gray-200 -translate-x-1/2 hidden sm:block" />
        <hr className="absolute top-1/2 left-0 w-full border border-gray-200 -translate-y-1/2 hidden sm:block" />

        <Boxes title={mapSections[2]?.title} items={mapSections[2]?.items} />
        <Boxes title={mapSections[3]?.title} items={mapSections[3]?.items} />
      </motion.main>
    </motion.div>
  );
};

export default React.memo(MapCard);

interface BoxesProps {
  title?: string;
  items?: string[];
}

const Boxes = ({ title, items = [] }: BoxesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center gap-6 sm:gap-8 text-center px-2"
    >
      <Heading isLineShow={true} className="text-2xl sm:text-3xl md:text-4xl text-[#353AA3] font-black">
        {title}
      </Heading>

      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        initial="hidden"
        whileInView="visible"
        className="flex flex-wrap gap-2 justify-center"
      >
        {items.map((single, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
            }}
            className="w-full sm:w-[220px] md:w-[260px] min-h-[100px] sm:h-[130px] md:h-[150px]
              px-3 sm:px-4 border-4 border-[#353AA3] rounded-2xl
              flex items-center justify-center text-base sm:text-lg md:text-2xl leading-snug text-[18px]"
          >
            {single}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
