"use client";

import React, { useEffect, useState } from "react";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import ImgsCarousel from "./ImgsCarousel";
import { ExchangeRate, UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { format } from "currency-formatter";
import LoadingSpinner from "@/components/Loading/LoadingSpinner/LoadingSpinner";
import { useTranslations } from "next-intl";

type OrderDetailsProps = {
  orderInfo: CompletedOrder;
};

export default function OrderDetails({ orderInfo }: OrderDetailsProps) {
  const t = useTranslations("Negotiate.Components.OrderDetails");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfoResponse: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );

        const exchangeRateResponse: ApiResponse<ExchangeRate> = await apiClient(
          `/api/exchange-rate?target=${userInfoResponse.data.userBankCurrency}&source=${orderInfo.currency}`
        );

        setExchangeRate(exchangeRateResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orderInfo]);

  if (loading || !exchangeRate) {
    return <LoadingSpinner />;
  }

  const productValue = orderInfo.actualValue || orderInfo.estimatedValue || 0;
  const deliveryFee =
    orderInfo.actualDeliveryFee || orderInfo.initialDeliveryFee || 0;

  return (
    <div
      dir="auto"
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-3xl shadow-2xl text-white"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center border-b border-gray-600 pb-2">
        {t("orderDetails")}
      </h1>
      <div className="space-y-3 sm:space-y-4 text-sm sm:text-base p-2 sm:p-4 rounded-md">
        {orderInfo.productName && (
          <p>
            <span className="font-bold">{t("product")}</span>{" "}
            {orderInfo.productName}
          </p>
        )}
        {orderInfo.description && (
          <p>
            <span className="font-bold">{t("description")}</span>{" "}
            {orderInfo.description}
          </p>
        )}
        {orderInfo.quantity && (
          <p>
            <span className="font-bold">{t("quantity")}</span>{" "}
            {orderInfo.quantity}
          </p>
        )}
        {productValue > 0 && (
          <p>
            <span className="font-bold">{t("productPrice")}</span>{" "}
            {format(Number((productValue * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </p>
        )}
        {deliveryFee > 0 && (
          <p>
            <span className="font-bold">{t("deliveryFee")}</span>{" "}
            {format(Number((deliveryFee * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </p>
        )}
        {orderInfo.deliveryInstructions && (
          <p>
            <span className="font-bold">{t("deliveryInstructions")}</span>{" "}
            {orderInfo.deliveryInstructions}
          </p>
        )}
        {orderInfo.placedAt && (
          <p>
            <span className="font-bold">{t("orderPlaced")}</span>{" "}
            {new Date(orderInfo.placedAt).toLocaleString()}
          </p>
        )}
        {orderInfo.productURL && (
          <p className="text-blue-400 underline">
            <span className="font-bold">{t("productURL")}</span>{" "}
            <a
              href={orderInfo.productURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("viewProduct")}
            </a>
          </p>
        )}
        {orderInfo.preferredPickupPlace && (
          <p>
            <span className="font-bold">{t("pickupPlace")}</span>{" "}
            {orderInfo.preferredPickupPlace.formatted_address}
          </p>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED && (
          <p className="text-green-400 font-semibold">{t("orderAccepted")}</p>
        )}
        {orderInfo.images && orderInfo.images.length > 0 && (
          <div className="mt-4">
            <strong className="block mb-2">{t("images")}</strong>
            <ImgsCarousel order={orderInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
