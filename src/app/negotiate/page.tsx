"use client";

import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/store/store";
import apiClient from "@/utils/apiClient";
import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import { CompletedOrder } from "@/interfaces/Order/order";

import NegotiationControls from "./components/NegotiationControls";
import OrderDetails from "./components/OrderDetails";
import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";
import {
  NotificationType,
  OrderAcceptedNotificationContent,
} from "@/interfaces/Websockets/Notification";

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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

  // States for critical error handling
  const [criticalError, setCriticalError] = useState<string | null>(null);
  // refreshInterval is in milliseconds; initially set to 5000ms (5 seconds)
  const [refreshInterval, setRefreshInterval] = useState(5000);
  // This state holds the countdown (in seconds) until refresh.
  const [secondsLeft, setSecondsLeft] = useState<number>(
    Math.ceil(refreshInterval / 1000)
  );

  const chatRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // --- Redux Notifications ---
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  // --- Toast & Refresh Handler ---
  useEffect(() => {
    if (criticalError) {
      // Show the critical error toast (won't auto-close)
      toast.error(criticalError, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "critical-error",
      });

      // Set a timeout to reload the page after refreshInterval milliseconds.
      const reloadTimer = setTimeout(() => {
        window.location.reload();
        // If the page state were to be maintained across refreshes,
        // you could double the interval:
        setRefreshInterval((prev) => prev * 2);
      }, refreshInterval);

      return () => clearTimeout(reloadTimer);
    }
  }, [criticalError, refreshInterval]);

  // --- Countdown Timer for Refresh ---
  useEffect(() => {
    if (criticalError) {
      // Reset the countdown based on refreshInterval
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
    async function fetchUserInfos() {
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
    fetchUserInfos();
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
          // Subscribe to the user-specific message queue
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
            "Critical error connecting to chat. Please wait, the page will refresh automatically."
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

  // --- Auto-scroll Chat on New Message ---
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

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
      await apiClient(`/api/protected/acceptOrder/${orderId}`, {
        method: "PUT",
      });
      fetchOrderInfo();
    } catch (error) {
      console.error("Cannot accept order:", error);
      setCriticalError(
        "Cannot accept order at this time. Please try again later."
      );
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
      {/* When a critical error occurs, display a fixed banner with a countdown */}
      {criticalError && (
        <div className="w-full bg-red-600 text-white p-2 text-center fixed top-0 left-0 z-50">
          {`Critical error: ${criticalError} - Refreshing page in ${secondsLeft} seconds...`}
        </div>
      )}
      {/* Adding top padding so the fixed banner does not cover content */}
      <motion.div
        className="bg-gray-50 mt-10 pt-12 text-gray-800 flex flex-col xl:flex-row"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* --- Left Panel: Chat Section --- */}
        <motion.div
          className="flex-1 flex flex-col p-4 h-fit sticky xl:top-[80px] md:p-6 border-r border-gray-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4">
            Chat with: {recipientInfo?.name}
          </h2>
          <div
            ref={chatRef}
            className="flex-1 pr-2 max-h-[600px] min-h-24 overflow-y-auto grid grid-cols-1 auto-rows-min space-y-2 pb-4"
          >
            <AnimatePresence>
              {messages.map((msg, index) => {
                const isSender = msg.senderId === userInfo?._id;
                return (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <MessageBubble message={msg} isSender={isSender} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {/* Disable MessageInput if a critical error has occurred */}
          <MessageInput
            onSendMessage={sendMessage}
            disabled={!!criticalError}
          />
        </motion.div>

        {/* --- Right Panel: Negotiation & Order Details --- */}
        <motion.div
          className="w-full xl:w-1/3 flex flex-col p-4 xl:p-6"
          variants={itemVariants}
        >
          <NegotiationControls
            userInfo={userInfo}
            recipientInfo={recipientInfo}
            orderInfo={orderInfo}
            handleAcceptOrder={handleAcceptOrder}
            onSuccess={fetchOrderInfo}
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
      </motion.div>
    </>
  );
}
