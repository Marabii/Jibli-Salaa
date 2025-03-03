"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function CollapsibleText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  const t = useTranslations("BuyerPage.BuyerPay.OrderId.CollapsibleText");

  return (
    <div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          !expanded ? "line-clamp-3" : ""
        } text-gray-300 leading-relaxed`}
      >
        {text}
      </motion.p>
      <button
        onClick={toggleExpanded}
        className="mt-2 text-blue-400 hover:underline focus:outline-none"
      >
        {expanded ? t("showLess") : t("showMore")}
      </button>
    </div>
  );
}
