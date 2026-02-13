"use client";
import React from "react";

// components
import Heading from "./Heading";

// icons
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";

// animations
import { motion, Variants } from "framer-motion";

// helper
import { formatDate } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function Footer() {
  return (
    <footer className="bg-black w-full overflow-hidden">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center justify-center flex-col py-8 gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="bg-[#0057FF] p-6 rounded-full"
        >
          <ThumbsUp color="white" size={35} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <Heading className="text-white font-semibold text-2xl max-[500px]:text-sm text-center" isLineShow={true}>
            Orion POS | POS System UI/UX Case Study
          </Heading>
        </motion.div>

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-6"
        >
          <div className="flex items-center gap-1">
            <ThumbsUp color="gray" size={16} />
            <span className="text-gray-400 text-sm">45</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye color="gray" size={16} />
            <span className="text-gray-400 text-sm">453</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare color="gray" size={16} />
            <span className="text-gray-400 text-sm">8</span>
          </div>
        </motion.main>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-400 text-[13px]"
        >
          Published: {formatDate(new Date())}
        </motion.p>
      </motion.div>
    </footer>
  );
}

export default React.memo(Footer);
