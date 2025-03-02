"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CriticalErrorBannerProps {
  criticalError: string | null;
  secondsLeft: number;
}

export default function CriticalErrorBanner({
  criticalError,
  secondsLeft,
}: CriticalErrorBannerProps) {
  const t = useTranslations("Negotiate.Components.CriticalErrorBanner");
  if (!criticalError) return null;

  return (
    <motion.div
      className="w-full bg-red-600 text-white p-2 text-center fixed top-0 left-0 z-50"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      exit={{ y: -50 }}
      transition={{ duration: 0.2 }}
    >
      {t("criticalErrorMessage", {
        error: criticalError,
        seconds: secondsLeft,
      })}
    </motion.div>
  );
}
