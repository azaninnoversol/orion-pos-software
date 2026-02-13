import React, { InputHTMLAttributes } from "react";

// animations
import { motion, Variants } from "framer-motion";

// components
import { Input } from "../ui/input";

// icons
import { Eye, EyeClosed } from "lucide-react";

// helper
import { cn } from "@/lib/utils";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly?: boolean;
  className?: string;
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  togglePassword?: () => void;
  custom?: number;
  disabled?: boolean;
  suffix?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  className,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  isPasswordVisible,
  togglePassword,
  custom = 0,
  suffix,
  disabled,
  readonly,
  ...props
}) => {
  return (
    <motion.div variants={fadeUpVariant} custom={custom} className="flex flex-col gap-2 relative w-full">
      <label className={`text-gray-600 font-medium`}>{label}</label>

      <Input
        type={showPasswordToggle && !isPasswordVisible ? "password" : type}
        name={name}
        placeholder={placeholder}
        className={cn("border-gray-300 focus-visible:ring-[#3238a1] dark:text-black dark:placeholder:text-black", className)}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readonly}
        {...props}
      />

      {showPasswordToggle && togglePassword && (
        <div className="absolute bottom-1.5 right-3 cursor-pointer" onClick={togglePassword}>
          {isPasswordVisible ? <Eye className="text-gray-300" /> : <EyeClosed className="text-gray-300" />}
        </div>
      )}

      {suffix && <div className="absolute bottom-1.5 right-3">{suffix}</div>}
    </motion.div>
  );
};

export default React.memo(FormInput);
