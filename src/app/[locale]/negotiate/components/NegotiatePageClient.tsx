"use client";

import { useEffect, useState, useRef, type JSX } from "react";
import { motion } from "framer-motion";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/store/store";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";
import { NotificationType } from "@/interfaces/Websockets/Notification";

import ChatSection from "./ChatSection";
import NegotiationPanel from "./NegotiationPanel";
import CriticalErrorBanner from "./CriticalErrorBanner";
import { useTranslations } from "next-intl";
import revalidateOrderAction from "../utils/revalidateOrderAction";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};
export default function NegotiatePageClient({
  userInfo,
  recipientInfo,
  orderInfo,
  chatHistory,
}: {
  userInfo: UserInfo;
  recipientInfo: UserInfo;
  orderInfo: CompletedOrder;
  chatHistory: ChatMessage[];
}): JSX.Element {
  const t = useTranslations("Negotiate.Page");
  const IS_PRODUCTION = JSON.parse(
    process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  //Load Chat History
  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  // Critical error & auto-refresh states
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    Math.ceil(refreshInterval / 1000)
  );

  const stompClientRef = useRef<Client | null>(null);

  // --- Redux Notifications ---
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  // --- Toast & Refresh Handler ---
  useEffect(() => {
    if (criticalError) {
      toast.error(criticalError, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "critical-error",
      });

      const reloadTimer = setTimeout(() => {
        window.location.reload();
        setRefreshInterval((prev) => prev * 2); // Double the interval after each attempt
      }, refreshInterval);

      return () => clearTimeout(reloadTimer);
    }
  }, [criticalError, refreshInterval]);

  // --- Countdown Timer for Refresh ---
  useEffect(() => {
    if (criticalError) {
      setSecondsLeft(Math.ceil(refreshInterval / 1000));
      const countdownTimer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [criticalError, refreshInterval]);

  // --- Refetch Order Info on Notifications ---
  useEffect(() => {
    const orderAcceptedNotification = notifications.find((notif) => {
      if (notif.notificationType !== NotificationType.MESSAGE) {
        return notif.orderId === orderInfo._id;
      }
      return false;
    });
    if (orderAcceptedNotification) {
      revalidateOrderAction();
    }
  }, [notifications, orderInfo._id]);

  // --- Initialize and Connect WebSocket (SockJS + STOMP) ---
  useEffect(() => {
    if (userInfo && !stompClientRef.current) {
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_SERVERURL}/${IS_PRODUCTION ? "wss" : "ws"}`
      );
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;
      stompClient.debug = () => {};
      stompClient.connect(
        {},
        () => {
          setConnectionEstablished(true);
          // Subscribe to user-specific queue
          stompClient.subscribe(
            `/user/${userInfo._id}/queue/messages`,
            (message) => {
              const receivedMessage: ChatMessage = JSON.parse(message.body);
              setMessages((prev) => [...prev, receivedMessage]);
            }
          );
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          setCriticalError(t("chatConnectionError"));
        }
      );
    }
  }, [userInfo, connectionEstablished, IS_PRODUCTION, t]);

  // --- Send Message Handler ---
  const sendMessage = (content: string) => {
    if (criticalError || !content.trim() || !connectionEstablished || !userInfo)
      return;

    const recipientId = recipientInfo._id;
    const chatMessage: Partial<ChatMessage> = {
      orderId: orderInfo._id!,
      recipientId,
      senderId: userInfo._id,
      content,
      timestamp: new Date(),
    };

    stompClientRef.current?.send("/app/chat", {}, JSON.stringify(chatMessage));
    setMessages((prev) => [...prev, chatMessage as ChatMessage]);
  };

  return (
    <>
      {/* Critical Error Banner (if any) */}
      <CriticalErrorBanner
        criticalError={criticalError}
        secondsLeft={secondsLeft}
      />

      <motion.div
        className="bg-gray-50 mt-10 pt-12 text-gray-800 flex flex-col xl:flex-row"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* --- Left Panel: Chat Section --- */}
        <ChatSection
          messages={messages}
          userInfoId={userInfo?._id}
          recipientName={recipientInfo?.name}
          criticalError={criticalError}
          onSendMessage={sendMessage}
        />

        {/* --- Right Panel: Negotiation & Order Details --- */}
        <NegotiationPanel
          userInfo={userInfo}
          recipientInfo={recipientInfo}
          orderInfo={orderInfo}
        />
      </motion.div>
    </>
  );
}
