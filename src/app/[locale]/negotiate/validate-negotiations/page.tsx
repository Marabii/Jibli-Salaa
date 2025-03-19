"use client";

import React, { useEffect, useState } from "react";
import { ExchangeRate, UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { useSearchParams } from "next/navigation";
import Tetromino from "@/components/Loading/Tetromino/Tetromino";
import { useRouter } from "next/navigation";
import { format } from "currency-formatter";
import { useTranslations } from "next-intl";

// A simple inline spinner for button actions.
const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 inline-block"
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
);

const ValidateNegotiations: React.FC = () => {
  const t = useTranslations("Negotiate.ValidateNegotiations");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [orderInfo, setOrderInfo] = useState<CompletedOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<
    "accept" | "reject" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfoResponse = (await apiClient(
          "/api/protected/getUserInfo"
        )) as ApiResponse<UserInfo>;
        setUserInfo(userInfoResponse.data);
      } catch (err) {
        console.error("Error fetching user information:", err);
        setError(t("errorUserInfo"));
      }

      try {
        const orderInfoResponse = (await apiClient(
          `/api/getOrderById/${orderId}`
        )) as ApiResponse<CompletedOrder>;
        setOrderInfo(orderInfoResponse.data);
      } catch (err) {
        console.error("Error fetching order information:", err);
        setError(t("errorOrderInfo"));
      }
      setLoading(false);
    }
    fetchData();
  }, [orderId, t]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const exchangeRateResponse: ApiResponse<ExchangeRate> = await apiClient(
        `/api/exchange-rate?target=${userInfo?.userBankCurrency}&source=${orderInfo?.currency}`
      );
      setExchangeRate(exchangeRateResponse.data);
    };

    if (orderInfo) fetchExchangeRate();
  }, [orderInfo, userInfo?.userBankCurrency]);

  // Use the Tetromino spinner for initial page loading.
  if (loading) return <Tetromino />;

  if (
    error ||
    !orderInfo ||
    orderInfo.orderStatus !== ORDER_STATUS.NEGOTIATION_PENDING ||
    orderInfo.travelerId !== userInfo?._id
  ) {
    throw new Error(error || "You are not authorized to visit this page.");
  }

  const acceptNegotiation = async () => {
    setActionLoading("accept");
    try {
      await apiClient(`/api/protected/accept-negotiations?orderId=${orderId}`, {
        method: "PUT",
      });
      setSuccessMessage(t("successAccepted"));
      setError(null);
      router.replace(`/negotiate?orderId=${orderId}`);
    } catch (err) {
      console.error("Error accepting negotiation:", err);
      setError(t("errorAccept"));
      setActionLoading(null);
    }
  };

  const rejectNegotiation = async () => {
    setActionLoading("reject");
    try {
      await apiClient(`/api/protected/reject-negotiations?orderId=${orderId}`, {
        method: "PUT",
      });
      setSuccessMessage(t("successRejected"));
      setError(null);
      router.replace(`/negotiate?orderId=${orderId}`);
    } catch (err) {
      console.error("Error rejecting negotiation:", err);
      setError(t("errorReject"));
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-black text-white px-6 py-4">
          <h2 className="text-center text-2xl font-semibold">
            {t("confirmNegotiatedDetails")}
          </h2>
        </div>
        <div className="px-6 py-8">
          {exchangeRate && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">
                  {t("productValue")}
                </span>
                <span className="text-gray-900 font-semibold">
                  {format(
                    Number(
                      (orderInfo.actualValue * exchangeRate.rate).toFixed(2)
                    ),
                    { code: exchangeRate.target }
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  {t("deliveryFee")}
                </span>
                <span className="text-gray-900 font-semibold">
                  {format(
                    Number(
                      (orderInfo.actualDeliveryFee * exchangeRate.rate).toFixed(
                        2
                      )
                    ),
                    { code: exchangeRate.target }
                  )}
                </span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 border border-green-400 text-green-700 text-center">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={acceptNegotiation}
              disabled={!!actionLoading}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${
                actionLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {actionLoading === "accept" ? (
                <>
                  <Spinner /> {t("processing")}
                </>
              ) : (
                t("accept")
              )}
            </button>
            <button
              onClick={rejectNegotiation}
              disabled={!!actionLoading}
              className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${
                actionLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {actionLoading === "reject" ? (
                <>
                  <Spinner /> {t("processing")}
                </>
              ) : (
                t("requestRenegotiation")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidateNegotiations;
