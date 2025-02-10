"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  type JSX,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useSelector } from "react-redux";
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
  const IS_PRODUCTION = JSON.parse(process.env.IS_PRODUCTION || "false");

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

  const chatRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // --- Redux Notifications ---
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

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
        alert("Something went wrong while fetching users. Please try again.");
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
          // Register the user on the server side
          stompClient.send(
            "/app/user.addUser",
            {},
            JSON.stringify({ userId: userInfo._id })
          );
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          alert("Something went wrong connecting to chat. Please try again.");
        }
      );

      return () => {
        if (stompClientRef.current && connectionEstablished) {
          stompClientRef.current.disconnect(() => {
            console.log("Disconnected");
          });
          stompClientRef.current = null;
        }
      };
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
    if (!content.trim() || !connectionEstablished || !userInfo) return;

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
      alert("Cannot accept order. Please try again.");
    }
  };

  if (recipientId === userInfo?._id) {
    return (
      <h1>
        Why on earth would you want to chat with yourself ? Are you that lonely
        ??
      </h1>
    );
  }

  return (
    <motion.div
      className="bg-gray-50 mt-10 text-gray-800 flex flex-col xl:flex-row"
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
          className="flex-1 pr-2 max-h-[600px] overflow-y-auto grid grid-cols-1 auto-rows-min space-y-2 pb-4"
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
        <MessageInput onSendMessage={sendMessage} />
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
  );
}
