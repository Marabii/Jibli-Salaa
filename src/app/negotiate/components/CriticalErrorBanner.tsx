"use client";

import { motion } from "framer-motion";

interface CriticalErrorBannerProps {
  criticalError: string | null;
  secondsLeft: number;
}

export default function CriticalErrorBanner({
  criticalError,
  secondsLeft,
}: CriticalErrorBannerProps) {
  if (!criticalError) return null;

  return (
    <motion.div
      className="w-full bg-red-600 text-white p-2 text-center fixed top-0 left-0 z-50"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      exit={{ y: -50 }}
      transition={{ duration: 0.2 }}
    >
      {`Critical error: ${criticalError} - Refreshing page in ${secondsLeft} seconds...`}
    </motion.div>
  );
}
