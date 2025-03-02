"use client";

import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/store/store";
import apiClient from "@/utils/apiClient";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";
import {
  NotificationContent,
  NotificationType,
  OrderAcceptedNotificationContent,
} from "@/interfaces/Websockets/Notification";

import ChatSection from "./components/ChatSection";
import NegotiationPanel from "./components/NegotiationPanel";
import CriticalErrorBanner from "./components/CriticalErrorBanner";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

export default function NegotiatePage(): JSX.Element {
  const t = useTranslations("Negotiate.Page");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const recipientId = searchParams.get("recipientId") || "";
  const IS_PRODUCTION = JSON.parse(
    process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
  );

  // Validate required search parameters
  if (!orderId || !recipientId) {
    throw new Error(t("missingParameters"));
  }

  // --- Local State Definitions ---
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<UserInfo | null>(null);
  const [orderInfo, setOrderInfo] = useState<CompletedOrder | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionEstablished, setConnectionEstablished] = useState(false);

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

  // --- Helper: Fetch User & Recipient Info ---
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userResponse: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );
        setUserInfo(userResponse.data);

        const recipientResponse: ApiResponse<UserInfo> = await apiClient(
          `/api/protected/getUserInfo/${recipientId}`
        );
        setRecipientInfo(recipientResponse.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setCriticalError(t("failedFetchUser"));
      }
    }
    fetchUserInfo();
  }, [recipientId, t]);

  // --- Helper: Fetch Order Info ---
  const fetchOrderInfo = useCallback(async () => {
    if (!orderId) return;
    try {
      const response: ApiResponse<CompletedOrder> = await apiClient(
        `/api/getOrderById/${orderId}`,
        { next: { tags: ["fetchOrderInfoTag"] } }
      );
      if (response?.data) {
        setOrderInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order info:", error);
      setCriticalError(t("failedFetchOrder"));
    }
  }, [orderId, t]);

  // Initial fetch and re-fetch on orderId change
  useEffect(() => {
    fetchOrderInfo();
  }, [fetchOrderInfo, orderId]);

  // --- Refetch Order Info on Notifications ---
  useEffect(() => {
    const orderAcceptedNotification = notifications.find((notif) => {
      if (notif.notificationType !== NotificationType.MESSAGE) {
        return notif.orderId === orderId;
      }
      return false;
    });
    if (orderAcceptedNotification) {
      fetchOrderInfo();
    }
  }, [fetchOrderInfo, notifications, orderId]);

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

  // --- Fetch Chat History ---
  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const result: ApiResponse<ChatMessage[]> = await apiClient(
          `/api/protected/getUserChatHistory/${recipientId}`
        );
        setMessages(result.data || []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setCriticalError(t("failedFetchChat"));
      }
    }
    if (recipientId) {
      fetchChatHistory();
    }
  }, [recipientId, t]);

  // --- Send Message Handler ---
  const sendMessage = (content: string) => {
    if (criticalError || !content.trim() || !connectionEstablished || !userInfo)
      return;

    const chatMessage: Partial<ChatMessage> = {
      orderId,
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
          fetchOrderInfo={fetchOrderInfo}
        />
      </motion.div>
    </>
  );
}
