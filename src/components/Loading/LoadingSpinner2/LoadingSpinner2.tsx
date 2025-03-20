// LoadingSpinner.tsx
"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="flex justify-center items-center"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg className="w-12 h-12 text-white" viewBox="0 0 50 50">
        <circle
          className="opacity-75"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
