"use client";
import React from "react";

// animations
import { motion } from "framer-motion";

// components
import FormInput from "./FormInput";

interface StepOneProps {
  FormData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPassword: boolean;
  togglePassword: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ FormData, handleChange, isPassword, togglePassword }) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <FormInput label="Full Name" name="username" placeholder="Enter your full name" value={FormData.username} onChange={handleChange} custom={1} />

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={FormData.email}
        onChange={handleChange}
        custom={2}
      />

      <FormInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        value={FormData.password}
        onChange={handleChange}
        showPasswordToggle
        isPasswordVisible={isPassword}
        togglePassword={togglePassword}
        custom={3}
      />

      <FormInput
        label="Confirm Password"
        name="c_password"
        placeholder="Confirm your password"
        value={FormData.c_password}
        onChange={handleChange}
        showPasswordToggle
        isPasswordVisible={isPassword}
        togglePassword={togglePassword}
        custom={4}
      />
    </motion.div>
  );
};

export default React.memo(StepOne);
