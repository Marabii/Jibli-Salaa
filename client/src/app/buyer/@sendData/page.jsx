"use client";
import { useSelector } from "react-redux";
import apiClient from "@/components/apiClient";

export default function SendData() {
  const buyerOrder = useSelector((state) => state.buyerOrder.value);

  const handleSubmit = async () => {
    try {
      const response = await apiClient(
        "/api/createOrder",
        {
          method: "POST",
          body: JSON.stringify(buyerOrder),
        },
        buyerOrder
      );
      console.log("response: ", response);
    } catch (e) {
      throw new Error(e);
    }
  };

  return <button onClick={handleSubmit}>Send Data</button>;
}
