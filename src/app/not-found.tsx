"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGES } from "@/utils/resourses";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 bg-white dark:bg-card">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
        <Image src={IMAGES.notFound} alt="404" width={400} height={400} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 dark:text-gray-300 text-xl mb-6 mt-2"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <Button onClick={handleGoBack} className="bg-purple-600 hover:bg-purple-700 text-white dark:text-gray-100">
        Go Back
      </Button>
    </div>
  );
}
