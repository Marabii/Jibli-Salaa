"use client";

import { ChatMessage } from "@/interfaces/Websockets/ChatMessage";

type MessageBubbleProps = {
  message: ChatMessage;
  isSender: boolean;
};

export default function MessageBubble({
  message,
  isSender,
}: MessageBubbleProps) {
  // For black/white theme, let sender be white bubble with black text,
  // and receiver be a darker bubble.
  const bubbleClasses = isSender
    ? "bg-white text-black justify-self-start"
    : "bg-gray-300 text-black justify-self-end";

  return (
    <div
      className={`max-w-[70%] w-fit bg-gray-300 p-3 rounded-lg ${bubbleClasses}`}
    >
      <p className="text-sm w-fit break-words">{message.content}</p>
      <span className="block w-fit mt-1 text-xs opacity-70 text-right">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
