"use client";
import React from "react";

// components
import Heading from "@/components/Heading";

// animations
import { motion } from "framer-motion";

interface BioSessionProps {
  bio: string;
}

const BioSession: React.FC<BioSessionProps> = ({ bio }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="px-6 mt-8">
      <Heading className="text-2xl text-[#353AA3] font-bold" isLineShow={true}>
        Bio
      </Heading>

      <p className="text-[18px] leading-relaxed mt-2 text-gray-800 max-[500px]:text-center max-[500px]:text-[16px]">{bio}</p>
    </motion.div>
  );
};

export default React.memo(BioSession);
