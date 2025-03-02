"use client";

import { useState, useRef, JSX } from "react";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import {
  MessageNotificationContent,
  NotificationType,
  NotificationContent,
  OrderAcceptedNotificationContent,
  OrderFinalizedNotificationContent,
  NegotiationRejectedNotificationContent,
  NegotiationPendingNotificationContent,
  ItemPaidNotificationContent,
} from "@/interfaces/Websockets/Notification";
import { useNotifications } from "@/hooks/useNotifications";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigRight, Check } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useTranslations } from "next-intl";

export default function NotificationsDropdown() {
  const { markAsRead } = useNotifications();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Header.Notifications");

  // Only use the outsideClick hook on md+ screens (the overlay on small screens handles clicks).
  useOutsideClick(dropdownRef, () => {
    if (window.innerWidth >= 768) {
      setShowDropdown(false);
    }
  });

  const handleToggleDropdown = () => setShowDropdown((prev) => !prev);

  // Framer Motion variants for the dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="relative inline-block">
      {/* Bell Icon */}
      <div
        className="relative cursor-pointer text-gray-600 hover:text-black"
        onClick={handleToggleDropdown}
      >
        <FaBell color="white" size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-500 border-2 border-white rounded-full w-3 h-3" />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* ========= Overlay for Small Screens ========= */}
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDropdown(false)}
            />

            {/* ========= Modal/Dropdown Container ========= */}
            <motion.div
              key="dropdown"
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="z-50 fixed md:absolute top-0 md:top-auto left-0 md:left-auto right-0 md:right-0 w-full md:w-80 h-full md:h-auto md:mt-2 overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-none md:rounded-lg"
            >
              {/* Top bar (header) */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white md:rounded-t-lg">
                <h3 className="font-semibold">{t("header")}</h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-white hover:text-gray-200 text-sm"
                >
                  {t("close")}
                </button>
              </div>

              {/* Notification List */}
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-600">{t("noNotifications")}</p>
              ) : (
                <ul className="list-none m-0 p-0">
                  {notifications.map((notification) => {
                    const { notificationType, notificationData } = notification;
                    const timestamp =
                      "timestamp" in notificationData
                        ? notificationData.timestamp
                        : new Date().toString();

                    let notificationComponent: JSX.Element;

                    switch (notificationType) {
                      case NotificationType.MESSAGE: {
                        const senderId =
                          "senderId" in notificationData
                            ? (notificationData as MessageNotificationContent)
                                .senderId
                            : null;
                        const senderName =
                          "senderName" in notificationData
                            ? (notificationData as MessageNotificationContent)
                                .senderName
                            : null;
                        const orderId = notification.orderId;

                        notificationComponent = (
                          <div dir="auto" className="cursor-pointer">
                            <p className="text-gray-800 font-medium">
                              {t("message", { senderName })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <div className="flex gap-2 mt-2 flex-col sm:flex-row sm:justify-between sm:items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDropdown(false);
                                  markAsRead(notification.id);
                                }}
                                className="mt-2 text-balance text-center sm:mt-0 px-2 py-1 text-xs font-semibold text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors duration-200"
                              >
                                {t("markAsRead")}
                                <Check className="inline-block ml-1" />
                              </button>

                              <Link
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                href={`/negotiate?recipientId=${senderId}&orderId=${orderId}`}
                                className="mt-2 text-balance text-center sm:mt-0 px-2 py-1 text-xs font-semibold text-purple-500 border border-purple-500 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200"
                              >
                                {t("negotiatePage")}
                                <ArrowBigRight className="inline-block ml-1" />
                              </Link>
                            </div>
                          </div>
                        );
                        break;
                      }

                      case NotificationType.ORDER_ACCEPTED: {
                        const productName =
                          "productName" in notificationData
                            ? (
                                notificationData as OrderAcceptedNotificationContent
                              ).productName
                            : "";
                        const travelerName =
                          "travelerName" in notificationData
                            ? (
                                notificationData as OrderAcceptedNotificationContent
                              ).travelerName
                            : "";
                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {t("orderAccepted", {
                                productName,
                                travelerName,
                              })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowDropdown(false);
                              }}
                              className="mt-2 text-xs text-blue-500 hover:underline"
                            >
                              {t("markAsRead")}
                            </button>
                          </div>
                        );
                        break;
                      }

                      case NotificationType.ORDER_FINALIZED: {
                        const productName =
                          "productName" in notificationData
                            ? (
                                notificationData as OrderFinalizedNotificationContent
                              ).productName
                            : "";
                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {t("orderFinalized", { productName })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowDropdown(false);
                              }}
                              className="mt-2 text-xs text-blue-500 hover:underline"
                            >
                              {t("markAsRead")}
                            </button>
                          </div>
                        );
                        break;
                      }

                      case NotificationType.NEGOTIATION_REJECTED: {
                        const productName =
                          "productName" in notificationData
                            ? (
                                notificationData as NegotiationRejectedNotificationContent
                              ).productName
                            : "";
                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {t("negotiationRejected", { productName })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowDropdown(false);
                              }}
                              className="mt-2 text-xs text-blue-500 hover:underline"
                            >
                              {t("markAsRead")}
                            </button>
                          </div>
                        );
                        break;
                      }

                      case NotificationType.NEGOTIATION_PENDING: {
                        const productName =
                          "productName" in notificationData
                            ? (
                                notificationData as NegotiationPendingNotificationContent
                              ).productName
                            : "";

                        const buyerId =
                          "buyerId" in notificationData
                            ? (
                                notificationData as NegotiationPendingNotificationContent
                              ).buyerId
                            : "";

                        const orderId = notification.orderId;

                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {t("negotiationPending", { productName })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <div className="flex gap-2 mt-2 flex-col sm:flex-row sm:justify-between sm:items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDropdown(false);
                                  markAsRead(notification.id);
                                }}
                                className="mt-2 text-balance text-center sm:mt-0 px-2 py-1 text-xs font-semibold text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors duration-200"
                              >
                                {t("markAsRead")}
                                <Check className="inline-block ml-1" />
                              </button>

                              <Link
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                href={`/negotiate?recipientId=${buyerId}&orderId=${orderId}`}
                                className="mt-2 text-balance text-center sm:mt-0 px-2 py-1 text-xs font-semibold text-purple-500 border border-purple-500 rounded hover:bg-purple-500 hover:text-white transition-colors duration-200"
                              >
                                {t("negotiatePage")}
                                <ArrowBigRight className="inline-block ml-1" />
                              </Link>
                            </div>
                          </div>
                        );
                        break;
                      }

                      case NotificationType.ITEM_PAID: {
                        const buyerName =
                          "buyerName" in notificationData
                            ? (notificationData as ItemPaidNotificationContent)
                                .buyerName
                            : "";
                        const productName =
                          "productName" in notificationData
                            ? (notificationData as ItemPaidNotificationContent)
                                .productName
                            : "";
                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {t("itemPaid", { buyerName, productName })}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowDropdown(false);
                              }}
                              className="mt-2 text-xs text-blue-500 hover:underline"
                            >
                              {t("markAsRead")}
                            </button>
                          </div>
                        );
                        break;
                      }

                      default: {
                        notificationComponent = (
                          <div dir="auto">
                            <p className="text-gray-800 font-medium">
                              {
                                (notificationData as NotificationContent)
                                  .content
                              }
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(timestamp).toLocaleString()}
                            </p>
                            <button
                              onClick={() => {
                                markAsRead(notification.id);
                                setShowDropdown(false);
                              }}
                              className="mt-2 text-xs text-blue-500 hover:underline"
                            >
                              {t("markAsRead")}
                            </button>
                          </div>
                        );
                        break;
                      }
                    }

                    return (
                      <motion.li
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 border-b last:border-none transition-colors bg-blue-50 hover:bg-gray-50"
                      >
                        {notificationComponent}
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
