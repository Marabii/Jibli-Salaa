"use client";

import { motion } from "framer-motion";
import { FaGlobe, FaWallet, FaLeaf } from "react-icons/fa";
import { useTranslations } from "next-intl";

const AboutSection = () => {
  const t = useTranslations("HomePage.AboutSection");

  const features = [
    {
      icon: <FaGlobe className="text-4xl text-black mb-4" />,
      title: t("features.accessGlobalProducts.title"),
      description: t("features.accessGlobalProducts.description"),
    },
    {
      icon: <FaWallet className="text-4xl text-black mb-4" />,
      title: t("features.earnWhileTraveling.title"),
      description: t("features.earnWhileTraveling.description"),
    },
    {
      icon: <FaLeaf className="text-4xl text-black mb-4" />,
      title: t("features.sustainableDeliveries.title"),
      description: t("features.sustainableDeliveries.description"),
    },
  ];

  return (
    <section dir="auto" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-black">
          {t("sectionHeading")}
        </h2>
        <div className="flex flex-wrap -mx-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full md:w-1/3 px-4 mb-12 flex"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="border-2 border-black p-6 rounded-3xl hover:shadow-2xl transition flex flex-col w-full h-full">
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-3xl text-black capitalize font-semibold mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-black text-center flex-grow">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
