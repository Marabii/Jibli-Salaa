"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import NegotiationForm from "./NegotiationForm/NegotiationForm";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { UserInfo } from "@/interfaces/userInfo/userInfo";

type NegotiationControlsProps = {
  userInfo: UserInfo | null;
  recipientInfo: UserInfo | null;
  orderInfo: CompletedOrder | null;
  handleAcceptOrder: (orderId: string) => Promise<void>;
  onSuccess: () => void;
};

export default function NegotiationControls({
  userInfo,
  recipientInfo,
  orderInfo,
  handleAcceptOrder,
  onSuccess,
}: NegotiationControlsProps) {
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
              Negotiation in Progress
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              click{" "}
              <Link
                href={`/negotiate/validate-negotiations?orderId=${orderInfo._id}`}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 italic underline sm:mt-3 text-base sm:text-lg"
              >
                here
              </Link>{" "}
              to review negotiation details and either accept or reject them
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Order Finalized!
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              The order has been finalized. Sit tight while the buyer processes
              the payment.
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.PRICE_FROZEN && (
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              The buyer has paid for the product!
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              You can now commence your trip and deliver the product.
            </p>
          </div>
        )}
        {orderInfo.orderStatus === ORDER_STATUS.PENDING && (
          <div className="mt-4 bg-white bg-opacity-20 p-4 sm:p-6 rounded-xl">
            <p className="text-center text-xl sm:text-2xl mb-3 font-bold">
              Pending Acceptance
            </p>
            <p className="text-center text-base sm:text-lg mb-6">
              You have <span className="font-semibold">NOT ACCEPTED</span> the
              order yet.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-white text-black py-2 sm:py-3 px-4 sm:px-8 rounded-full hover:bg-gray-200 transition-colors font-semibold"
                onClick={() => handleAcceptOrder(orderInfo._id as string)}
              >
                Accept Order
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
          Negotiate & Finalize
        </h2>
        {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED ? (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-green-200 mb-4">
              Order Finalized!
            </h2>
            <Link
              href={`/buyer/buyer-pay/${orderInfo._id}`}
              className="inline-block bg-white text-black py-2 sm:py-3 px-4 sm:px-8 rounded-full hover:bg-gray-200 transition-colors font-semibold"
            >
              Proceed to Payment
            </Link>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED ? (
          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Finalize the Order
            </h2>
            <p className="text-base sm:text-lg mb-6">
              Confirm the product&apos;s cost and delivery fee with the
              traveler, then finalize the order.
            </p>
            <NegotiationForm
              onSuccess={onSuccess}
              orderId={orderInfo._id as string}
            />
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.NEGOTIATION_PENDING ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              Awaiting Traveler Confirmation
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              The traveler is reviewing the negotiation details.
            </p>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.PENDING ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              Pending Traveler Acceptance
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              The traveler must accept the order before negotiation can begin.
            </p>
          </div>
        ) : orderInfo.orderStatus === ORDER_STATUS.FUNDS_TRANSFERRED ? (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-2">
              Funds were transferred to the traveler
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg">
              Sign up as a traveler to make some money.
            </p>
          </div>
        ) : null}
      </motion.div>
    );
  }

  return null;
}
