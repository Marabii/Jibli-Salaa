"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useAdditionalData from "@/components/Form/useAdditionalData";
import { CompletedOrder } from "@/interfaces/Order/order";

export default function FormImagesInput({
  orderInfoOrg,
}: {
  orderInfoOrg: CompletedOrder;
}) {
  const t = useTranslations(
    "BuyerPage.ManageOrders.EditOrder.OrderId.Form.FormImagesInput"
  );
  const { addAdditionalData } = useAdditionalData();

  const [existingImages, setExistingImages] = useState<string[]>(
    () => orderInfoOrg.images || []
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    setSelectedImages((prev) => [...prev, ...imageFiles]);
  };

  const handleExistingImageDelete = (index: number) => {
    const urlToRemove = existingImages[index];
    setRemovedImages((prev) => [...prev, urlToRemove]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImageDelete = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const formData = new FormData();
    // Append new images as "newImagesFiles"
    selectedImages.forEach((file) => {
      formData.append("newImagesFiles", file);
    });
    // Append removed image URLs as "removeImages"
    removedImages.forEach((url) => {
      formData.append("removeImages", url);
    });
    // Send updated formData to your global form store
    addAdditionalData(formData);
  }, [selectedImages, removedImages, addAdditionalData]);

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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Calculate total images at any point
  const totalImages = existingImages.length + selectedImages.length;

  return (
    <div dir="auto" className="w-full mt-5">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {t("uploadHeader")}
      </h2>

      <p className="mb-4 text-gray-600 text-sm">{t("instructionParagraph")}</p>

      {/* Drag & Drop Area */}
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
        <div dir="auto" className="text-center">
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
            {t("uploadInstructions")}
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

      {/* Display Existing Images with option to remove */}
      <AnimatePresence>
        {existingImages.length > 0 && (
          <div dir="auto" className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("previouslyUploadedImages")}
            </h3>
            <div dir="auto" className="flex flex-wrap gap-4">
              {existingImages.map((imgUrl, index) => (
                <motion.div
                  key={`old-${imgUrl}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                  <Image
                    src={imgUrl}
                    alt={`Existing ${index}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <motion.button
                    onClick={() => handleExistingImageDelete(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                    aria-label={t("deleteExistingImage")}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    // Disable if there's only 1 total image left
                    disabled={totalImages === 1}
                  >
                    &times;
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Display New Images with option to remove */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <div dir="auto" className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t("newImagesToUpload")}
            </h3>
            <div dir="auto" className="flex flex-wrap gap-4">
              {selectedImages.map((file, index) => (
                <motion.div
                  key={`new-${file.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <motion.button
                    onClick={() => handleNewImageDelete(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                    aria-label={t("deleteNewImage")}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    // Disable if there's only 1 total image left
                    disabled={totalImages === 1}
                  >
                    &times;
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
