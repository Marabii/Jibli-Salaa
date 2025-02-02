"use client";

import { useEffect, useState, useRef, type JSX, useCallback } from "react";
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

// Framer Motion variants for simple fade/slide animations
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
  const chatRef = useRef<HTMLDivElement>(null);
  const orderId = searchParams.get("orderId") || "";
  const recipientId = searchParams.get("recipientId") || "";

  // Basic error handling if required params are missing
  if (!recipientId || !orderId) {
    throw new Error("Missing required parameters: recipientId or orderId");
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recipientInfo, setRecipientInfo] = useState<UserInfo | null>(null);

  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [orderInfo, setOrderInfo] = useState<CompletedOrder | null>(null);

  const stompClientRef = useRef<Client | null>(null);

  // Get notifications from Redux
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  // -- 1. Fetch user info and recipient info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoResult: ApiResponse<UserInfo> = await apiClient(
          "/api/protected/getUserInfo"
        );
        setUserInfo(userInfoResult.data);

        const recipientInfoResult: ApiResponse<UserInfo> = await apiClient(
          `/api/protected/getUserInfo/${recipientId}`
        );
        setRecipientInfo(recipientInfoResult.data);
      } catch (error) {
        alert("Something went wrong while fetching users. Please try again.");
        console.error("fetchUserInfo error:", error);
      }
    };

    fetchUserInfo();
  }, [recipientId]);

  // Helper function: Fetch order info
  const fetchOrderInfo = useCallback(async () => {
    if (!orderId) return;
    try {
      const response: ApiResponse<CompletedOrder> = await apiClient(
        `/api/getOrderById/${orderId}`
      );
      if (response?.data) {
        setOrderInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order info:", error);
    }
  }, [orderId]);

  // -- 2. Fetch order info initially when orderId changes
  useEffect(() => {
    fetchOrderInfo();
  }, [fetchOrderInfo, orderId]);

  // -- NEW: Refetch order info when an ORDER_ACCEPTED notification is received
  useEffect(() => {
    const orderAcceptedNotification = notifications.find((notif) => {
      return (
        notif.notificationType === NotificationType.ORDER_ACCEPTED &&
        (notif.notificationData as OrderAcceptedNotificationContent).orderId ===
          orderId
      );
    });
    if (orderAcceptedNotification) {
      fetchOrderInfo();
    }
  }, [fetchOrderInfo, notifications, orderId]);

  // -- 3. Initialize and connect WebSocket (SockJS + STOMP)
  useEffect(() => {
    if (userInfo && !stompClientRef.current) {
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVERURL}/ws`);
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect(
        {},
        (frame) => {
          setConnectionEstablished(true);

          // Subscribe to incoming messages
          stompClient.subscribe(
            `/user/${userInfo._id}/queue/messages`,
            (message) => {
              const receivedMessage: ChatMessage = JSON.parse(message.body);
              setMessages((prev) => [...prev, receivedMessage]);
            }
          );

          // Register user on server side
          stompClient.send(
            "/app/user.addUser",
            {},
            JSON.stringify({ userId: userInfo._id })
          );
        },
        (error) => {
          console.error("Connection error:", error);
          alert("Something went wrong connecting to chat. Please try again.");
        }
      );

      // Cleanup on unmount
      return () => {
        if (stompClientRef.current && connectionEstablished) {
          stompClientRef.current.disconnect(() => {
            console.log("Disconnected");
          });
          stompClientRef.current = null;
        }
      };
    }
  }, [connectionEstablished, userInfo]);

  // -- 4. Fetch chat history
  useEffect(() => {
    const fetchUserChatHistory = async () => {
      try {
        const result: ApiResponse<ChatMessage[]> = await apiClient(
          `/api/protected/getUserChatHistory/${recipientId}`
        );
        setMessages(result.data || []);
      } catch (error) {
        console.error("Failed to fetch user chat history:", error);
      }
    };

    if (recipientId) {
      fetchUserChatHistory();
    }
  }, [recipientId]);

  // Scroll down when a new message is received
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Send message function
  const sendMessage = (messageContent: string) => {
    if (!messageContent.trim()) return;

    if (connectionEstablished && stompClientRef.current) {
      const chatMessage: Partial<ChatMessage> = {
        orderId,
        recipientId,
        senderId: userInfo?._id,
        content: messageContent,
        timestamp: new Date(),
      };

      // Send over STOMP
      stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));

      // Immediately add to local state so the user sees it
      setMessages((prev) => [
        ...prev,
        chatMessage as ChatMessage, // cast since we know we have everything
      ]);
    }
  };

  // -- 6. Handle traveler acceptance
  async function handleAcceptOrder(orderId: string) {
    try {
      await apiClient(`/api/protected/acceptOrder/${orderId}`, {
        method: "PUT",
      });

      // Re-fetch the order info to update local state
      fetchOrderInfo();
    } catch (error) {
      console.error("Cannot accept order:", error);
      alert("Cannot accept order. Please try again.");
    }
  }

  return (
    <motion.div
      className="bg-gray-50 mt-10 text-gray-800 flex flex-col md:flex-row"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left panel: Chat section */}
      <motion.div
        className="flex-1 flex flex-col p-4 h-fit sticky top-[80px] md:p-6 border-r border-gray-300"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold mb-4">
          Chat with: {recipientInfo?.name}
        </h2>

        {/* Chat messages container */}
        <div
          ref={chatRef}
          className="flex-1 max-h-[600px] overflow-y-auto grid grid-cols-1 auto-rows-min space-y-2 pb-4"
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

        {/* Chat input */}
        <MessageInput onSendMessage={sendMessage} />
      </motion.div>

      {/* Right panel: Negotiation & Order Details */}
      <motion.div
        className="w-full md:w-1/3 flex flex-col p-4 md:p-6"
        variants={itemVariants}
      >
        <NegotiationControls
          userInfo={userInfo}
          recipientInfo={recipientInfo}
          orderInfo={orderInfo}
          handleAcceptOrder={handleAcceptOrder}
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
