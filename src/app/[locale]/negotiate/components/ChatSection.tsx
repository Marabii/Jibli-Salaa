"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

import MessageInput from "./MessageInput";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";
import { useTranslations } from "next-intl";

interface ChatSectionProps {
  messages: ChatMessage[];
  userInfoId?: string;
  criticalError: string | null;
  recipientName?: string;
  onSendMessage: (content: string) => void;
}

export default function ChatSection({
  messages,
  userInfoId,
  criticalError,
  recipientName,
  onSendMessage,
}: ChatSectionProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Negotiate.Components.ChatSection");

  // --- Auto-scroll Chat on New Message ---
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col p-4 h-fit sticky xl:top-[80px] md:p-6 border-r border-gray-300">
      <h2 dir="auto" className="text-2xl font-bold mb-4">
        {t("chatWith", { recipientName: recipientName || "—" })}
      </h2>

      <div
        ref={chatRef}
        className="flex-1 pr-2 max-h-[600px] min-h-24 overflow-y-auto grid grid-cols-1 auto-rows-min space-y-2 pb-4"
      >
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isSender = msg.senderId === userInfoId;
            const bubbleClasses = isSender
              ? "bg-white text-black justify-self-start"
              : "bg-gray-300 text-black justify-self-end";

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`max-w-[70%] w-fit bg-gray-300 p-3 rounded-lg ${bubbleClasses}`}
              >
                <p className="text-sm w-fit break-words">{msg.content}</p>
                <span className="block w-fit mt-1 text-xs opacity-70 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <MessageInput onSendMessage={onSendMessage} disabled={!!criticalError} />
    </div>
  );
}
