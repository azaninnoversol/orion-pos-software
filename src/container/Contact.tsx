"use client";
import React, { useState } from "react";

//animations
import { motion, Variants } from "framer-motion";

//components
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

//toast
import { toast } from "sonner";

//next
import { Caveat } from "next/font/google";

//helper-function
import { cn } from "@/lib/utils";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

interface ContactState {
  username?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const defaultData: ContactState = {
  username: "",
  email: "",
  subject: "",
  message: "",
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

function Contact() {
  const [contactData, setContactData] = useState<ContactState>(defaultData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmpty = Object.values(contactData).some((val) => val === "");

    if (isEmpty) {
      toast.error("Please fill all fields!");
      return;
    }

    toast.success("Message sent successfully!");
    setContactData(defaultData);
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="contact"
      className="px-6 md:px-12 lg:pl-16 py-10 min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-[#3238a1]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div className="w-[90%] md:w-[80%] mx-auto flex flex-col">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex items-center flex-col gap-2">
          <Heading isLineShow={true} className="max-[500px]:text-[34px] max-[500px]:text-center text-white">
            Get in Touch with Us
          </Heading>
        </motion.div>

        <motion.div
          className="flex items-center justify-center w-full text-center lg:text-left"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.form
            onSubmit={onSubmit}
            className="border-gray-200 border-2 bg-white w-full md:w-[70%] lg:w-[50%] rounded-2xl p-8 shadow-2xl flex flex-col gap-6"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div variants={fadeUpVariant} custom={0} initial="hidden" whileInView="visible">
              <Heading isLineShow={true} className={cn(caveat.className, "text-center w-full")}>
                <span className="text-[#3238a1]">Let's</span> Talk
              </Heading>
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={1} initial="hidden" whileInView="visible" className="flex flex-col gap-2 text-left">
              <motion.label className="text-gray-600 font-medium" whileHover={{ scale: 1.03, color: "#3238a1" }}>
                Full Name
              </motion.label>
              <Input
                type="text"
                name="username"
                placeholder="Enter your full name"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                onChange={handleChange}
                value={contactData.username}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUpVariant} custom={2} initial="hidden" whileInView="visible" className="flex flex-col gap-2 text-left">
              <motion.label className="text-gray-600 font-medium" whileHover={{ scale: 1.03, color: "#3238a1" }}>
                Email Address
              </motion.label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                onChange={handleChange}
                value={contactData.email}
              />
            </motion.div>

            {/* Subject */}
            <motion.div variants={fadeUpVariant} custom={3} initial="hidden" whileInView="visible" className="flex flex-col gap-2 text-left">
              <motion.label className="text-gray-600 font-medium" whileHover={{ scale: 1.03, color: "#3238a1" }}>
                Subject
              </motion.label>
              <Input
                type="text"
                name="subject"
                placeholder="What is this about?"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                onChange={handleChange}
                value={contactData.subject}
              />
            </motion.div>

            {/* Message */}
            <motion.div variants={fadeUpVariant} custom={4} initial="hidden" whileInView="visible" className="flex flex-col gap-2 text-left">
              <motion.label className="text-gray-600 font-medium" whileHover={{ scale: 1.03, color: "#3238a1" }}>
                Message
              </motion.label>
              <Textarea
                name="message"
                placeholder="Write your message..."
                className="border-gray-300 focus-visible:ring-[#3238a1] min-h-[120px] resize-none"
                onChange={handleChange}
                value={contactData.message}
              />
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={5} initial="hidden" whileInView="visible">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="destructive"
                  className="bg-[#3238a1] text-white font-semibold py-2 mt-3 hover:bg-[#2a3190] transition-all duration-300 w-full"
                >
                  Send Message
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default React.memo(Contact);
