"use client";

import { useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import {
  MessageNotificationContent,
  NotificationType,
} from "@/interfaces/Websockets/Notification";
import { useNotifications } from "@/hooks/useNotifications";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import useOutsideClick from "@/hooks/useOutsideClick";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigRight, Check } from "lucide-react";
import { NotificationContent } from "../../interfaces/Websockets/Notification";

export default function NotificationsDropdown() {
  // Only use markAsRead from the custom hook now.
  const { markAsRead } = useNotifications();
  // Get notifications from the redux store.
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(notificationsDropdownRef, () => setShowDropdown(false));

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Framer Motion variants for the dropdown container
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div ref={notificationsDropdownRef} className="relative inline-block">
      {/* Bell Icon */}
      <div
        className="relative cursor-pointer text-gray-600 hover:text-black"
        onClick={handleToggleDropdown}
      >
        <FaBell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 border-2 border-white rounded-full w-3 h-3" />
        )}
      </div>

      {/* Dropdown Panel with Animation */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <h3 className="font-semibold">Notifications</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-white hover:text-gray-200 text-sm"
              >
                Close
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-600">No notifications</p>
            ) : (
              <ul className="list-none m-0 p-0">
                {notifications.map((notification) => {
                  const { notificationType, notificationData } = notification;
                  // Fallback timestamp if not provided.
                  const timestamp =
                    "timestamp" in notificationData
                      ? notificationData.timestamp
                      : new Date().toString();

                  // Determine the display text based on notification type.
                  const displayText = (notificationData as NotificationContent)
                    .content;

                  const senderId =
                    "senderId" in notificationData
                      ? (notificationData as MessageNotificationContent)
                          .senderId
                      : null;
                  const orderId =
                    "orderId" in notificationData
                      ? (notificationData as MessageNotificationContent).orderId
                      : null;

                  return (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border-b last:border-none transition-colors bg-blue-50 hover:bg-gray-50"
                    >
                      {notificationType === NotificationType.MESSAGE &&
                      senderId &&
                      orderId ? (
                        <div className="cursor-pointer">
                          <p className="text-gray-800 font-medium">
                            {displayText}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(timestamp).toLocaleString()}
                          </p>
                          <div className="flex gap-2 mt-2 flex-col sm:flex-row sm:justify-between sm:items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="mt-2 sm:mt-0 px-2 py-1 text-xs font-semibold text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors duration-200"
                            >
                              Mark as Read
                              <Check className="inline-block ml-1" />
                            </button>
                            <Link
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              href={`/negotiate?recipientId=${senderId}&orderId=${orderId}`}
                              className="mt-2 sm:mt-0 px-2 py-1 text-xs font-semibold text-purple-500 border border-purple-500 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200"
                            >
                              Negotiate Page{" "}
                              <ArrowBigRight className="inline-block ml-1" />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-800 font-medium">
                            {displayText}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(timestamp).toLocaleString()}
                          </p>

                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="mt-2 text-xs text-blue-500 hover:underline"
                          >
                            Mark As Read
                          </button>
                        </div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
