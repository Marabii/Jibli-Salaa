"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { useTranslations } from "next-intl";

export default function PayButton({
  orderInfo,
}: {
  orderInfo: CompletedOrder;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("BuyerPage.BuyerPay.OrderId.PayButton");

  useEffect(() => {}, []);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await apiClient(
        "/api/protected/payment/create-payment",
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
        alert(t("paymentSessionCreationFailed", { message: response.message }));
      }
    } catch (error) {
      console.error("Error:", error);
      alert(t("paymentError"));
    } finally {
      setLoading(false);
    }
  };

  if (!orderInfo) return <div>{t("loading")}</div>;

  const disabled =
    loading || orderInfo.orderStatus !== ORDER_STATUS.ORDER_FINALIZED;
  return (
    <>
      {orderInfo.orderStatus !== ORDER_STATUS.ORDER_FINALIZED && (
        <p>{t("finalizeNegotiationBeforePay")}</p>
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
        {loading ? t("processing") : t("pay")}
      </button>
    </>
  );
}
