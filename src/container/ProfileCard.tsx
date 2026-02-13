"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Camera, ChevronLeft } from "lucide-react";
import { IMAGES } from "@/utils/resourses";
import { toast } from "sonner";
import FormInput from "@/components/registerSteps/FormInput";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { Status } from "./dashboard-pages/customers/data";
import Skeleton from "@/components/Skeleton/Skeleton";
import { logoutUser, updateUserEmail, updateUserName, updateUserPassword } from "@/services/AuthService";
import CustomTooltip from "@/components/CustomTooltip";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface ProfileCardData {
  name: string;
  email: string;
  confirmPassword?: string;
  oldPassword?: string;
  newPassword?: string;
  role: string;
  photoURL?: string;
}

function ProfileCard() {
  const [profile, setProfile] = useState<ProfileCardData | null>(null);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [isLoad, setIsLoad] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const profileHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoad("information");
    try {
      await updateUserName(profile?.name as string);
      await updateUserEmail(profile?.email as string, profile?.oldPassword);
      await updateUserPassword(profile?.oldPassword as string, profile?.confirmPassword as string);
      toast.success(`Username & Email Update Successfully!`);
    } catch (error) {
      console.log(error, "err");
      toast.error(`Error: ${error}`);
    } finally {
      setIsLoad(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setProfile({ ...profile!, photoURL: fileURL });
      toast.success("Profile photo updated (preview)!");
    }
  };

  const handleChange = (key: keyof ProfileCardData, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      deleteCookie("TOKEN");
      deleteCookie("USER_ROLE");
      toast.success("You logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("User not logged in");
        return;
      }

      try {
        setStatus(Status.FETCHING);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          toast.error("User data not found");
          return;
        }

        const userData = userDocSnap.data();

        setProfile({
          name: userData.name || "",
          email: user.email || "",
          role: userData.role || "guest",
          photoURL: userData.photoURL || "",
        });
        setStatus(Status.FETCHED);
      } catch (error) {
        toast.error("Failed to fetch profile: " + (error as Error).message);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
        className="min-h-[86vh] flex flex-col items-center pt-16 pb-4 bg-card max-w-[1820px] mx-auto rounded-sm"
      >
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl flex flex-col items-center dark:bg-white bg-gray-50 rounded-xl gap-6 pb-8"
        >
          <motion.form onSubmit={profileHandler} className="w-full">
            <div className="flex flex-col items-center relative mb-8 pt-4 md:pt-8 bg-sky-300 rounded-xl rounded-b-none">
              <CustomTooltip title="Back">
                <ChevronLeft className="absolute top-2 left-2 cursor-pointer text-black" size={32} onClick={() => router.back()} />
              </CustomTooltip>

              <div className="relative">
                <Image
                  src={profile?.photoURL || IMAGES.user.src}
                  alt="Profile"
                  width={200}
                  height={200}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#3238a1] object-cover"
                />

                <label className="absolute bottom-2 right-[18%] transform translate-x-1/2 bg-[#3238a1] p-2 rounded-full cursor-pointer hover:bg-[#5050c0]">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 px-6 md:px-10">
              <div className="flex flex-col gap-4 flex-1">
                <FormInput
                  label="Username"
                  name="name"
                  placeholder="John Doe..."
                  value={profile?.name ?? ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  suffix={status === Status.FETCHING && <Skeleton className="h-6 w-full" />}
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={profile?.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  suffix={status === Status.FETCHING && <Skeleton className="h-6 w-full" />}
                />

                <FormInput
                  label="Role"
                  name="role"
                  type="text"
                  placeholder="ROLE"
                  value={profile?.role ?? ""}
                  onChange={() => {}}
                  disabled
                  readonly
                  className="capitalize"
                />
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <FormInput
                  label="Current Password"
                  name="oldPassword"
                  type="password"
                  placeholder="Enter your current password"
                  value={profile?.oldPassword ?? ""}
                  onChange={(e) => handleChange("oldPassword", e.target.value)}
                />

                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={profile?.newPassword ?? ""}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                />

                <FormInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={profile?.confirmPassword ?? ""}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 mt-6">
              <Button type="button" className="bg-red-500 text-white hover:bg-red-700 w-fit sm:w-auto px-6 py-2 text-lg" onClick={logoutHandler}>
                {isLoading ? "Logout..." : "Signout"}
              </Button>

              <Button type="submit" className="bg-purple-500 text-white hover:bg-purple-700 w-fit sm:w-auto px-6 py-2 text-lg">
                {isLoad !== null ? "Updating..." : "Update Information"}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default React.memo(ProfileCard);
