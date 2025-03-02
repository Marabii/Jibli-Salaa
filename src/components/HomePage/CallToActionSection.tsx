"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type CallToActionSectionProps = {
  locale: string;
};

const CallToActionSection = ({ locale }: CallToActionSectionProps) => {
  const t = useTranslations("HomePage.CallToActionSection");

  return (
    <section dir={locale === "ar" ? "rtl" : "ltr"} className="py-20 bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl text-white font-bold mb-4">
          {t("sectionHeading")}
        </h2>
        <p className="text-xl mb-8 text-secondary">{t("sectionParagraph")}</p>
        <motion.div
          className="flex gap-4 justify-center space-x-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/buyer"
            className="inline-flex font-bold items-center bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
          >
            {t("buyerButton")}
          </Link>
          <Link
            href="/traveler"
            className="inline-flex font-bold items-center bg-transparent border-2 border-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
          >
            {t("travelerButton")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
