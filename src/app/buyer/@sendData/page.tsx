"use client";
import { BuyerOrderState } from "@/interfaces/Order/order";
import { useAppSelector } from "@/store/hooks";
import apiClient from "@/utils/apiClient";

export default function SendData() {
  const buyerOrder = useAppSelector(
    (state: {
      buyerOrder: {
        value: Omit<
          BuyerOrderState["value"],
          "buyerId" | "placedAt" | "isOrdeAccepted" | "orderStatus"
        >;
      };
    }) => state.buyerOrder.value
  );

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await apiClient("/api/protected/postOrder", {
        method: "POST",
        body: JSON.stringify(buyerOrder),
      });
      console.log("response: ", response);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  return <button onClick={handleSubmit}>Send Data</button>;
}
