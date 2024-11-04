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
  estimatedValue: 10,
  initialDeliveryFee: 5,
  deliveryInstructions: "",
  actualDeliveryFee: 0,
  actualValue: 0,
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
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const dispatch = useAppDispatch();

  // Validation function
  const validate = (name: string, value: any) => {
    let errors = { ...validationErrors };
    const regexProductName = /^[a-zA-Z0-9\s.,'-]{3,100}$/;
    const regexDescription = /^[a-zA-Z0-9\s.,'"-]{10,1000}$/;
    const regexDeliveryInstructions = /^[a-zA-Z0-9\s.,'"-]{10,1000}$/;

    switch (name) {
      case "productURL":
        if (value && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
          errors.productURL = "Please enter a valid URL.";
        } else {
          delete errors.productURL;
        }
        break;
      case "estimatedValue":
        if (!value || value <= 10) {
          errors.estimatedValue = "Estimated value must be more than 10.";
        } else {
          delete errors.estimatedValue;
        }
        break;
      case "productName":
        if (!value || !regexProductName.test(value)) {
          errors.productName =
            "Product name is required, 3-100 characters, and may contain letters, numbers, spaces, and . , ' -";
        } else {
          delete errors.productName;
        }
        break;
      case "description":
        if (!value || !regexDescription.test(value)) {
          errors.description =
            "Description is required, 10-1000 characters, and may contain letters, numbers, spaces, and . , ' \" -";
        } else {
          delete errors.description;
        }
        break;
      case "quantity":
        if (value < 1) {
          errors.quantity = "Quantity must be at least 1.";
        } else {
          delete errors.quantity;
        }
        break;
      case "dimensions.lengthInCm":
      case "dimensions.widthInCm":
      case "dimensions.heightInCm":
        if (value <= 0) {
          errors[name] = "Dimension must be a positive number.";
        } else {
          delete errors[name];
        }
        break;
      case "deliveryInstructions":
        if (value && !regexDeliveryInstructions.test(value)) {
          errors.deliveryInstructions =
            "Delivery instructions must be 10-1000 characters and may contain letters, numbers, spaces, and . , ' \" -";
        } else {
          delete errors.deliveryInstructions;
        }
        break;
      case "initialDeliveryFee":
        if (value <= 5) {
          errors.initialDeliveryFee = "Delivery fee must be larger than 5.";
        } else {
          delete errors.initialDeliveryFee;
        }
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  // Handle change event for input fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("dimensions.")) {
      const dimensionKey = name.split(".")[1];
      const newValue = Number(value);
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionKey]: newValue,
        },
      }));
      validate(name, newValue);
    } else if (name.startsWith("preferredPickupPlace.")) {
      const placeKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferredPickupPlace: {
          ...prev.preferredPickupPlace,
          [placeKey]: value,
        },
      }));
    } else {
      const newValue =
        name === "estimatedValue" ||
        name === "quantity" ||
        name === "initialDeliveryFee"
          ? Number(value)
          : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
      validate(name, newValue);
    }
  };

  useEffect(() => {
    dispatch(setBuyerOrder(formData));
  }, [formData, dispatch]);

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
          value={formData.productURL || ""}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.productURL ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.productURL && (
          <p className="text-red-500 text-sm">{validationErrors.productURL}</p>
        )}
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Estimated Value:</span>
        <input
          type="number"
          name="estimatedValue"
          value={formData.estimatedValue || 10}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.estimatedValue
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.estimatedValue && (
          <p className="text-red-500 text-sm">
            {validationErrors.estimatedValue}
          </p>
        )}
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Product Name:</span>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.productName ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.productName && (
          <p className="text-red-500 text-sm">{validationErrors.productName}</p>
        )}
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Description:</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.description ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.description && (
          <p className="text-red-500 text-sm">{validationErrors.description}</p>
        )}
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
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.quantity ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.quantity && (
          <p className="text-red-500 text-sm">{validationErrors.quantity}</p>
        )}
      </label>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Dimensions</h3>

      <label className="block mb-4">
        <span className="text-gray-600">Length in cm:</span>
        <input
          type="number"
          name="dimensions.lengthInCm"
          value={formData.dimensions.lengthInCm}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors["dimensions.lengthInCm"]
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors["dimensions.lengthInCm"] && (
          <p className="text-red-500 text-sm">
            {validationErrors["dimensions.lengthInCm"]}
          </p>
        )}
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Width in cm:</span>
        <input
          type="number"
          name="dimensions.widthInCm"
          value={formData.dimensions.widthInCm}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors["dimensions.widthInCm"]
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors["dimensions.widthInCm"] && (
          <p className="text-red-500 text-sm">
            {validationErrors["dimensions.widthInCm"]}
          </p>
        )}
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Height in cm:</span>
        <input
          type="number"
          name="dimensions.heightInCm"
          value={formData.dimensions.heightInCm}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors["dimensions.heightInCm"]
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors["dimensions.heightInCm"] && (
          <p className="text-red-500 text-sm">
            {validationErrors["dimensions.heightInCm"]}
          </p>
        )}
      </label>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Delivery Instructions
      </h2>

      <label className="block mb-4">
        <span className="text-gray-600">Special Instructions:</span>
        <textarea
          name="deliveryInstructions"
          value={formData.deliveryInstructions || ""}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.deliveryInstructions
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.deliveryInstructions && (
          <p className="text-red-500 text-sm">
            {validationErrors.deliveryInstructions}
          </p>
        )}
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
          name="initialDeliveryFee"
          value={formData.initialDeliveryFee || 5}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            validationErrors.initialDeliveryFee
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200`}
        />
        {validationErrors.initialDeliveryFee && (
          <p className="text-red-500 text-sm">
            {validationErrors.initialDeliveryFee}
          </p>
        )}
      </label>
    </form>
  );
};

export default ProductForm;
