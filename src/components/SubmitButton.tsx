"use client";

import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { FC } from "react";

interface SubmitButtonProps {
  pending: boolean;
  className?: string;
  defaultText: string;
  pendingText: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  pending,
  className,
  defaultText,
  pendingText,
}) => {
  return (
    <motion.button
      type="submit"
      className={twMerge(
        "flex items-center justify-center font-bold py-2 px-4 rounded transition-colors duration-300",
        className,
        pending ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
      )}
      disabled={pending}
      whileHover={!pending ? { scale: 1.05 } : {}}
      whileTap={!pending ? { scale: 0.95 } : {}}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-busy={pending}
      aria-live="polite"
    >
      {pending && (
        <motion.svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </motion.svg>
      )}
      {pending ? pendingText : defaultText}
    </motion.button>
  );
};

export default SubmitButton;
