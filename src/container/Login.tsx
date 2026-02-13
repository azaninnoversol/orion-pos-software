"use client";
import React, { useEffect, useState } from "react";

// aniamtions
import { AnimatePresence, motion, Variants } from "framer-motion";

// components
import Heading from "@/components/Heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// next
import { Caveat } from "next/font/google";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";

// helper-function
import { cn } from "@/lib/utils";

// icons
import { Eye, EyeClosed } from "lucide-react";

// toast
import { toast } from "sonner";

// api-service
import { loginUser } from "@/services/AuthService";

// firebase
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth, db } from "@/utils/config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// service
import { staffManageService } from "@/services/api_service";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

interface FormData {
  username?: string;
  email?: string;
  password?: string;
}

const defaultData = {
  username: "",
  email: "",
  password: "",
};

export const generatePasswordFromEmail = (email: string | undefined) => {
  if (!email) return "";
  const localPart = email.split("@")[0];
  return localPart + "@";
};

function Login() {
  const [FormData, setFormData] = useState<FormData>(defaultData);
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [status, setStatus] = useState<"LOGIN" | "IDLE" | "ERR">("IDLE");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem("emailForSignIn");
          if (!email) {
            email = window.prompt("Please enter your email to confirm sign-in");
          }
          if (!email) {
            toast.error("Email is required to complete sign-in.");
            return;
          }

          const result = await signInWithEmailLink(auth, email, window.location.href);
          const user = result.user;

          window.localStorage.removeItem("emailForSignIn");

          const staff = await staffManageService.getAll().then((res) => res?.find((item) => item.email === user.email));

          const token = await user.getIdToken();
          setCookie("TOKEN", token, { maxAge: 60 * 60 * 24 * 7 });
          setCookie("USER_ROLE", staff?.role, { maxAge: 60 * 60 * 24 * 7 });

          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              name: staff?.name || "",
              email: staff?.email,
              branch: staff?.branch,
              role: staff?.role,
              phone: staff?.phone,
              password: staff?.userCode,
              updatedAt: serverTimestamp(),
            });
          }

          toast.success("Login successful! 🎉");
          window.location.href = `${
            staff?.role === "cashier" ? "/cashier/dashboard" : staff?.role === "kitchen" ? "/kitchen/order-list" : "/dashboard"
          }`;
        }
      } catch (error) {
        toast.error("Login failed: " + (error as Error).message);
      }
    };

    completeSignIn();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = FormData;

    setStatus("LOGIN");
    try {
      const res = await loginUser({
        email: email || "",
        password: password || "",
      });

      const userDocRef = doc(db, "users", res.uid);

      const userSeen = {
        token: await res.getIdToken(),
        role: (await getDoc(userDocRef)).data()?.role,
      };

      if (res) {
        toast.success("User Login SuccessFully! 🎉");
        setCookie("TOKEN", userSeen.token);
        setCookie("USER_ROLE", userSeen.role);

        window.location.href = "/dashboard";
      } else {
        toast.error("Failed to create Account");
      }
    } catch (error) {
      toast.error(`Please Enter The Valid Account!`);
    } finally {
      setStatus("IDLE");
    }
  };

  const toggleOnOff = () => setIsPassword((prev) => !prev);

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="login"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white min-h-screen pt-32 pb-8"
      >
        <div className="w-[90%] md:w-[80%] mx-auto flex flex-col items-center justify-center">
          <Heading isLineShow={true} className="text-center max-[500px]:text-[34px] mb-8">
            <span className="text-[#3238a1]">Login</span> to Explore
          </Heading>

          <motion.form
            onSubmit={onSubmit}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="border-gray-200 border-2 bg-white w-full md:w-[70%] lg:w-[50%] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 mx-auto"
          >
            <motion.div variants={fadeUpVariant} custom={0}>
              <Heading isLineShow={true} className={cn(caveat.className, "text-center w-full")}>
                <span className="text-[#3238a1]">Let's</span> Explore
              </Heading>
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={1} className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Full Name</label>
              <Input
                type="text"
                name="username"
                placeholder="Enter your full name"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                value={FormData.username}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={2} className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                value={FormData.email}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={3} className="flex flex-col gap-2 relative">
              <label className="text-gray-600 font-medium">Password</label>
              <Input
                type={isPassword ? "password" : "text"}
                name="password"
                placeholder="Enter your password"
                className="border-gray-300 focus-visible:ring-[#3238a1]"
                value={FormData.password}
                onChange={handleChange}
              />
              <div className="absolute bottom-1.5 right-3 cursor-pointer" onClick={toggleOnOff}>
                {isPassword ? <Eye className="text-gray-300" /> : <EyeClosed className="text-gray-300" />}
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} custom={4}>
              <Button
                // disabled={Object.values(FormData).some((val) => !val || val.trim() === "")}
                type="submit"
                variant="destructive"
                className="bg-[#3238a1] text-white font-semibold py-2 mt-3 hover:bg-[#2a3190] w-full transition-all"
              >
                {status === "LOGIN" ? "Submitting..." : "Login"}
              </Button>
            </motion.div>

            <motion.div className="flex items-center justify-center mt-2">
              <span>
                Don't Have An Account?{" "}
                <Link href="/signup" className="hover:underline text-[#3238a1]">
                  Signup
                </Link>
              </span>
            </motion.div>
          </motion.form>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

export default React.memo(Login);
