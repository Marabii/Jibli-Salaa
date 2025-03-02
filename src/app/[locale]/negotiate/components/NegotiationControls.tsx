"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import NegotiationForm from "./NegotiationForm/NegotiationForm";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { useTranslations } from "next-intl";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

interface NegotiationControlsProps {
  userInfo: UserInfo | null;
  recipientInfo: UserInfo | null;
  orderInfo: CompletedOrder | null;
  onSuccess: () => void;
}

interface CreateAccountLinkResponse {
  url: string;
}

export default function NegotiationControls({
  userInfo,
  recipientInfo,
  orderInfo,
  onSuccess,
}: NegotiationControlsProps) {
  const t = useTranslations("Negotiate.Components.NegotiationControls");
  const [isLoading, setIsLoading] = useState(false);

  // --- Traveler Accept Order Handler ---
  const handleAcceptOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const result: ApiResponse<boolean> = await apiClient(
        "/api/protected/payment/is-onboarding-complete"
      );
      if (result.data) {
        await apiClient(`/api/protected/acceptOrder/${orderId}`, {
          method: "PUT",
        });
        onSuccess();
      } else {
        result.errors && toast.error(result.errors.join("\n"));
        await apiClient("/api/protected/payment/account", { method: "POST" });
        const createAccountLinkResult: ApiResponse<CreateAccountLinkResponse> =
          await apiClient("/api/protected/payment/account_link", {
            method: "POST",
            body: JSON.stringify({ prevUrl: window.location.href }),
          });
        toast.info(t("stripeRedirect"));
        window.location.href = createAccountLinkResult.data.url;
      }
    } catch (error) {
      console.error("Cannot accept order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo || !recipientInfo || !orderInfo) return null;

  // Determine which panel to show based on user role and order status
  const isBuyer = userInfo._id === orderInfo.buyerId;
  const isTraveler = !isBuyer;

  const showTravelerPanel =
    isTraveler &&
    (orderInfo.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING ||
      orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED ||
      orderInfo.orderStatus === ORDER_STATUS.PENDING ||
      orderInfo.orderStatus === ORDER_STATUS.PRICE_FROZEN);

  const showBuyerPanel = isBuyer;

  // --- Traveler Panel ---
  if (showTravelerPanel) {
    return (
      <motion.div
        className="bg-gradient-to-br from-purple-700 to-blue-600 p-4 sm:p-8 rounded-3xl shadow-2xl text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {orderInfo.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("negotiationInProgress")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("negotiationDetailsPrompt.start")}{" "}
              <Link
                href={`/negotiate/validate-negotiations?orderId=${orderInfo._id}`}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 italic underline sm:mt-3 text-base sm:text-lg"
              >
                {t("here")}
              </Link>{" "}
              {t("negotiationDetailsPrompt.end")}
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("orderFinalized")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("orderFinalizedInfo")}
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.PRICE_FROZEN && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {t("buyerPaid")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("deliverProduct")}
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.PENDING && (
          <div className="mt-4 bg-white bg-opacity-20 p-4 sm:p-6 rounded-xl">
            <p className="text-center text-xl sm:text-2xl mb-3 font-bold">
              {t("pendingAcceptance")}
            </p>
            <p className="text-center text-base sm:text-lg mb-6">
              {t("notAccepted")}
            </p>
            <div className="flex justify-center">
              <button
                disabled={isLoading}
                className="bg-white text-black py-2 sm:py-3 px-4 sm:px-8 rounded-full hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center"
                onClick={() => handleAcceptOrder(orderInfo._id as string)}
              >
                {isLoading && <FaSpinner className="animate-spin mr-2" />}
                {t("acceptOrder")}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // --- Buyer Panel ---
  if (showBuyerPanel) {
    return (
      <motion.div
        className="bg-gradient-to-br from-pink-500 to-orange-500 p-4 md:p-6 rounded-3xl shadow-2xl text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl text-center font-extrabold mb-4 sm:mb-6">
          {t("negotiateAndFinalize")}
        </h2>
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED ? (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-green-200 mb-4">
              {t("orderFinalized")}
            </h2>
            <Link
              href={`/buyer/buyer-pay/${orderInfo._id}`}
              className="inline-block bg-white text-black py-2 sm:py-3 px-4 sm:px-8 rounded-full hover:bg-gray-200 transition-colors font-semibold"
            >
              {t("proceedToPayment")}
            </Link>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED ? (
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              {t("finalizeOrder")}
            </h2>
            <p className="text-base sm:text-lg mb-6">
              {t("finalizeOrderPrompt")}
            </p>
            <NegotiationForm
              onSuccess={onSuccess}
              orderId={orderInfo._id as string}
            />
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              {t("awaitingTravelerConfirmation")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("travelerReviewing")}
            </p>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.PENDING ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              {t("pendingTravelerAcceptance")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("travelerAcceptanceNeeded")}
            </p>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.FUNDS_TRANSFERRED ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              {t("fundsTransferred")}
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              {t("signupTraveler")}
            </p>
          </div>
        ) : null}
      </motion.div>
    );
  }

  return null;
}
