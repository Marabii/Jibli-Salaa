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
  NotificationType,
  OrderAcceptedNotificationContent,
} from "@/interfaces/Websockets/Notification";

import ChatSection from "./components/ChatSection";
import NegotiationPanel from "./components/NegotiationPanel";
import CriticalErrorBanner from "./components/CriticalErrorBanner";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

interface CreateAccountLinkResponse {
  url: string;
}

export default function NegotiatePage(): JSX.Element {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const recipientId = searchParams.get("recipientId") || "";
  const IS_PRODUCTION = JSON.parse(
    process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
  );

  // Validate required search parameters
  if (!orderId || !recipientId) {
    throw new Error("Missing required parameters: recipientId or orderId");
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
        setCriticalError(
          "Failed to fetch user information. Please try again later."
        );
      }
    }
    fetchUserInfo();
  }, [recipientId]);

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
      setCriticalError(
        "Failed to fetch order details. Please try again later."
      );
    }
  }, [orderId]);

  // Initial fetch and re-fetch on orderId change
  useEffect(() => {
    fetchOrderInfo();
  }, [fetchOrderInfo, orderId]);

  // --- Refetch Order Info on Notifications ---
  useEffect(() => {
    const orderAcceptedNotification = notifications.find((notif) => {
      if (notif.notificationType !== NotificationType.MESSAGE) {
        const notifData =
          notif.notificationData as OrderAcceptedNotificationContent;
        return notifData.orderId === orderId;
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
          setCriticalError(
            "Critical error connecting to chat. Please wait; page will refresh."
          );
        }
      );
    }
  }, [userInfo, connectionEstablished, IS_PRODUCTION]);

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
        setCriticalError(
          "Failed to fetch chat history. Please try again later."
        );
      }
    }
    if (recipientId) {
      fetchChatHistory();
    }
  }, [recipientId]);

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

  // --- Traveler Accept Order Handler ---
  const handleAcceptOrder = async (orderId: string) => {
    try {
      const result: ApiResponse<boolean> = await apiClient(
        "/api/protected/payment/is-onboarding-complete"
      );
      if (result.data) {
        await apiClient(`/api/protected/acceptOrder/${orderId}`, {
          method: "PUT",
        });
        fetchOrderInfo();
      } else {
        result.errors && toast.error(result.errors.join("\n"));
        await apiClient("/api/protected/payment/account", { method: "POST" });
        const createAccountLinkResult: ApiResponse<CreateAccountLinkResponse> =
          await apiClient("/api/protected/payment/account_link", {
            method: "POST",
            body: JSON.stringify({ prevUrl: window.location.href }),
          });
        toast.info("Taking you to Stripe page");
        window.location.href = createAccountLinkResult.data.url;
      }
    } catch (error) {
      console.error("Cannot accept order:", error);
    }
  };

  // Avoid self-chat
  if (recipientId === userInfo?._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-semibold mb-4">
          It looks like you&apos;re trying to chat with yourself.
        </h1>
        <p className="mb-6">Please go back and select a valid chat partner.</p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go Back
        </button>
      </div>
    );
  }

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
          handleAcceptOrder={handleAcceptOrder}
          fetchOrderInfo={fetchOrderInfo}
        />
      </motion.div>
    </>
  );
}
