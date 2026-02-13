"use client";

import React, { useState, useEffect, memo } from "react";

// firebase
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/utils/config";

// animations
import { AnimatePresence, motion, Variants } from "framer-motion";

// components
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// toast
import { toast } from "sonner";

// helper-function
import { cn } from "@/lib/utils";

// next
import { Caveat } from "next/font/google";
import { useRouter } from "next/navigation";

// icons
import { Eye, EyeClosed } from "lucide-react";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

function CreatePassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [error, setError] = useState("");
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const navigate = useRouter();

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    if (!code) return setError("Invalid link");

    setOobCode(code);

    verifyPasswordResetCode(auth, code)
      .then((email) => setEmail(email))
      .catch(() => setError("Reset link invalid or expired"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password changed successfully!");
      navigate.push(`/login?email=${email}`);
    } catch (err) {
      setError("Error: " + (err as Error).message);
    }
  };

  const toggleOnOff = () => setIsPassword((prev) => !prev);

  if (error) return <p>{error}</p>;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="login"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white min-h-[66.7vh] pt-32"
      >
        <div className="w-[90%] md:w-[80%] mx-auto flex flex-col items-center justify-center">
          <Heading isLineShow={true} className="text-center max-[500px]:text-[34px] mb-8">
            <span className="text-[#3238a1]">Congralulation</span>
          </Heading>

          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="border-gray-200 border-2 bg-white w-full md:w-[70%] lg:w-[50%] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 mx-auto"
          >
            <motion.div variants={fadeUpVariant} custom={0}>
              <Heading isLineShow={true} className={cn(caveat.className, "text-center w-full")}>
                <span className="text-[#3238a1]">Let's</span> Create Password
              </Heading>
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={3} className="flex flex-col gap-2 relative">
              <label className="text-gray-600 font-medium">Create New Password</label>
              <Input
                type={isPassword ? "password" : "text"}
                name="password"
                placeholder="Enter your new password"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute bottom-1.5 right-3 cursor-pointer" onClick={toggleOnOff}>
                {isPassword ? <Eye className="text-gray-300" /> : <EyeClosed className="text-gray-300" />}
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={4}>
              <Button
                disabled={newPassword.trim() === ""}
                type="submit"
                variant="destructive"
                className="bg-[#3238a1] text-white font-semibold py-2 mt-3 hover:bg-[#2a3190] w-full transition-all"
              >
                Create New Password
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
export default memo(CreatePassword);
