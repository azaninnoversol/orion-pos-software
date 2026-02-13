"use client";
import React from "react";

// components + types
import UserSession, { UserSessionProps } from "./UserSession";
import Heading from "@/components/Heading";
import BioSession from "./BioSession";
import PointSession from "./PointSession";

// animations
import { motion } from "framer-motion";

interface UserPersonaProps {
  title: string;
  userInfo: UserSessionProps;
  bio: string;
  points: {
    title: string;
    items: string[];
  }[];
}

const UserPersona: React.FC<UserPersonaProps> = ({ title, userInfo, bio, points }) => {
  return (
    <main id="persona" className="p-6 bg-white pt-20 overflow-hidden px-16 max-[1124px]:px-0">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mt-10 pl-16 max-[500px]:pl-0"
      >
        <Heading isLineShow={false} classNameLine="bg-[#353AA3]" className="text-3xl text-[#353AA3] font-bold max-[500px]:text-[20px]">
          {title}
        </Heading>
      </motion.div>

      <section className="px-10 max-[1124px]:px-0">
        <UserSession {...userInfo} />
        <BioSession bio={bio} />

        <main className="flex flex-wrap gap-8 justify-between mt-2">
          {points.map((point, idx) => (
            <PointSession key={idx} title={point.title} items={point.items} />
          ))}
        </main>
      </section>
    </main>
  );
};

export default React.memo(UserPersona);
