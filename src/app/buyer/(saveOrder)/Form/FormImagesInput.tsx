"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAdditionalData from "../../../../components/Form/useAdditionalData";
import Image from "next/image";

export default function FormImagesInput() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { addAdditionalData } = useAdditionalData();

  const handleImageUpload = (files: FileList) => {
    const filesArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
  };

  const handleImageDelete = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const formData = new FormData();
    selectedImages.forEach(
      (file) => file.size && formData.append("selectedFiles", file)
    );
    addAdditionalData(formData);
  }, [addAdditionalData, selectedImages]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false when leaving the container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full mt-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Upload images of the product you&apos;re ordering
      </h2>

      {/* Drag and Drop Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
        className={`mt-1 flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 48 48"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 20v8m0 0l4-4m-4 4l4 4M36 20v8m0 0l-4-4m4 4l-4 4M6 12h36a2 2 0 012 2v20a2 2 0 01-2 2H6a2 2 0 01-2-2V14a2 2 0 012-2z"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-500">
            Drag and drop images here, or click to select files
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files!)}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Selected Images Preview */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {selectedImages.map((image, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="rounded-lg object-fill"
                />
                <motion.button
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                  aria-label="Delete image"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &times;
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
