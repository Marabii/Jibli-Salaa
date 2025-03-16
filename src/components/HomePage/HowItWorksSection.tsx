"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FaClipboardList, FaCheckCircle, FaDollarSign } from "react-icons/fa";
import { useTranslations } from "next-intl";

const HowItWorksSection = () => {
  const t = useTranslations("HomePage.HowItWorksSection");

  const steps = [
    {
      icon: <FaClipboardList className="text-4xl text-black mb-4" />,
      title: t("steps.postRequest.title"),
      description: t("steps.postRequest.description"),
    },
    {
      icon: <FaCheckCircle className="text-4xl text-black mb-4" />,
      title: t("steps.travelerAccepts.title"),
      description: t("steps.travelerAccepts.description"),
    },
    {
      icon: <FaDollarSign className="text-4xl text-black mb-4" />,
      title: t("steps.deliveryConfirmation.title"),
      description: t("steps.deliveryConfirmation.description"),
    },
  ];

  return (
    <section dir="auto" id="how-it-works" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-black font-bold mb-8">
          {t("sectionHeading")}
        </h2>
        <div className="flex flex-wrap -mx-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full md:w-1/3 px-4 mb-12 flex"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="border-2 border-black p-6 rounded-3xl hover:shadow-2xl transition flex flex-col w-full">
                <div className="flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-3xl text-black capitalize font-semibold mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-black text-center flex-grow">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/register"
            className="inline-flex font-bold items-center bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
          >
            {t("getStarted")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
