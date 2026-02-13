"use client";
import React from "react";

//next
import Image, { StaticImageData } from "next/image";

//components
import Heading from "@/components/Heading";
import IconTitle from "./IconTitle";

//animations
import { motion } from "framer-motion";

export interface UserSessionProps {
  name: string;
  image: string | StaticImageData;
  details: {
    label: string;
    ans: string;
    icon: React.ReactNode;
  }[];
}

const UserSession: React.FC<UserSessionProps> = ({ name, image, details }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex mt-6 items-center gap-6 max-[1124px]:flex-col"
    >
      <div>
        <Image src={image} alt={name} width={160} height={160} className="rounded-full object-cover shadow-lg" />
      </div>

      <div>
        <Heading isLineShow={true} className="text-black font-bold text-3xl mb-4">
          {name}
        </Heading>

        <div className="flex flex-wrap items-center gap-8 text-lg">
          {details?.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <IconTitle icon={d.icon} label={d.label} ans={d.ans} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(UserSession);
