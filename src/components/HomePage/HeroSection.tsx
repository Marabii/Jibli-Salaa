import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Connect with Travelers, Get Products Delivered
          </motion.h1>
          <motion.p
            className="text-lg mb-8 text-secondary"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Jibli is a platform that connects buyers with travelers for seamless
            delivery of products, both locally and internationally.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link
              href="#how-it-works"
              className="inline-flex items-center bg-accent text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
            >
              Learn How It Works <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
        {/* SVG Illustration */}
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg
            className="w-full h-auto"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            {/* Example SVG: Customize as needed */}
            <circle cx="400" cy="300" r="200" fill="#3B82F6" opacity="0.1" />
            <path
              d="M200 300 C200 150, 600 150, 600 300 S600 450, 400 450"
              stroke="#3B82F6"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M400 300 L400 100"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="400" cy="300" r="20" fill="#3B82F6" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
