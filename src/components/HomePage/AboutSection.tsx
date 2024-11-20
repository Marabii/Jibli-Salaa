// components/AboutSection.tsx
"use client";

import { motion } from "framer-motion";
import { FaGlobe, FaWallet, FaLeaf } from "react-icons/fa";

const AboutSection = () => {
  const features = [
    {
      icon: <FaGlobe className="text-4xl text-accent mb-4" />,
      title: "Access Global Products",
      description:
        "Get items from around the world that are not available or are too expensive in your country.",
    },
    {
      icon: <FaWallet className="text-4xl text-accent mb-4" />,
      title: "Earn While Traveling",
      description:
        "Travelers can make extra money by delivering items along their route.",
    },
    {
      icon: <FaLeaf className="text-4xl text-accent mb-4" />,
      title: "Sustainable Deliveries",
      description:
        "Reduce carbon emissions by utilizing existing travel routes for deliveries.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Why Use Jibli?</h2>
        <div className="flex flex-wrap -mx-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="w-full md:w-1/3 px-4 mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
                {feature.icon}
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
