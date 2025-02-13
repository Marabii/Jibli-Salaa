"use client";

import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

type MessageInputProps = {
  onSendMessage: (msg: string) => void;
  disabled?: boolean;
};

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 100; // Adjust max height as needed
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      }
    }
  }, [message]);

  return (
    <div className="flex h-[40px] mt-4 w-full">
      <motion.textarea
        ref={textareaRef}
        className="flex-1 rounded-l-lg px-2 md:px-4 py-2 focus:outline-none bg-gray-200 text-gray-800 placeholder-gray-500 resize-none overflow-hidden"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.1 }}
        rows={1}
        disabled={disabled} // <-- DISABLE TEXTAREA
      />
      <motion.button
        onClick={handleSend}
        className="bg-white cursor-pointer text-black flex items-center justify-center rounded-r-lg hover:bg-gray-300 transition-colors
                   w-10 sm:w-12 md:w-14 h-full"
        whileTap={{ scale: 0.95 }}
        disabled={disabled || !message.trim()} // <-- DISABLE BUTTON
        aria-label="Send Message"
      >
        <Send className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
      </motion.button>
    </div>
  );
}
