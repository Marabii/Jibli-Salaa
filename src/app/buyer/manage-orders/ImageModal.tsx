// components/ImageModalWrapper.tsx
"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ImageModalWrapperProps {
  src: string;
  alt: string;
  children?: ReactNode; // Allow passing children for flexibility
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const ImageModalWrapper: FC<ImageModalWrapperProps> = ({
  src,
  alt,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Handle closing the modal with the Esc key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body from scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Element */}
      <div className="cursor-pointer relative h-48 w-full" onClick={openModal}>
        {children ? (
          children
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="transition-transform duration-300 transform hover:scale-105 rounded-t-lg"
            priority={false}
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
          />
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={closeModal}
          >
            <motion.div
              className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full mx-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-20 text-gray-600 hover:text-gray-800"
                onClick={closeModal}
                aria-label="Close Modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="relative w-full h-0 pb-[56.25%]">
                {/* 16:9 Aspect Ratio */}
                <Image
                  src={src}
                  alt={alt}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                  className="rounded-lg"
                  priority={false}
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageModalWrapper;
