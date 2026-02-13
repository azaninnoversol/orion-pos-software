"use client";

//icons
import { Cake, MapPin, BriefcaseBusiness } from "lucide-react";

//images
import { IMAGES } from "@/utils/resourses";

//helper-function
import {
  frustrations,
  frustrationsThree,
  frustrationsTwo,
  goals,
  goalsThree,
  goalsTwo,
  motivations,
  motivationsThree,
  motivationsTwo,
  needs,
  needsThree,
  needsTwo,
} from "@/lib/utils";

//components
import UserPersona from "@/components/persona/UserPersona";
import Heading from "@/components/Heading";

//animation
import { motion } from "framer-motion";

export default function PersonaPage() {
  return (
    <section id="user" className="p-6 bg-white pt-20 overflow-hidden px-16 max-[1124px]:px-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center flex-col gap-2"
      >
        <Heading isLineShow={true} className="max-[500px]:text-[34px]">
          <span className="text-[#3238a1]">User</span> Persona
        </Heading>
      </motion.div>

      <UserPersona
        title="Person 1- Food Chain Manager"
        userInfo={{
          name: "Mohamed Hassan",
          image: IMAGES.userOne,
          details: [
            { label: "Age", ans: "45", icon: <Cake color="#353AA3" /> },
            {
              label: "Location",
              ans: "Cairo, Egypt",
              icon: <MapPin color="#353AA3" />,
            },
            {
              label: "Occupation",
              ans: "Food Chain Manager",
              icon: <BriefcaseBusiness color="#353AA3" />,
            },
          ],
        }}
        bio="Mohamed Hassan, 45, is the operations manager of an 8-branch restaurant chain. He oversees branch managers, monitors performance, and ensures consistency in service, menus, and customer experience while planning for future expansion."
        points={[
          { title: "Goals", items: goals },
          { title: "Motivations", items: motivations },
          { title: "Needs", items: needs },
          { title: "Frustrations", items: frustrations },
        ]}
      />

      <UserPersona
        title="Person 2- Restaurant Owner"
        userInfo={{
          name: "Ahmed Youssef",
          image: IMAGES.userTwo,
          details: [
            { label: "Age", ans: "35", icon: <Cake color="#353AA3" /> },
            {
              label: "Location",
              ans: "Cairo, Egypt",
              icon: <MapPin color="#353AA3" />,
            },
            {
              label: "Occupation",
              ans: "Restaurant Owner",
              icon: <BriefcaseBusiness color="#353AA3" />,
            },
          ],
        }}
        bio="Ahmed Youssef, 35, owns a mid-sized family restaurant with 10 staff members. He manages daily operations, trains employees, and ensures customers get fast service, especially during peak hours."
        points={[
          { title: "Goals", items: goalsTwo },
          { title: "Motivations", items: motivationsTwo },
          { title: "Needs", items: needsTwo },
          { title: "Frustrations", items: frustrationsTwo },
        ]}
      />

      <UserPersona
        title="Person 3- Café Owner"
        userInfo={{
          name: "Omar Nabil",
          image: IMAGES.userThree,
          details: [
            { label: "Age", ans: "29", icon: <Cake color="#353AA3" /> },
            {
              label: "Location",
              ans: "ALex, Egypt",
              icon: <MapPin color="#353AA3" />,
            },
            {
              label: "Occupation",
              ans: "Café Owner",
              icon: <BriefcaseBusiness color="#353AA3" />,
            },
          ],
        }}
        bio="Omar Nabil, 29, runs a trendy café in downtown Cairo with 6 staff members. His café attracts young customers, and he frequently updates the menu to match seasonal trends and customer preferences."
        points={[
          { title: "Goals", items: goalsThree },
          { title: "Motivations", items: motivationsThree },
          { title: "Needs", items: needsThree },
          { title: "Frustrations", items: frustrationsThree },
        ]}
      />
    </section>
  );
}
