"use client";
import { BuyerOrderState } from "@/interfaces/Order/order";
import { useAppSelector } from "@/store/hooks";
import apiClient from "@/utils/apiClient";
import { ChangeEvent, useState } from "react";

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

  const handleSubmit = async (): Promise<void> => {
    try {
      if (selectedFiles.length === 0) {
        throw new Error("No images selected.");
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

      const response = await apiClient("/api/protected/postOrder", {
        method: "POST",
        body: data,
        headers: {}, // No need to set Content-Type for FormData
      });

      if (!response.ok) {
        const errorMessage = await response
          .json()
          .then((res: { message: string }) => res.message || "Unknown error");
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      const result = await response.json();
      console.log("Response:", result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Error:", e.message);
      } else {
        console.error("An unknown error occurred.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <>
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
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
      </label>
      <button onClick={handleSubmit}>Send Data</button>
    </>
  );
}
