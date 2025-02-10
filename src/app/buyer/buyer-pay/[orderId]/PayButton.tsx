"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";

export default function PayButton({
  orderInfo,
}: {
  orderInfo: CompletedOrder;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {});
  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await apiClient(
        "/api/protected/v1/stripe/create-payment",
        {
          method: "POST",
          body: JSON.stringify({
            orderId: orderInfo._id,
            successUrl: `${process.env.NEXT_PUBLIC_CLIENTURL}/buyer/buyer-pay/success`,
            cancelUrl: `${process.env.NEXT_PUBLIC_CLIENTURL}/buyer/buyer-pay/error`,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === "SUCCESS") {
        router.push(response.data.sessionUrl);
      } else {
        alert(`Payment session creation failed: ${response.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderInfo) return <div>Loading</div>;

  const disabled =
    loading || orderInfo.orderStatus !== ORDER_STATUS.ORDER_FINALIZED;
  return (
    <>
      {orderInfo.orderStatus !== ORDER_STATUS.ORDER_FINALIZED && (
        <p>
          Finalize the negotiation terms with the traveler before paying for the
          product
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={disabled}
        className={`w-full transition-all duration-300 bg-black text-white py-5 rounded-lg font-semibold ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white hover:text-black"
        }`}
      >
        {loading ? "Processing..." : "PAY"}
      </button>
    </>
  );
}
