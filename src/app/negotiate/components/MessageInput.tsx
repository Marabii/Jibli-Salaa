"use client";

import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react"; // Importing the Send icon from lucide-react

type MessageInputProps = {
  onSendMessage: (msg: string) => void;
};

export default function MessageInput({ onSendMessage }: MessageInputProps) {
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

  // Auto-resize the textarea whenever the message changes, with a max height limit
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      const maxHeight = 100; // Adjust max height as needed (in pixels)

      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // Enable scrolling when max height is reached
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = "hidden"; // Hide scrollbar when below max height
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
        rows={1} // Start with one row
      />
      <motion.button
        onClick={handleSend}
        className="bg-white cursor-pointer text-black flex items-center justify-center rounded-r-lg hover:bg-gray-300 transition-colors
                   w-10 sm:w-12 md:w-14 h-full"
        whileTap={{ scale: 0.95 }}
        disabled={!message.trim()} // Disable button if message is empty
        aria-label="Send Message" // Accessibility: Provide an accessible label
      >
        <Send className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />{" "}
        {/* Responsive Icon Sizes */}
      </motion.button>
    </div>
  );
}
