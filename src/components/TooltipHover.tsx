"use client";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipHoverProps {
  tooltipText: string;
  children: ReactNode;
}

export default function TooltipHover({
  tooltipText,
  children,
}: TooltipHoverProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ x: "-50%", y: -5 }}
            animate={{ x: "-50%", y: 0 }}
            exit={{ opacity: 0, y: -5, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 px-4 font-semibold text-gray-500"
          >
            <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">
              {tooltipText}
            </div>
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800 mx-auto" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
