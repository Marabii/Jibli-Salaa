"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBuyerOrder } from "@/store/BuyerOrderSlice/slice";

const BuyerOrderForm = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.buyerOrder.value);

  const [formData, setFormData] = useState(order);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    // Create a deep copy of formData to avoid mutating the state directly
    const updatedFormData = { ...formData };
    let nestedObject = updatedFormData;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        nestedObject[key] = value; // Set the final key to the value
      } else {
        nestedObject[key] = { ...nestedObject[key] }; // Copy the nested object
        nestedObject = nestedObject[key];
      }
    });

    setFormData(updatedFormData);
    dispatch(setBuyerOrder(updatedFormData));
  };

  useEffect(() => {
    console.log(order);
  }, [order]);

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Product Details
      </h2>

      <label className="block mb-4">
        <span className="text-gray-600">Product URL: (Unnecessary)</span>
        <input
          type="text"
          name="product.productURL"
          value={formData.product.productURL}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Value:</span>
        <input
          type="number"
          name="product.value"
          value={formData.product.value}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Name:</span>
        <input
          type="text"
          name="product.name"
          value={formData.product.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Description:</span>
        <textarea
          name="product.description"
          value={formData.product.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Weight:</span>
        <input
          type="number"
          name="product.weight"
          value={formData.product.weight}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">
          how many items are you willing to buy?
        </span>
        <input
          type="number"
          min={1}
          name="quantity"
          value={formData.product.quantity}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Dimensions</h3>

      <label className="block mb-4">
        <span className="text-gray-600">Length:</span>
        <input
          type="number"
          name="product.dimensions.length"
          value={formData.product.dimensions.length}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Width:</span>
        <input
          type="number"
          name="product.dimensions.width"
          value={formData.product.dimensions.width}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-600">Height:</span>
        <input
          type="number"
          name="product.dimensions.height"
          value={formData.product.dimensions.height}
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
          name="deliveryFee"
          value={formData.deliveryFee}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </label>
    </form>
  );
};

export default BuyerOrderForm;
