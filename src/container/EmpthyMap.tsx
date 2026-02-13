"use client";
import React from "react";

//components
import Heading from "@/components/Heading";
import MapCard from "@/components/MapCard";

//helper-function
import { does, doesThree, doesTwo, feels, feelsThree, feelsTwo, says, saysThree, saysTwo, thinks, thinksThree, thinksTwo } from "@/lib/utils";

//images
import { IMAGES } from "@/utils/resourses";

//animation
import { motion } from "framer-motion";

function EmpthyMap() {
  return (
    <section id="map" className="p-6 bg-white pt-20 overflow-hidden px-16 max-[500px]:px-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center flex-col gap-2 mb-10 text-center list-none md:list-disc md:text-left"
      >
        <Heading isLineShow={true}>
          <span className="text-[#3238a1]">Empthy</span> map
        </Heading>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.25 } },
        }}
      >
        <MapCard
          personTitle="Person 1 - Food Chain Manager"
          userImage={IMAGES.userOne}
          mapSections={[
            { title: "Says", items: says },
            { title: "Thinks", items: thinks },
            { title: "Does", items: does },
            { title: "Feels", items: feels },
          ]}
        />

        <MapCard
          personTitle="Person 2 - Restaurant Owner"
          userImage={IMAGES.userTwo}
          mapSections={[
            { title: "Says", items: saysTwo },
            { title: "Thinks", items: thinksTwo },
            { title: "Does", items: doesTwo },
            { title: "Feels", items: feelsTwo },
          ]}
        />

        <MapCard
          personTitle="Person 3 — Café Owner"
          userImage={IMAGES.userThree}
          mapSections={[
            { title: "Says", items: saysThree },
            { title: "Thinks", items: thinksThree },
            { title: "Does", items: doesThree },
            { title: "Feels", items: feelsThree },
          ]}
        />
      </motion.div>
    </section>
  );
}

export default React.memo(EmpthyMap);
