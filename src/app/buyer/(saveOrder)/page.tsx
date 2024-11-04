"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import type { BuyerOrderState } from "@/interfaces/Order/order";
import { useAppDispatch } from "@/store/hooks";
import { setBuyerOrder } from "@/store/BuyerOrderSlice/slice";

type FormData = Omit<
  BuyerOrderState["value"],
  "buyerId" | "placedAt" | "isOrderAccepted" | "orderStatus"
>;

const initialState: FormData = {
  description: "",
  images: [],
  estimatedValue: 0,
  initialDeliveryFee: 0,
  deliveryInstructions: "",
  productName: "",
  dimensions: {
    lengthInCm: 0,
    widthInCm: 0,
    heightInCm: 0,
  },
  productURL: "",
  quantity: 1,
  preferredPickupPlace: {
    formatted_address: "",
    lat: null,
    lng: null,
  },
  orderAccepted: false,
  _id: "",
};

const ProductForm = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const dispatch = useAppDispatch();

  // Handle change event for input fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("dimensions.")) {
      const dimensionKey = name.split(".")[1];
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions,
          [dimensionKey]: Number(value),
        },
      });
    } else if (name.startsWith("preferredPickupPlace.")) {
      const placeKey = name.split(".")[1];
      setFormData({
        ...formData,
        preferredPickupPlace: {
          ...formData.preferredPickupPlace,
          [placeKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "estimatedValue" ||
          name === "quantity" ||
          name === "initialDeliveryFee"
            ? Number(value)
            : value,
      });
    }
  };

  useEffect(() => {
    dispatch(setBuyerOrder(formData));
  }, [formData]);

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Product Images
      </h2>

      <label className="block mb-4">
        <span className="text-gray-600">Product URL:</span>
        <input
          type="text"
          name="productURL"
          value={formData.productURL}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Estimated Value:</span>
        <input
          type="number"
          name="estimatedValue"
          value={formData.estimatedValue}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Product Name:</span>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Description:</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">
          How many items are you willing to buy?
        </span>
        <input
          type="number"
          min={1}
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Dimensions</h3>

      <label className="block mb-4">
        <span className="text-gray-600">Length in cm:</span>
        <input
          type="number"
          name="dimensions.lengthInCm"
          value={formData.dimensions.lengthInCm}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Width in cm:</span>
        <input
          type="number"
          name="dimensions.widthInCm"
          value={formData.dimensions?.widthInCm}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Height in cm:</span>
        <input
          type="number"
          name="dimensions.heightInCm"
          value={formData.dimensions?.heightInCm}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Delivery Instructions
      </h2>

      <label className="block mb-4">
        <span className="text-gray-600">Special Instructions:</span>
        <textarea
          name="deliveryInstructions"
          value={formData.deliveryInstructions}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Delivery Fee
      </h2>

      <label className="block mb-4">
        <span className="text-gray-600">
          Declare how much you're willing to pay the traveler
        </span>
        <input
          type="number"
          min={0}
          name="initialDeliveryFee"
          value={formData.initialDeliveryFee}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>
    </form>
  );
};

export default ProductForm;
