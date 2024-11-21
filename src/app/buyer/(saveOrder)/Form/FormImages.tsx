"use client";

import { useContext, useEffect, useState } from "react";
import {
  AdditionalDataContext,
  AdditionalDataContextType,
} from "./FormWrapper";

export default function FormImages() {
  const additionalDataContext: AdditionalDataContextType = useContext(
    AdditionalDataContext
  );

  // State to hold the selected images
  const { additionalData, setAdditionalData } = additionalDataContext;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleImageDelete = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));
    setAdditionalData(formData);
  }, [selectedImages]);

  return (
    <>
      <label className="block mb-4">
        <span className="text-gray-600">
          Upload images of the product you're ordering
        </span>
        <input
          type="file"
          name="selectedFiles"
          accept="image/*"
          required
          multiple
          onChange={handleImageUpload}
          className="mt-1 block w-full p-2 border rounded border-gray-300"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-4">
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className="relative w-32 h-32 border border-gray-300 rounded overflow-hidden"
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleImageDelete(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              aria-label="Delete image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
