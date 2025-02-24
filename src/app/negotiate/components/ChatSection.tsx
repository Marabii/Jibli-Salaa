"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";

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
      <h2 className="text-2xl font-bold mb-4">
        Chat with: {recipientName || "—"}
      </h2>

      <div
        ref={chatRef}
        className="flex-1 pr-2 max-h-[600px] min-h-24 overflow-y-auto grid grid-cols-1 auto-rows-min space-y-2 pb-4"
      >
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isSender = msg.senderId === userInfoId;
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

      <MessageInput onSendMessage={onSendMessage} disabled={!!criticalError} />
    </div>
  );
}
