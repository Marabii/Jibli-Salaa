"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import apiClient from "@/utils/apiClient";

type NegotiationFormProps = {
  orderId: string;
};

export default function NegotiationForm({ orderId }: NegotiationFormProps) {
  const [formData, setFormData] = useState({
    actualValue: "",
    actualDeliveryFee: "",
    orderId: "",
  });
  const router = useRouter();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orderId,
    }));
  }, [orderId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      await apiClient("/api/protected/finalizeNegotiation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push(`/buyer/buyer-pay/${orderId}`);
    } catch (error) {
      console.error("Error finalizing negotiation:", error);
      alert("Error finalizing negotiation. Please try again.");
    }
  };

  return (
    <motion.form
      className="flex flex-col space-y-3 bg-white p-4 rounded shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <label
          htmlFor="actual-value"
          className="block text-sm font-medium mb-1"
        >
          Product&apos;s Actual Value
        </label>
        <input
          type="number"
          id="actual-value"
          name="actualValue"
          value={formData.actualValue}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white outline-none"
          placeholder="e.g. 99.99"
        />
      </div>

      <div>
        <label
          htmlFor="actual-delivery-fee"
          className="block text-sm font-medium mb-1"
        >
          Agreed Delivery Fee
        </label>
        <input
          type="number"
          id="actual-delivery-fee"
          name="actualDeliveryFee"
          value={formData.actualDeliveryFee}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white outline-none"
          placeholder="e.g. 20.00"
        />
      </div>

      <button
        type="submit"
        className="mt-3 bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
      >
        Finalize Negotiation
      </button>
    </motion.form>
  );
}
