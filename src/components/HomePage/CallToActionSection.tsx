// components/CallToActionSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Join the Community?
        </h2>
        <p className="text-xl mb-8 text-secondary">
          Sign up today to start ordering products or earning money as a
          traveler.
        </p>
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/buyer"
            className="bg-accent text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
          >
            Sign Up as Buyer
          </Link>
          <Link
            href="/traveler"
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg hover:bg-green-600 transition"
          >
            Sign Up as Traveler
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
