"use client";

import { ChangeEvent, useRef, useState } from "react";

export default function FormImages() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteFile = (fileIndex: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mt-1 block w-full p-2 border rounded border-gray-300"
        />
      </label>
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded Preview"
                className="h-32 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleDeleteFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                aria-label="Delete image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
