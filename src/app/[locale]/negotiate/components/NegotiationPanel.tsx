"use client";

import { motion } from "framer-motion";
import NegotiationControls from "./NegotiationControls";
import OrderDetails from "./OrderDetails";

import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { CompletedOrder } from "@/interfaces/Order/order";
import revalidateOrderAction from "../utils/revalidateOrderAction";

interface NegotiationPanelProps {
  userInfo: UserInfo | null;
  recipientInfo: UserInfo | null;
  orderInfo: CompletedOrder | null;
}

export default function NegotiationPanel({
  userInfo,
  recipientInfo,
  orderInfo,
}: NegotiationPanelProps) {
  return (
    <motion.div
      className="w-full xl:w-1/3 flex flex-col p-4 xl:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <NegotiationControls
        userInfo={userInfo}
        recipientInfo={recipientInfo}
        orderInfo={orderInfo}
        onSuccess={revalidateOrderAction}
      />

      {orderInfo && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OrderDetails orderInfo={orderInfo} />
        </motion.div>
      )}
    </motion.div>
  );
}
