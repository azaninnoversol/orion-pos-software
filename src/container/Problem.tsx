"use client";
import React from "react";

//components
import Heading from "@/components/Heading";

//helper-function
import { cn } from "@/lib/utils";

//images
import { IMAGES } from "@/utils/resourses";

//next
import Image from "next/image";

//animation
import { motion } from "framer-motion";

const problemPoints: string[] = [
  "Businesses waste time using manual or rigid POS workflows.",
  "Lack of centralized sales tracking creates errors.",
  "Limited insights make decision-making difficult.",
  "Frequent menu and price changes are hard to manage.",
  "No secure multi-user access or remote control options.",
  "Insufficient support increases operational risks.",
];

const solutionPoints: string[] = [
  "Customizable workflows to match unique business needs.",
  "Centralized sales management in real-time.",
  "Simple, fast checkout experience for peak hours.",
  "Easy tools to update menus and pricing anytime.",
  "Multi-user roles and permissions for secure staff access.",
  "24/7 customer support for uninterrupted operations.",
];

const targetAudience = [
  {
    label: "1. Restaurants:",
    title: "that need to manage menus, orders, staff, and fast checkout during peak hours.",
  },
  {
    label: "2. Cafes:",
    title: "that require simple workflows, quick sales processing, and flexible menu updates.",
  },
  {
    label: "3. Food chains:",
    title: "that need scalability, real-time sales tracking, and centralized management.",
  },
];

const projectScope = [
  {
    label: "1. Order Management:",
    title: "Add, edit, and manage customer orders quickly.",
  },
  {
    label: "2. Menu Management:",
    title: "Create and update menu items, categories, and prices.",
  },
  {
    label: "3. Checkout & Payments:",
    title: "Fast checkout process & payment options.",
  },
  {
    label: "4. User Roles & Permissions:",
    title: "Multi-user access with different permissions for staff, managers, and admins.",
  },
  {
    label: "5. Sales Tracking & Reports:",
    title: "Real-time sales dashboard and basic reporting for daily/weekly performance.",
  },
  {
    label: "6. Branch Management:",
    title: "Support for single or multiple outlets with centralized sales tracking.",
  },
  {
    label: "7. Customer Support Access:",
    title: "24/7 support channel for issue resolution.",
  },
];

function Problem() {
  return (
    <motion.section id="problem" className="px-4 sm:px-6 lg:px-16 py-16 bg-white overflow-hidden">
      <motion.div
        className="flex flex-col items-center gap-2 mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Heading isLineShow>
          Problem <span className="text-[#3238a1]">&</span> Solutions
        </Heading>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row gap-10 justify-between"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
          className="lg:w-1/3 w-full"
        >
          <CardProblemSolution
            items={problemPoints}
            description="Many businesses struggle with outdated or limited POS systems that don't meet their operational needs. This leads to inefficiency, errors, and missed opportunities for growth."
          >
            Problem
          </CardProblemSolution>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="lg:w-1/3 w-full flex flex-col items-center gap-6"
        >
          <Image src={IMAGES.dashboard} alt="img-1" className="w-full max-w-[400px] rounded-lg shadow-lg" width={100} height={100} />
          <Image src={IMAGES.dashboard} alt="img-2" className="w-full max-w-[400px] rounded-lg shadow-lg" width={100} height={100} />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
          }}
          className="lg:w-1/3 w-full"
        >
          <CardProblemSolution
            classNameLine="bg-green-500"
            className="uppercase text-green-600"
            items={solutionPoints}
            description="A modern POS system can solve these challenges by being flexible, scalable, and user-friendly."
          >
            Solution
          </CardProblemSolution>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start mt-16 gap-8 max-[1025px]:flex-col"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="lg:w-1/2 w-full">
          <Heading className="uppercase text-[#3237A7] max-sm:text-xl" classNameLine="bg-[#3237A7]" isLineShow={false}>
            Target Audience
          </Heading>

          <motion.div className="mt-6" initial="hidden" whileInView="visible" transition={{ staggerChildren: 0.15 }}>
            {targetAudience.map((single) => (
              <motion.div
                key={single.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pb-6"
              >
                <h2 className="text-2xl font-semibold max-sm:text-lg">{single.label}</h2>
                <p className="text-lg max-sm:text-sm">{single.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:w-1/3 w-full flex justify-center"
        >
          <Image src={IMAGES.laptop1} alt="laptop" width={200} height={200} className="w-full max-w-[400px] rounded-3xl shadow-md" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start mt-16 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="lg:w-2/3 w-full">
          <Heading className="uppercase text-[#3237A7] max-sm:text-xl" classNameLine="bg-[#3237A7]" isLineShow={false}>
            Project Scope
          </Heading>

          <p className="font-normal pt-6 text-lg max-sm:text-md">
            The MVP of the POS system will focus on delivering the core functionalities needed by restaurants, cafés, and food chains to manage daily
            operations effectively.
          </p>

          <div className="mt-6">
            {projectScope.map((single) => (
              <motion.div
                key={single.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pb-5 flex flex-col sm:flex-row items-start sm:items-baseline gap-2 max-sm:gap-1"
              >
                <h2 className="text-2xl max-sm:text-lg font-semibold">{single.label}</h2>
                <p className="text-lg max-sm:text-sm">{single.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:w-1/3 w-full flex justify-center"
        >
          <Image src={IMAGES.teer} alt="project-scope" className="w-full max-w-[400px] rounded-3xl shadow-md" width={200} height={200} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default React.memo(Problem);

interface CardProblemSolutionProps {
  children: React.ReactNode;
  className?: string;
  classNameLine?: string;
  description: string;
  items: string[];
}

const CardProblemSolution = ({ children, className, classNameLine, description, items = [] }: CardProblemSolutionProps) => {
  return (
    <motion.div className="rounded-xl" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Heading className={cn("uppercase text-red-500 max-sm:text-2xl", className)} classNameLine={classNameLine} isLineShow={false}>
        {children}
      </Heading>

      <p className="font-normal pt-4 text-lg max-sm:text-md">{description}</p>

      <ul className="pt-6 px-2 sm:px-6 list-disc list-inside space-y-3">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="font-medium text-xl max-sm:text-[16px]"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
