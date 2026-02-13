"use client";
import React from "react";

//components
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";

//helper-function
import {
  cn,
  threeBtnSectionFive,
  threeBtnSectionFour,
  threeBtnSectionThree,
  threeBtnSectionTwo,
  twoBtnSectionFive,
  twoBtnSectionFour,
  twoBtnSectionThree,
  twoBtnSectionTwo,
  btnSectionOne,
  btnSectionTwo,
  btnSectionThree,
  btnSectionFour,
  btnSectionFive,
} from "@/lib/utils";

//animation
import { motion, Variants } from "framer-motion";

export interface ButtonItem {
  name: string;
  purple?: boolean;
}

export interface ButtonsSectionProps {
  items: ButtonItem[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

function UserJourneyMap() {
  return (
    <section id="journey" className="p-6 bg-white pt-20 overflow-hidden px-0">
      <motion.main initial="hidden" whileInView="visible" className="w-[80%] mx-auto">
        <motion.div variants={fadeUp} custom={0.1} className="flex items-center flex-col gap-2">
          <Heading isLineShow={true} className="max-[500px]:text-[34px] max-[500px]:text-center">
            <span className="text-[#3238a1]">User</span> Journey Maps
          </Heading>
        </motion.div>

        <JourneyMapSection
          title="Person 1 - Food Chain Manager"
          sections={[btnSectionOne, btnSectionTwo, btnSectionThree, btnSectionFour, btnSectionFive]}
          delay={0.2}
        />

        <JourneyMapSection
          title="Person 2 - Restaurant Owner"
          sections={[btnSectionOne, twoBtnSectionTwo, twoBtnSectionThree, twoBtnSectionFour, twoBtnSectionFive]}
          delay={0.3}
        />

        <JourneyMapSection
          title="Person 3 - Café Owner"
          sections={[btnSectionOne, threeBtnSectionTwo, threeBtnSectionThree, threeBtnSectionFour, threeBtnSectionFive]}
          delay={0.4}
        />
      </motion.main>
    </section>
  );
}

export default React.memo(UserJourneyMap);

interface JourneyMapSectionProps {
  title: string;
  sections: ButtonsSectionProps["items"][];
  delay?: number;
}

const JourneyMapSection: React.FC<JourneyMapSectionProps> = ({ title, sections, delay = 0 }) => {
  return (
    <motion.main variants={fadeUp} initial="hidden" whileInView="visible" custom={delay} className="mt-18">
      <motion.div initial={{ opacity: 0, y: 0 }} whileInView={{ opacity: 1, y: 10 }} transition={{ duration: 0.6 }}>
        <Heading isLineShow={true} className="text-[#3238a1] text-[30px] max-[500px]:text-center max-[500px]:text-[20px]">
          {title}
        </Heading>
      </motion.div>

      <div className="flex flex-wrap gap-8 items-start justify-between mt-10">
        {sections.map((sectionItems, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={0.2 + index * 0.1}
            className="flex-1 min-w-[200px]"
          >
            <UserJourneyColumn items={sectionItems} />
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
};

const UserJourneyColumn: React.FC<ButtonsSectionProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4 flex-1 min-w-[200px]">
      {items.map((single, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="w-full"
        >
          <Button
            className={cn(
              "basis-[150px] w-full min-h-[120px] transition-all duration-200 cursor-pointer whitespace-break-spaces",
              "flex items-center justify-center text-center",
              index === 0 ? "text-2xl font-semibold" : "text-xl",
              single?.purple ? "bg-[#3238a1] text-white hover:bg-[#252a8a]" : "bg-white border border-[#3238a1] text-[#3238a1] hover:bg-[#f3f3ff]",
            )}
          >
            {single?.name}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
