"use client";

import React, { type JSX } from "react";
import { motion } from "framer-motion";

import NegotiationForm from "./NegotiationForm";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ORDER_STATUS } from "@/interfaces/Order/ORDER_STATUS";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ROLE } from "@/interfaces/userInfo/userRole";
import Link from "next/link";

type NegotiationControlsProps = {
  userInfo: UserInfo | null;
  recipientInfo: UserInfo | null;
  orderInfo: CompletedOrder | null;
  handleAcceptOrder: (orderId: string) => Promise<void>;
};

export default function NegotiationControls({
  userInfo,
  recipientInfo,
  orderInfo,
  handleAcceptOrder,
}: NegotiationControlsProps): JSX.Element | null {
  if (!userInfo || !recipientInfo || !orderInfo) return null;

  const showTravelerPanel =
    (userInfo.role === ROLE.TRAVELER ||
      userInfo.role === ROLE.TRAVELER_AND_BUYER) &&
    recipientInfo._id === orderInfo.buyerId &&
    (orderInfo.orderStatus === ORDER_STATUS.PENDING ||
      orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED);

  const isUserBuyer =
    userInfo.role === ROLE.BUYER ||
    (userInfo.role === ROLE.TRAVELER_AND_BUYER &&
      userInfo._id === orderInfo.buyerId);

  // -- Traveler's UI
  if (showTravelerPanel) {
    return (
      <motion.div
        className="bg-white p-4 rounded shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {orderInfo.orderStatus === ORDER_STATUS.PENDING && (
          <p className="text-center text-lg mb-2">
            You have <span className="font-semibold">NOT ACCEPTED</span> the
            order yet.
          </p>
        )}

        {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED && (
          <div className="mt-2">
            <h2 className="text-xl font-bold text-green-400">
              The order is finalized! Once you deliver, you can receive payment.
            </h2>
          </div>
        )}

        {/* If the order is not accepted yet */}
        {orderInfo.orderStatus === ORDER_STATUS.PENDING && (
          <div className="mt-4 bg-gray-300 p-4 rounded">
            <h2 className="text-md font-semibold mb-2">
              You must accept the order before proceeding.
            </h2>
            <button
              className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors"
              onClick={() => handleAcceptOrder(orderInfo._id as string)}
            >
              Accept Order
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // -- Buyer's UI
  if (isUserBuyer) {
    return (
      <motion.div
        className="bg-gray-300 p-4 rounded shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl text-center font-bold mb-3">
          Negotiate & Finalize
        </h2>
        {orderInfo.orderStatus !== ORDER_STATUS.PENDING ? (
          <>
            {orderInfo.orderStatus === ORDER_STATUS.ORDER_FINALIZED ? (
              // Order is finalized
              <div className="mt-2 text-center">
                <h2 className="text-xl font-bold text-green-400 mb-2">
                  The order is finalized!
                </h2>
                <Link
                  href={`/buyer/buyer-pay/${orderInfo._id}`}
                  className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors inline-block"
                >
                  Proceed to Payment
                </Link>
              </div>
            ) : orderInfo.orderStatus === ORDER_STATUS.ORDER_ACCEPTED ? (
              // Order accepted but not finalized
              <div className="mt-2">
                <h2 className="text-md font-semibold">
                  Finalize the order before paying.
                </h2>
                <p className="text-sm mb-4">
                  Confirm the product&apos;s cost and delivery fee with the
                  traveler. Then finalize.
                </p>
                <NegotiationForm orderId={orderInfo._id as string} />
              </div>
            ) : null}
          </>
        ) : (
          <h2 className="text-red-400 text-md font-semibold">
            The traveler must accept the order first.
          </h2>
        )}
      </motion.div>
    );
  }

  return null;
}
