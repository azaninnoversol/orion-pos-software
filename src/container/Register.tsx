"use client";
import React, { useState } from "react";

//animations
import { AnimatePresence, motion } from "framer-motion";
import { fadeUpVariant } from "@/lib/animations";

//components
import Heading from "@/components/Heading";

//next
import { Caveat } from "next/font/google";
import Link from "next/link";
import { setCookie } from "cookies-next";

//helper-function
import { cn } from "@/lib/utils";

//components
import { Button } from "@/components/ui/button";
import StepOne from "@/components/registerSteps/StepOne";
import StepTwo from "@/components/registerSteps/StepTwo";
import StepThree from "@/components/registerSteps/StepThree";

//icons
import { CheckCircle } from "lucide-react";

//toast
import { toast } from "sonner";

//api-service
import { registerUser } from "@/services/AuthService";
import { set } from "date-fns";
import { branchManageService } from "@/services/api_service";

const caveat = Caveat({ subsets: ["latin"], weight: ["400"] });

interface FormData {
  username: string;
  email: string;
  password: string;
  c_password: string;

  //step 2
  branch?: {
    id: string;
    name: string;
  };
  address?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  phone?: string | number;
  shiftStartTime?: string | Date;
  shiftEndTime?: string | Date;

  //step 3
  card_number?: number | string;
  card_cvc?: number | string;
  card_date?: Date | number | string;
}

const defaultData: FormData = {
  username: "",
  email: "",
  password: "",
  c_password: "",

  //step 2
  branch: {
    id: "",
    name: "",
  },
  address: "",
  country: "",
  city: "",
  zipCode: "",

  //step 3
  card_number: "",
  card_cvc: "",
  card_date: "",
};

const StepIndicator: React.FC<{ step: number; total: number }> = ({ step, total }) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
      {Array.from({ length: total }).map((_, index) => {
        const completed = index < step - 1;
        const isCurrent = index === step - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                completed
                  ? "bg-[#3238a1] text-white"
                  : isCurrent
                  ? "border-2 border-gray-300 text-[#3238a1]"
                  : "border-2 border-gray-300 text-gray-500",
              )}
            >
              {completed ? <CheckCircle size={18} /> : index + 1}
            </div>
            {index < total - 1 && <div className="w-8 h-1 bg-gray-300"></div>}
          </div>
        );
      })}
    </div>
  );
};

function Register() {
  const [FormData, setFormData] = useState<FormData>(defaultData);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      if (name === "branch") {
        return {
          ...prev,
          branch: {
            ...prev.branch,
            name: value,
          },
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const togglePassword = () => setIsPassword((prev) => !prev);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (step < 3) {
      nextStep();
      return;
    } else {
      try {
        let branchId = FormData.branch?.id;
        if (!branchId) {
          branchId = crypto.randomUUID();
        }

        const userData = {
          name: FormData.username,
          email: FormData.email,
          password: FormData.password,
          role: "manager",
          branch: {
            id: branchId,
            name: FormData.branch?.name || "Unnamed Branch",
          },
          address: FormData.address || "",
          country: FormData.country || "",
          city: FormData.city || "",
          zipCode: FormData.zipCode || "",
          card_number: FormData.card_number || "",
          card_cvc: FormData.card_cvc || "",
          card_date: FormData.card_date || "",
          phone: FormData.phone || "",
          shiftStartTime: (FormData.shiftStartTime as string) || "",
          shiftEndTime: (FormData.shiftEndTime as string) || "",
          createdAt: new Date().getTime(),
        };

        const res = await registerUser(userData);
        await branchManageService.set(branchId, {
          id: branchId,
          managerId: res.uid,
          country: FormData.country as string,
          branchName: FormData.branch?.name || "Unnamed Branch",
          city: FormData.city || "",
          phone: FormData.phone || "",
          shiftStartTime: (FormData.shiftStartTime as string) || "",
          shiftEndTime: (FormData.shiftEndTime as string) || "",
          createdAt: new Date().getTime(),
        });

        if (!res) throw new Error("Failed to create account");

        const token = await res.getIdToken();
        localStorage.setItem("USER_ID", res.uid);
        localStorage.setItem("BRANCH_ID", branchId);
        setCookie("TOKEN", token);
        setCookie("USER_ROLE", "manager");

        toast.success("Account created successfully!");
        window.location.href = "/dashboard";
      } catch (error) {
        toast.error(`Signup failed: ${error instanceof Error ? error.message : error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        FormData.username.trim() !== "" &&
        FormData.email.trim() !== "" &&
        FormData.password.trim() !== "" &&
        FormData.c_password.trim() === FormData.password
      );
    }

    if (step === 2) {
      return FormData.address?.trim() !== "" && FormData.country?.trim() !== "" && FormData.city?.trim() !== "" && FormData.zipCode?.trim() !== "";
    }

    if (step === 3) {
      return (
        String(FormData.card_number || "").trim() !== "" &&
        String(FormData.card_cvc || "").trim() !== "" &&
        (FormData.card_date instanceof Date || String(FormData.card_date || "").trim() !== "")
      );
    }

    return false;
  };

  return (
    <motion.section
      key="register"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white min-h-screen pt-32"
    >
      <div className="w-[90%] md:w-[80%] mx-auto flex flex-col items-center justify-center">
        <Heading isLineShow className="text-center max-[500px]:text-[34px] mb-4">
          <span className="text-[#3238a1]">Join the</span> Adventure
        </Heading>

        <motion.form
          onSubmit={step === 3 ? onSubmit : (e) => e.preventDefault()}
          className={cn(
            "mb-10 border-gray-200 border-2 bg-white rounded-2xl p-8 shadow-2xl flex flex-col gap-6 mx-auto transition-all duration-500",
            step === 3 ? "w-full md:w-[90%] lg:w-[80%]" : "w-full md:w-[70%] lg:w-[50%]",
          )}
        >
          <StepIndicator step={step} total={3} />

          <motion.div variants={fadeUpVariant} custom={0}>
            <Heading isLineShow={true} className={cn(caveat.className, "text-center w-full")}>
              {step === 1 ? (
                <>
                  <span className="text-[#3238a1]">Create</span> Profile
                </>
              ) : step === 2 ? (
                <>
                  <span className="text-[#3238a1]">Add</span> Location
                </>
              ) : (
                <>
                  <span className="text-[#3238a1]">Select Paym</span>ent Method
                </>
              )}
            </Heading>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && <StepOne FormData={FormData} handleChange={handleChange} isPassword={isPassword} togglePassword={togglePassword} />}

            {step === 2 && <StepTwo FormData={FormData} handleChange={handleChange} />}

            {step === 3 && <StepThree FormData={FormData} handleChange={handleChange} />}
          </AnimatePresence>

          <div className="flex justify-between mt-2 items-center">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="w-[48%]">
                Back
              </Button>
            )}

            <Button
              type="button"
              onClick={() => {
                if (step < 3) nextStep();
                else onSubmit(new Event("submit") as any);
              }}
              disabled={isLoading || !isStepValid()}
              className={`w-full bg-[#3238a1] text-white font-semibold py-2 hover:bg-[#2a3190] transition-all ${step > 1 ? "w-[48%]" : "w-full"}`}
            >
              {step === 3 ? (isLoading ? "Submitting..." : "Create Account") : "Next"}
            </Button>
          </div>

          <div className="flex items-center justify-center mt-2">
            <span>
              Already Have An Account?{" "}
              <Link href="/login" className="hover:underline text-[#3238a1]">
                Login
              </Link>
            </span>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
}

export default React.memo(Register);
