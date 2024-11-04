"use client";
import { BuyerOrderState } from "@/interfaces/Order/order";
import { useAppSelector } from "@/store/hooks";
import apiClient from "@/utils/apiClient";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function SendData() {
  const buyerOrder = useAppSelector(
    (state: {
      buyerOrder: {
        value: Omit<
          BuyerOrderState["value"],
          "buyerId" | "placedAt" | "isOrderAccepted" | "orderStatus"
        >;
      };
    }) => state.buyerOrder.value
  );

  // Local state to store selected files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Validation function
  const validate = () => {
    let errors: { [key: string]: string } = {};
    const regexProductName = /^[a-zA-Z0-9\s.,'-]{3,100}$/;
    const regexDescription = /^[a-zA-Z0-9\s.,'"-]{10,1000}$/;
    const regexDeliveryInstructions = /^[a-zA-Z0-9\s.,'"-]{10,1000}$/;

    // Validate productURL (optional but must be valid if provided)
    if (
      buyerOrder.productURL &&
      !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(buyerOrder.productURL)
    ) {
      errors.productURL = "Please enter a valid URL.";
    }

    // Validate estimatedValue (required and > 10)
    if (!buyerOrder.estimatedValue || buyerOrder.estimatedValue <= 10) {
      errors.estimatedValue = "Estimated value must be more than 10.";
    }

    // Validate productName (required, length 3-100, matches regex)
    if (
      !buyerOrder.productName ||
      !regexProductName.test(buyerOrder.productName)
    ) {
      errors.productName =
        "Product name is required, 3-100 characters, and may contain letters, numbers, spaces, and . , ' -";
    }

    // Validate description (required, length 10-1000, matches regex)
    if (
      !buyerOrder.description ||
      !regexDescription.test(buyerOrder.description)
    ) {
      errors.description =
        "Description is required, 10-1000 characters, and may contain letters, numbers, spaces, and . , ' \" -";
    }

    // Validate quantity (must be more than 1)
    if (buyerOrder.quantity < 1) {
      errors.quantity = "Quantity must be at least 1.";
    }

    // Validate each dimension (must be positive)
    if (buyerOrder.dimensions) {
      if (buyerOrder.dimensions.lengthInCm <= 0) {
        errors["dimensions.lengthInCm"] = "Length must be a positive number.";
      }
      if (buyerOrder.dimensions.widthInCm <= 0) {
        errors["dimensions.widthInCm"] = "Width must be a positive number.";
      }
      if (buyerOrder.dimensions.heightInCm <= 0) {
        errors["dimensions.heightInCm"] = "Height must be a positive number.";
      }
    } else {
      errors.dimensions = "Dimensions are required.";
    }

    // Validate deliveryInstructions (optional but must match regex if provided)
    if (
      buyerOrder.deliveryInstructions &&
      !regexDeliveryInstructions.test(buyerOrder.deliveryInstructions)
    ) {
      errors.deliveryInstructions =
        "Delivery instructions must be 10-1000 characters and may contain letters, numbers, spaces, and . , ' \" -";
    }

    // Validate initialDeliveryFee (must be larger than 5)
    if (!buyerOrder.initialDeliveryFee || buyerOrder.initialDeliveryFee <= 5) {
      errors.initialDeliveryFee = "Delivery fee must be larger than 5.";
    }

    // Validate preferredPickupPlace
    if (
      !buyerOrder.preferredPickupPlace ||
      !buyerOrder.preferredPickupPlace.formatted_address ||
      buyerOrder.preferredPickupPlace.lat === null ||
      buyerOrder.preferredPickupPlace.lng === null
    ) {
      errors.preferredPickupPlace =
        "Please enter or re-enter your preferred pickup place.";
    }

    // Validate images
    if (selectedFiles.length === 0) {
      errors.images = "Please select images before submitting.";
    }

    setValidationErrors(errors);

    // Return true if there are no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      // If validation fails, prevent form submission
      return;
    }

    const data = new FormData();

    // Append form fields excluding 'images'
    Object.keys(buyerOrder).forEach((key) => {
      if (key === "images") {
        return; // Skip 'images'
      }
      if (key === "dimensions" || key === "preferredPickupPlace") {
        data.append(
          key,
          JSON.stringify(buyerOrder[key as keyof typeof buyerOrder])
        );
      } else {
        data.append(key, String(buyerOrder[key as keyof typeof buyerOrder]));
      }
    });

    // Append images
    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      await apiClient("/api/protected/postOrder", {
        method: "POST",
        body: data,
        headers: {}, // No need to set Content-Type for FormData
      });
      alert("Order submitted successfully!");
      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("An unknown error occurred.");
        alert("An unknown error occurred.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      // Remove images validation error if files are selected
      if (e.target.files.length > 0) {
        setValidationErrors((prev) => {
          const { images, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleDeleteFile = (fileIndex: number) => {
    const newFiles = selectedFiles.filter((_, index) => index !== fileIndex);
    setSelectedFiles(newFiles);
    // Re-validate images
    if (newFiles.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        images: "Please select images before submitting.",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Product Images
      </h2>
      <label className="block mb-4">
        <span className="text-gray-600">
          Upload images of the product you're ordering
        </span>
        <input
          type="file"
          name="images"
          accept="image/*"
          required
          multiple
          onChange={handleFileChange}
          className={`mt-1 block w-full p-2 border rounded ${
            validationErrors.images ? "border-red-500" : "border-gray-300"
          }`}
        />
        {validationErrors.images && (
          <p className="text-red-500 text-sm">{validationErrors.images}</p>
        )}
      </label>
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

      {/* Display validation errors for other fields if any */}
      {Object.keys(validationErrors).map((key) => {
        if (key === "images") return null; // Already displayed above
        return (
          <p key={key} className="text-red-500 text-sm">
            {validationErrors[key]}
          </p>
        );
      })}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send Data
      </button>
    </form>
  );
}
