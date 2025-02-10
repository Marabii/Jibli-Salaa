"use client";
import { useTransition } from "react";
import { confirmDeliveryAction } from "./confirmDeliveryAction";

export default function ConfirmDelivery({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelivery = async () => {
    startTransition(async () => {
      try {
        await confirmDeliveryAction(orderId);
      } catch (error) {
        console.error(error);
        alert("Something went wrong, couldn't confirm order");
      }
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <p className="text-black mb-3">
        Please confirm delivery once you receive your product.
      </p>
      <button
        onClick={handleConfirmDelivery}
        disabled={isPending}
        className="inline-flex items-center bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Confirming...
          </>
        ) : (
          "Confirm Delivery"
        )}
      </button>
    </div>
  );
}
