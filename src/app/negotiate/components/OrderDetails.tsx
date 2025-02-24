"use client";

import React, { useEffect, useState } from "react";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import ImgsCarousel from "./ImgsCarousel";
import { ExchangeRate, UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { format } from "currency-formatter";

type OrderDetailsProps = {
  orderInfo: CompletedOrder;
};

export default function OrderDetails({ orderInfo }: OrderDetailsProps) {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfoResponse: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );

        const buyerInfoResponse: ApiResponse<UserInfo> = await apiClient(
          `/api/protected/getUserInfo/${orderInfo.buyerId}`
        );

        const exchangeRateResponse: ApiResponse<ExchangeRate> = await apiClient(
          `/api/exchange-rate?target=${userInfoResponse.data.userBankCurrency}&source=${buyerInfoResponse.data.userBankCurrency}`
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
    return <div>Loading...</div>;
  }

  const productValue = orderInfo.actualValue || orderInfo.estimatedValue || 0;
  const deliveryFee =
    orderInfo.actualDeliveryFee || orderInfo.initialDeliveryFee || 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-3xl shadow-2xl text-white">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center border-b border-gray-600 pb-2">
        Order Details
      </h1>
      <div className="space-y-3 sm:space-y-4 text-sm sm:text-base p-2 sm:p-4 rounded-md">
        {orderInfo.productName && (
          <p>
            <span className="font-bold">Product:</span> {orderInfo.productName}
          </p>
        )}
        {orderInfo.description && (
          <p>
            <span className="font-bold">Description:</span>{" "}
            {orderInfo.description}
          </p>
        )}
        {orderInfo.quantity && (
          <p>
            <span className="font-bold">Quantity:</span> {orderInfo.quantity}
          </p>
        )}
        {productValue > 0 && (
          <p>
            <span className="font-bold">Product Price:</span>{" "}
            {format(Number((productValue * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </p>
        )}
        {deliveryFee > 0 && (
          <p>
            <span className="font-bold">Delivery Fee:</span>{" "}
            {format(Number((deliveryFee * exchangeRate.rate).toFixed(2)), {
              code: exchangeRate.target,
            })}
          </p>
        )}
        {orderInfo.deliveryInstructions && (
          <p>
            <span className="font-bold">Delivery Instructions:</span>{" "}
            {orderInfo.deliveryInstructions}
          </p>
        )}
        {orderInfo.placedAt && (
          <p>
            <span className="font-bold">Order Placed:</span>{" "}
            {new Date(orderInfo.placedAt).toLocaleString()}
          </p>
        )}
        {orderInfo.productURL && (
          <p className="text-blue-400 underline">
            <span className="font-bold">Product URL:</span>{" "}
            <a
              href={orderInfo.productURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product
            </a>
          </p>
        )}
        {orderInfo.preferredPickupPlace && (
          <p>
            <span className="font-bold">Pickup Place:</span>{" "}
            {orderInfo.preferredPickupPlace.formatted_address}
          </p>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED && (
          <p className="text-green-400 font-semibold">Order Accepted</p>
        )}
        {orderInfo.images && orderInfo.images.length > 0 && (
          <div className="mt-4">
            <strong className="block mb-2">Images:</strong>
            <ImgsCarousel order={orderInfo} />
          </div>
        )}
      </div>
    </div>
  );
}
