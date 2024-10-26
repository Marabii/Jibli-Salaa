// pages/negotiate/[recipientId].tsx

"use client";

import { UserInfo } from "@/interfaces/userInfo/userInfo";
import { ChatMessage } from "@/interfaces/Chatting/Message";
import apiClient from "@/utils/apiClient";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";

interface Params {
  recipientId: string;
}

export default function NegotiatePage({
  params,
}: {
  params: Promise<Params>;
}): JSX.Element {
  const [formData, setFormData] = useState<{ message: string }>({
    message: "",
  });

  const [recipientId, setRecipientId] = useState<string>("");

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      setRecipientId(unwrappedParams.recipientId);
    };

    fetchParams();
  }, [params]);

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [connectionEstablished, setConnectionEstablished] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Use refs to persist the socket and client across renders
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoResponse: UserInfo = await apiClient(
          "/api/protected/getUserInfo"
        );
        setUserInfo(userInfoResponse);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo && !stompClientRef.current) {
      // Initialize SockJS and Stomp client
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVERURL}/ws`);
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect(
        {},
        (frame) => {
          console.log("Connected: " + frame);
          setConnectionEstablished(true);

          // Subscribe to incoming messages
          stompClient.subscribe(
            `/user/${userInfo._id}/queue/messages`,
            (message) => {
              console.log("Message received: ", message.body);
              const receivedMessage: ChatMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
          );

          // Register user
          stompClient.send(
            "/app/user.addUser",
            {},
            JSON.stringify({ userId: userInfo._id })
          );
        },
        (error) => {
          console.error("Connection error:", error);
        }
      );

      // Cleanup on component unmount
      return () => {
        if (stompClientRef.current && connectionEstablished) {
          stompClientRef.current.disconnect(() => {
            console.log("Disconnected");
          });
          stompClientRef.current = null;
        }
      };
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchUserChatHistory = async () => {
      try {
        const chatHistory: ChatMessage[] = await apiClient(
          `/api/protected/getUserChatHistory/${recipientId}`
        );
        setMessages(chatHistory);
      } catch (error) {
        console.error("Failed to fetch user chat history:", error);
      }
    };

    if (recipientId) {
      fetchUserChatHistory();
    }
  }, [recipientId]);

  const sendMessage = (messageContent: string) => {
    if (connectionEstablished && stompClientRef.current) {
      const chatMessage: Partial<ChatMessage> = {
        recipientId: recipientId,
        senderId: userInfo?._id,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
      // Add the sent message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        chatMessage as ChatMessage,
      ]);
      // Clear input field
      setFormData({ message: "" });
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-xl font-bold mb-4">
        You are talking to: {recipientId}
      </h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {/* Chat messages */}
        {messages.map((msg, index) => {
          const isSender = msg.senderId === userInfo?._id;
          return (
            <div
              key={msg.id || index}
              className={`flex mb-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs px-4 py-2 rounded-lg ${
                  isSender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.message}
          onChange={(e) => setFormData({ message: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(formData.message);
            }
          }}
        />
        <button
          onClick={() => sendMessage(formData.message)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
